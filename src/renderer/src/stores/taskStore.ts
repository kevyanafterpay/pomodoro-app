import { create } from 'zustand'
import { createStorageAdapter } from '@/lib/storage/adapter'
import { generateId } from '@/lib/utils'
import type { Task, Priority } from '@/types'

const storage = createStorageAdapter()
const STORAGE_KEY = 'pomodoro-tasks'

interface TaskStore {
  tasks: Task[]
  activeTaskId: string | null
  addTask: (title: string, priority: Priority, category: string, estimatedPomodoros: number | null) => void
  updateTask: (id: string, partial: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
  setActiveTask: (id: string | null) => void
  incrementPomodoros: (id: string) => void
}

function persist(tasks: Task[]): void {
  storage.set(STORAGE_KEY, tasks)
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: storage.get<Task[]>(STORAGE_KEY) ?? [],
  activeTaskId: null,

  addTask: (title, priority, category, estimatedPomodoros) => {
    const task: Task = {
      id: generateId(),
      title,
      priority,
      category,
      completed: false,
      pomodorosCompleted: 0,
      estimatedPomodoros,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    set((state) => {
      const tasks = [...state.tasks, task]
      persist(tasks)
      return { tasks }
    })
  },

  updateTask: (id, partial) =>
    set((state) => {
      const tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...partial } : t))
      persist(tasks)
      return { tasks }
    }),

  deleteTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id)
      persist(tasks)
      return {
        tasks,
        activeTaskId: state.activeTaskId === id ? null : state.activeTaskId
      }
    }),

  toggleComplete: (id) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null
            }
          : t
      )
      persist(tasks)
      return {
        tasks,
        activeTaskId: state.activeTaskId === id && !get().tasks.find((t) => t.id === id)?.completed
          ? null
          : state.activeTaskId
      }
    }),

  setActiveTask: (id) => set({ activeTaskId: id }),

  incrementPomodoros: (id) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 } : t
      )
      persist(tasks)
      return { tasks }
    })
}))
