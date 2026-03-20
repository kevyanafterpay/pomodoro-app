import { Play, Pause, RotateCcw, SkipForward, RefreshCw } from 'lucide-react'
import { useTimerStore } from '@/stores/timerStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTaskStore } from '@/stores/taskStore'
import { useTimer } from '@/hooks/useTimer'
import { ProgressRing } from './ProgressRing'
import { formatTime } from '@/lib/utils'
import type { TimerPhase } from '@/types'

const phaseLabels: Record<TimerPhase, string> = {
  work: 'Work',
  'short-break': 'Short Break',
  'long-break': 'Long Break'
}

export function Timer() {
  const { phase, status, secondsRemaining, pomodorosInCycle } = useTimerStore()
  const { settings } = useSettingsStore()
  const { start, pause, reset, skip, switchPhase } = useTimer()
  const resetCycleCount = useTimerStore((s) => s.resetCycleCount)
  const tasks = useTaskStore((s) => s.tasks)
  const activeTaskId = useTaskStore((s) => s.activeTaskId)

  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null

  const getDurationSeconds = (p: TimerPhase): number => {
    switch (p) {
      case 'work':
        return settings.workDuration * 60
      case 'short-break':
        return settings.shortBreakDuration * 60
      case 'long-break':
        return settings.longBreakDuration * 60
    }
  }

  const totalSeconds = getDurationSeconds(phase)
  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0

  const phases: TimerPhase[] = ['work', 'short-break', 'long-break']

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Phase tabs */}
      <div className="flex gap-1 rounded-lg bg-surface p-1 border border-border">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => status === 'idle' && switchPhase(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              phase === p
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text'
            } ${status !== 'idle' ? 'cursor-not-allowed opacity-60' : ''}`}
            disabled={status !== 'idle'}
          >
            {phaseLabels[p]}
          </button>
        ))}
      </div>

      {/* Progress ring + time */}
      <ProgressRing progress={progress} phase={phase}>
        <div className="text-center">
          <div className="text-5xl font-mono font-bold text-text">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-sm text-text-muted mt-1">{phaseLabels[phase]}</div>
        </div>
      </ProgressRing>

      {/* Active task */}
      {activeTask && (
        <div className="text-sm text-text-muted">
          Working on: <span className="font-medium text-text">{activeTask.title}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {status === 'running' ? (
          <button
            onClick={pause}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-light transition-colors"
          >
            <Pause size={20} />
            Pause
          </button>
        ) : (
          <button
            onClick={start}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-light transition-colors"
          >
            <Play size={20} />
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}

        <button
          onClick={reset}
          className="p-3 rounded-full border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>

        {status !== 'idle' && (
          <button
            onClick={skip}
            className="p-3 rounded-full border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors"
            title="Skip"
          >
            <SkipForward size={20} />
          </button>
        )}
      </div>

      {/* Cycle dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: settings.longBreakAfter }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < pomodorosInCycle ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
        <span className="text-xs text-text-muted ml-1">
          {pomodorosInCycle}/{settings.longBreakAfter}
        </span>
        {pomodorosInCycle > 0 && (
          <button
            onClick={() => { resetCycleCount(); switchPhase('work') }}
            className="ml-1 p-1 rounded text-text-muted hover:text-primary transition-colors"
            title="Restart from cycle 1"
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
