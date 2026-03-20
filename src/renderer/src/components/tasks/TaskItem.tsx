import { useState } from 'react'
import { MoreVertical, Trash2, Edit3, Target, Check } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, Priority } from '@/types'

const priorityBorder: Record<Priority, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-warning',
  low: 'border-l-success'
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleComplete, deleteTask, setActiveTask, updateTask } = useTaskStore()
  const activeTaskId = useTaskStore((s) => s.activeTaskId)
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const isActive = activeTaskId === task.id

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() })
    }
    setEditing(false)
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${priorityBorder[task.priority]} ${
        isActive ? 'bg-primary/5 border border-primary/30' : 'bg-surface border border-border'
      } transition-all ${task.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleComplete(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.completed
            ? 'bg-success border-success text-white'
            : 'border-border hover:border-primary'
        }`}
      >
        {task.completed && <Check size={12} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="w-full px-2 py-1 text-sm rounded border border-border bg-surface focus:outline-none focus:border-primary"
            autoFocus
          />
        ) : (
          <p className={`text-sm font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text'}`}>
            {task.title}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-muted text-text-muted">
            {task.category}
          </span>
          {(task.estimatedPomodoros !== null || task.pomodorosCompleted > 0) && (
            <span className="text-xs text-text-muted">
              {task.pomodorosCompleted}
              {task.estimatedPomodoros !== null && `/${task.estimatedPomodoros}`} 🍅
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-muted transition-colors"
        >
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 z-20 w-40 bg-surface rounded-lg border border-border shadow-lg py-1">
              {!task.completed && (
                <button
                  onClick={() => {
                    setActiveTask(isActive ? null : task.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text hover:bg-surface-muted"
                >
                  <Target size={14} />
                  {isActive ? 'Unset Active' : 'Set as Active'}
                </button>
              )}
              <button
                onClick={() => {
                  setEditing(true)
                  setShowMenu(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text hover:bg-surface-muted"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id)
                  setShowMenu(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-surface-muted"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
