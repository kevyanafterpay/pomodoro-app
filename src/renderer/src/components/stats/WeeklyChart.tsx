import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useSessionStore } from '@/stores/sessionStore'
import { startOfWeek, addDays, format } from 'date-fns'

export function WeeklyChart() {
  const sessions = useSessionStore((s) => s.sessions)

  const data = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(weekStart, i)
      const dayStr = format(day, 'yyyy-MM-dd')
      const count = sessions.filter(
        (s) =>
          s.phase === 'work' &&
          s.completedAt !== null &&
          format(new Date(s.startedAt), 'yyyy-MM-dd') === dayStr
      ).length
      const focusMinutes = sessions
        .filter(
          (s) =>
            s.phase === 'work' &&
            s.completedAt !== null &&
            format(new Date(s.startedAt), 'yyyy-MM-dd') === dayStr
        )
        .reduce((sum, s) => sum + s.durationMinutes, 0)
      return {
        day: format(day, 'EEE'),
        pomodoros: count,
        focusMinutes
      }
    })
  }, [sessions])

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        This Week
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis allowDecimals={false} domain={[0, 'auto']} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [
                name === 'pomodoros' ? `${value} pomodoros` : `${value} min`,
                name === 'pomodoros' ? 'Pomodoros' : 'Focus'
              ]}
            />
            <Bar dataKey="pomodoros" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
