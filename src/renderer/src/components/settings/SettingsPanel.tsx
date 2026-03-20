import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function SettingsPanel() {
  const { settings, updateSettings, resetDefaults } = useSettingsStore()
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
      updateSettings({ categories: [...settings.categories, newCategory.trim()] })
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (cat: string) => {
    updateSettings({ categories: settings.categories.filter((c) => c !== cat) })
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Timer durations */}
      <section>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Timer
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['workDuration', 'Work'] as const,
            ['shortBreakDuration', 'Short Break'] as const,
            ['longBreakDuration', 'Long Break'] as const
          ]).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-text-muted block mb-1">{label} (min)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={settings[key]}
                onChange={(e) => updateSettings({ [key]: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-xs text-text-muted block mb-1">Long break after (pomodoros)</label>
          <input
            type="number"
            min="2"
            max="10"
            value={settings.longBreakAfter}
            onChange={(e) => updateSettings({ longBreakAfter: parseInt(e.target.value, 10) || 4 })}
            className="w-24 px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </section>

      {/* Sound */}
      <section>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Sound
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            className="rounded border-border"
          />
          <span className="text-sm text-text">Enable sound</span>
        </label>
        {settings.soundEnabled && (
          <div className="mt-2">
            <label className="text-xs text-text-muted block mb-1">
              Volume: {Math.round(settings.soundVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.soundVolume}
              onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </section>

      {/* Auto-start */}
      <section>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Automation
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
              className="rounded border-border"
            />
            <span className="text-sm text-text">Auto-start breaks</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartWork}
              onChange={(e) => updateSettings({ autoStartWork: e.target.checked })}
              className="rounded border-border"
            />
            <span className="text-sm text-text">Auto-start work sessions</span>
          </label>
        </div>
      </section>

      {/* Daily goal */}
      <section>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Goals
        </h3>
        <label className="text-xs text-text-muted block mb-1">Daily pomodoro goal</label>
        <input
          type="number"
          min="1"
          max="20"
          value={settings.dailyGoal}
          onChange={(e) => updateSettings({ dailyGoal: parseInt(e.target.value, 10) || 8 })}
          className="w-24 px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:border-primary"
        />
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Categories
        </h3>
        <div className="space-y-1">
          {settings.categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between py-1">
              <span className="text-sm text-text">{cat}</span>
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="p-1 text-text-muted hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-light transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </section>

      {/* Reset */}
      <button
        onClick={resetDefaults}
        className="px-4 py-2 rounded-lg border border-border text-sm text-text-muted hover:text-text hover:border-text-muted transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  )
}
