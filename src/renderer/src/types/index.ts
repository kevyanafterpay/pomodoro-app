export type Priority = 'low' | 'medium' | 'high'
export type TimerPhase = 'work' | 'short-break' | 'long-break'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface Task {
  id: string
  title: string
  priority: Priority
  category: string
  completed: boolean
  pomodorosCompleted: number
  estimatedPomodoros: number | null
  createdAt: string
  completedAt: string | null
}

export interface PomodoroSession {
  id: string
  taskId: string | null
  phase: TimerPhase
  startedAt: string
  completedAt: string | null
  durationMinutes: number
}

export interface AppSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakAfter: number
  soundEnabled: boolean
  soundVolume: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  categories: string[]
  dailyGoal: number
}
