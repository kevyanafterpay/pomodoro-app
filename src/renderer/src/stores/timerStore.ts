import { create } from 'zustand'
import type { TimerPhase, TimerStatus } from '@/types'

interface TimerStore {
  phase: TimerPhase
  status: TimerStatus
  secondsRemaining: number
  pomodorosInCycle: number
  sessionStartTime: string | null
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

  setPhase: (phase, duration) =>
    set({ phase, status: 'idle', secondsRemaining: duration * 60, sessionStartTime: null }),

  start: (durationSeconds) =>
    set({
      status: 'running',
      secondsRemaining: durationSeconds,
      sessionStartTime: new Date().toISOString()
    }),

  pause: () => set({ status: 'paused' }),

  resume: () => set({ status: 'running' }),

  tick: () =>
    set((state) => ({
      secondsRemaining: Math.max(0, state.secondsRemaining - 1)
    })),

  reset: (durationSeconds) =>
    set({ status: 'idle', secondsRemaining: durationSeconds, sessionStartTime: null }),

  skip: () => set({ status: 'idle', secondsRemaining: 0 }),

  incrementCycleCount: () =>
    set((state) => ({ pomodorosInCycle: state.pomodorosInCycle + 1 })),

  resetCycleCount: () => set({ pomodorosInCycle: 0 })
}))
