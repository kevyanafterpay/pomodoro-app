import { create } from 'zustand'
import { createStorageAdapter } from '@/lib/storage/adapter'
import { startOfDay, startOfWeek, isWithinInterval, endOfDay, addDays } from 'date-fns'
import type { PomodoroSession } from '@/types'

const storage = createStorageAdapter()
const STORAGE_KEY = 'pomodoro-sessions'

export interface DayStats {
  totalPomodoros: number
  completedPomodoros: number
  totalFocusMinutes: number
  taskBreakdown: { taskId: string; count: number }[]
}

interface SessionStore {
  sessions: PomodoroSession[]
  logSession: (session: PomodoroSession) => void
  getSessionsForDay: (date: Date) => PomodoroSession[]
  getSessionsForWeek: (weekStart: Date) => PomodoroSession[]
  getStatsForDay: (date: Date) => DayStats
  getTotalPomodoros: () => number
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: storage.get<PomodoroSession[]>(STORAGE_KEY) ?? [],

  logSession: (session) =>
    set((state) => {
      const sessions = [...state.sessions, session]
      storage.set(STORAGE_KEY, sessions)
      return { sessions }
    }),

  getSessionsForDay: (date) => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    return get().sessions.filter(
      (s) =>
        s.phase === 'work' &&
        isWithinInterval(new Date(s.startedAt), { start: dayStart, end: dayEnd })
    )
  },

  getSessionsForWeek: (weekStart) => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 })
    const end = endOfDay(addDays(start, 6))
    return get().sessions.filter(
      (s) =>
        s.phase === 'work' &&
        isWithinInterval(new Date(s.startedAt), { start, end })
    )
  },

  getStatsForDay: (date) => {
    const daySessions = get().getSessionsForDay(date)
    const completed = daySessions.filter((s) => s.completedAt !== null)
    const taskMap = new Map<string, number>()
    for (const s of completed) {
      const key = s.taskId ?? 'unlinked'
      taskMap.set(key, (taskMap.get(key) ?? 0) + 1)
    }
    return {
      totalPomodoros: daySessions.length,
      completedPomodoros: completed.length,
      totalFocusMinutes: completed.reduce((sum, s) => sum + s.durationMinutes, 0),
      taskBreakdown: Array.from(taskMap.entries()).map(([taskId, count]) => ({ taskId, count }))
    }
  },

  getTotalPomodoros: () =>
    get().sessions.filter((s) => s.phase === 'work' && s.completedAt !== null).length
}))
