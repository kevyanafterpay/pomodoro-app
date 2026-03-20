import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Priority } from '@/types'

const priorityColors: Record<Priority, string> = {
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-red-500'
}

export function TaskForm() {
  const addTask = useTaskStore((s) => s.addTask)
  const { settings, updateSettings } = useSettingsStore()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState(settings.categories[0] ?? '')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(
      title.trim(),
      priority,
      category,
      estimatedPomodoros ? parseInt(estimatedPomodoros, 10) : null
    )
    setTitle('')
    setEstimatedPomodoros('')
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
      updateSettings({ categories: [...settings.categories, newCategory.trim()] })
      setCategory(newCategory.trim())
      setNewCategory('')
      setShowNewCategory(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Priority */}
        <div className="flex items-center gap-1">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                priority === p
                  ? `${priorityColors[p]} text-white`
                  : 'bg-surface-muted text-text-muted hover:text-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="flex items-center gap-1">
          {showNewCategory ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="px-2 py-1 text-xs rounded border border-border bg-surface focus:outline-none focus:border-primary w-28"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-xs text-primary font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewCategory(false)}
                className="text-xs text-text-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-border bg-surface text-text focus:outline-none focus:border-primary"
              >
                {settings.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="text-xs text-primary font-medium"
              >
                + New
              </button>
            </>
          )}
        </div>

        {/* Estimated pomodoros */}
        <input
          type="number"
          min="1"
          max="20"
          value={estimatedPomodoros}
          onChange={(e) => setEstimatedPomodoros(e.target.value)}
          placeholder="Est. 🍅"
          className="px-2 py-1 text-xs rounded border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:border-primary w-20"
        />
      </div>
    </form>
  )
}
