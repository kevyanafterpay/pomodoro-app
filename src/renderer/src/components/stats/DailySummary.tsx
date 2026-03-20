import { useSessionStore } from '@/stores/sessionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTaskStore } from '@/stores/taskStore'
import { isToday } from 'date-fns'

export function DailySummary() {
  const stats = useSessionStore((s) => s.getStatsForDay(new Date()))
  const { settings } = useSettingsStore()
  const tasks = useTaskStore((s) => s.tasks)
  const tasksCompletedToday = tasks.filter(
    (t) => t.completed && t.completedAt && isToday(new Date(t.completedAt))
  ).length

  const goalProgress = Math.min(stats.completedPomodoros / settings.dailyGoal, 1)
  const hours = Math.floor(stats.totalFocusMinutes / 60)
  const minutes = stats.totalFocusMinutes % 60

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Today</h3>

      {/* Pomodoro goal */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-text">Pomodoros</span>
          <span className="font-mono font-bold text-primary">
            {stats.completedPomodoros}/{settings.dailyGoal}
          </span>
        </div>
        <div className="w-full h-3 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${goalProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-muted rounded-lg p-3">
          <div className="text-2xl font-bold text-text">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </div>
          <div className="text-xs text-text-muted">Focus time</div>
        </div>
        <div className="bg-surface-muted rounded-lg p-3">
          <div className="text-2xl font-bold text-text">{tasksCompletedToday}</div>
          <div className="text-xs text-text-muted">Tasks done</div>
        </div>
      </div>
    </div>
  )
}
