import { create } from 'zustand'
import type { TimerPhase, TimerStatus } from '@/types'

interface TimerStore {
  phase: TimerPhase
  status: TimerStatus
  secondsRemaining: number
  pomodorosInCycle: number
  sessionStartTime: string | null
  /** Wall-clock timestamp (ms) when the timer was last started/resumed */
  _startedAt: number | null
  /** Seconds that were remaining when the timer was last started/resumed */
  _startedWithSeconds: number | null
  setPhase: (phase: TimerPhase, duration: number) => void
  start: (durationSeconds: number) => void
  pause: () => void
  resume: () => void
  tick: () => void
  reset: (durationSeconds: number) => void
  skip: () => void
  incrementCycleCount: () => void
  resetCycleCount: () => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  phase: 'work',
  status: 'idle',
  secondsRemaining: 25 * 60,
  pomodorosInCycle: 0,
  sessionStartTime: null,
  _startedAt: null,
  _startedWithSeconds: null,

  setPhase: (phase, duration) =>
    set({ phase, status: 'idle', secondsRemaining: duration * 60, sessionStartTime: null, _startedAt: null, _startedWithSeconds: null }),

  start: (durationSeconds) =>
    set({
      status: 'running',
      secondsRemaining: durationSeconds,
      sessionStartTime: new Date().toISOString(),
      _startedAt: Date.now(),
      _startedWithSeconds: durationSeconds
    }),

  pause: () =>
    set((state) => {
      // Snapshot the true remaining time on pause
      const remaining = state._startedAt != null && state._startedWithSeconds != null
        ? Math.max(0, state._startedWithSeconds - Math.floor((Date.now() - state._startedAt) / 1000))
        : state.secondsRemaining
      return { status: 'paused', secondsRemaining: remaining, _startedAt: null, _startedWithSeconds: null }
    }),

  resume: () =>
    set((state) => ({
      status: 'running',
      _startedAt: Date.now(),
      _startedWithSeconds: state.secondsRemaining
    })),

  tick: () =>
    set((state) => {
      // Compute remaining time from wall clock instead of decrementing
      if (state._startedAt != null && state._startedWithSeconds != null) {
        const elapsed = Math.floor((Date.now() - state._startedAt) / 1000)
        return { secondsRemaining: Math.max(0, state._startedWithSeconds - elapsed) }
      }
      return { secondsRemaining: Math.max(0, state.secondsRemaining - 1) }
    }),

  reset: (durationSeconds) =>
    set({ status: 'idle', secondsRemaining: durationSeconds, sessionStartTime: null, _startedAt: null, _startedWithSeconds: null }),

  skip: () => set({ status: 'idle', secondsRemaining: 0, _startedAt: null, _startedWithSeconds: null }),

  incrementCycleCount: () =>
    set((state) => ({ pomodorosInCycle: state.pomodorosInCycle + 1 })),

  resetCycleCount: () => set({ pomodorosInCycle: 0 })
}))
