import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useSessionStore } from '@/stores/sessionStore'
import { useTaskStore } from '@/stores/taskStore'
import { format, differenceInCalendarDays } from 'date-fns'

export function AllTimeStats() {
  const sessions = useSessionStore((s) => s.sessions)
  const tasks = useTaskStore((s) => s.tasks)

  const stats = useMemo(() => {
    const workSessions = sessions.filter((s) => s.phase === 'work' && s.completedAt !== null)
    const totalFocusMinutes = workSessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    const totalHours = Math.floor(totalFocusMinutes / 60)

    // Most productive day of week
    const dayCount: Record<string, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    }
    for (const s of workSessions) {
      const day = format(new Date(s.startedAt), 'EEE')
      dayCount[day] = (dayCount[day] ?? 0) + 1
    }
    const dayData = Object.entries(dayCount).map(([day, count]) => ({ day, count }))

    // Top categories
    const catMap = new Map<string, number>()
    for (const s of workSessions) {
      if (s.taskId) {
        const task = tasks.find((t) => t.id === s.taskId)
        if (task) {
          catMap.set(task.category, (catMap.get(task.category) ?? 0) + 1)
        }
      }
    }
    const categoryData = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    // Longest streak
    const uniqueDays = [...new Set(workSessions.map((s) => format(new Date(s.startedAt), 'yyyy-MM-dd')))]
      .sort()
    let longestStreak = 0
    let currentStreak = uniqueDays.length > 0 ? 1 : 0
    for (let i = 1; i < uniqueDays.length; i++) {
      if (differenceInCalendarDays(new Date(uniqueDays[i]), new Date(uniqueDays[i - 1])) === 1) {
        currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak)

    return { totalSessions: workSessions.length, totalHours, totalFocusMinutes, dayData, categoryData, longestStreak }
  }, [sessions, tasks])

  if (stats.totalSessions === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>Complete your first Pomodoro to see stats</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">All Time</h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
          <div className="text-xs text-text-muted">Sessions</div>
        </div>
        <div className="bg-surface-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalHours}h</div>
          <div className="text-xs text-text-muted">Focus time</div>
        </div>
        <div className="bg-surface-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{stats.longestStreak}</div>
          <div className="text-xs text-text-muted">Day streak</div>
        </div>
      </div>

      {/* Productive days */}
      <div>
        <h4 className="text-xs font-medium text-text-muted mb-2">Sessions by Day of Week</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dayData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis allowDecimals={false} domain={[0, 'auto']} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-success)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top categories */}
      {stats.categoryData.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-text-muted mb-2">Top Categories</h4>
          <div className="space-y-2">
            {stats.categoryData.map(({ category, count }) => {
              const maxCount = stats.categoryData[0].count
              return (
                <div key={category} className="flex items-center gap-2">
                  <span className="text-xs text-text w-20 truncate">{category}</span>
                  <div className="flex-1 h-4 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-text-muted w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
