import { create } from 'zustand'
import { createStorageAdapter } from '@/lib/storage/adapter'
import type { AppSettings } from '@/types'

const storage = createStorageAdapter()
const STORAGE_KEY = 'pomodoro-settings'

const defaultSettings: AppSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakAfter: 4,
  soundEnabled: true,
  soundVolume: 0.7,
  autoStartBreaks: false,
  autoStartWork: false,
  categories: ['Work', 'Personal', 'Learning'],
  dailyGoal: 8
}

interface SettingsStore {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  resetDefaults: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: storage.get<AppSettings>(STORAGE_KEY) ?? defaultSettings,

  updateSettings: (partial) =>
    set((state) => {
      const updated = { ...state.settings, ...partial }
      storage.set(STORAGE_KEY, updated)
      return { settings: updated }
    }),

  resetDefaults: () => {
    storage.set(STORAGE_KEY, defaultSettings)
    set({ settings: defaultSettings })
  }
}))
