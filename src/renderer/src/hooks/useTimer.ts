import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTaskStore } from '@/stores/taskStore'
import { useSessionStore } from '@/stores/sessionStore'
import { playPhaseCompleteSound } from '@/lib/audio'
import { generateId } from '@/lib/utils'
import type { TimerPhase } from '@/types'

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timer = useTimerStore()
  const { settings } = useSettingsStore()
  const activeTaskId = useTaskStore((s) => s.activeTaskId)
  const incrementPomodoros = useTaskStore((s) => s.incrementPomodoros)
  const logSession = useSessionStore((s) => s.logSession)

  const getDuration = useCallback(
    (phase: TimerPhase): number => {
      switch (phase) {
        case 'work':
          return settings.workDuration
        case 'short-break':
          return settings.shortBreakDuration
        case 'long-break':
          return settings.longBreakDuration
      }
    },
    [settings]
  )

  const getNextPhase = useCallback((): TimerPhase => {
    if (timer.phase !== 'work') return 'work'
    const nextCount = timer.pomodorosInCycle + 1
    return nextCount >= settings.longBreakAfter ? 'long-break' : 'short-break'
  }, [timer.phase, timer.pomodorosInCycle, settings.longBreakAfter])

  const completePhase = useCallback(() => {
    // Log session
    logSession({
      id: generateId(),
      taskId: activeTaskId,
      phase: timer.phase,
      startedAt: timer.sessionStartTime ?? new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMinutes: getDuration(timer.phase)
    })

    // Increment task pomodoros if work phase
    if (timer.phase === 'work' && activeTaskId) {
      incrementPomodoros(activeTaskId)
    }

    // Update cycle count
    if (timer.phase === 'work') {
      timer.incrementCycleCount()
    }

    // Audio notification
    if (settings.soundEnabled) {
      playPhaseCompleteSound(settings.soundVolume)
    }

    // Browser notification
    try {
      if (Notification.permission === 'granted') {
        const nextPhase = getNextPhase()
        new Notification('Pomodoro', {
          body:
            timer.phase === 'work'
              ? 'Time for a break!'
              : 'Break is over — back to work!'
        })
      }
    } catch {
      // Notification not available
    }

    // Transition to next phase
    const nextPhase = getNextPhase()
    if (nextPhase === 'work' && timer.phase === 'long-break') {
      timer.resetCycleCount()
    }
    const nextDuration = getDuration(nextPhase)
    timer.setPhase(nextPhase, nextDuration)

    // Auto-start next phase if enabled
    const shouldAutoStart =
      (nextPhase === 'work' && settings.autoStartWork) ||
      (nextPhase !== 'work' && settings.autoStartBreaks)
    if (shouldAutoStart) {
      timer.start(nextDuration * 60)
    }
  }, [
    timer,
    activeTaskId,
    settings,
    logSession,
    incrementPomodoros,
    getDuration,
    getNextPhase
  ])

  // Interval tick
  useEffect(() => {
    if (timer.status === 'running') {
      intervalRef.current = setInterval(() => {
        const current = useTimerStore.getState()
        current.tick()
        // Re-read after tick to check wall-clock-based remaining time
        if (useTimerStore.getState().secondsRemaining <= 0) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          completePhase()
        }
      }, 250)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timer.status, completePhase])

  const start = useCallback(() => {
    if (timer.status === 'idle') {
      timer.start(timer.secondsRemaining > 0 ? timer.secondsRemaining : getDuration(timer.phase) * 60)
    } else if (timer.status === 'paused') {
      timer.resume()
    }
  }, [timer, getDuration])

  const pause = useCallback(() => {
    timer.pause()
  }, [timer])

  const reset = useCallback(() => {
    // Log interrupted session if running
    if (timer.status === 'running' || timer.status === 'paused') {
      logSession({
        id: generateId(),
        taskId: activeTaskId,
        phase: timer.phase,
        startedAt: timer.sessionStartTime ?? new Date().toISOString(),
        completedAt: null,
        durationMinutes: getDuration(timer.phase)
      })
    }
    timer.reset(getDuration(timer.phase) * 60)
  }, [timer, activeTaskId, logSession, getDuration])

  const skip = useCallback(() => {
    completePhase()
  }, [completePhase])

  const switchPhase = useCallback(
    (phase: TimerPhase) => {
      timer.setPhase(phase, getDuration(phase))
    },
    [timer, getDuration]
  )

  return { start, pause, reset, skip, switchPhase }
}
