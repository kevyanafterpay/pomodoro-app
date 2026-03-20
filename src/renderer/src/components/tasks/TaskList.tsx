import { useState, useMemo } from 'react'
import { ClipboardList } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import { isToday } from 'date-fns'

type Filter = 'all' | 'today' | 'completed'

export function TaskList() {
  const tasks = useTaskStore((s) => s.tasks)
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'today':
        return tasks.filter((t) => !t.completed && isToday(new Date(t.createdAt)))
      case 'completed':
        return tasks.filter((t) => t.completed)
      default:
        return tasks.filter((t) => !t.completed)
    }
  }, [tasks, filter])

  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return [...filteredTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }, [filteredTasks])

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Active', count: tasks.filter((t) => !t.completed).length },
    { id: 'today', label: 'Today', count: tasks.filter((t) => !t.completed && isToday(new Date(t.createdAt))).length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.completed).length }
  ]

  return (
    <div className="space-y-4">
      <TaskForm />

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border">
        {filters.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <ClipboardList size={48} className="mb-3 opacity-30" />
            <p className="text-sm">
              {filter === 'completed' ? 'No completed tasks yet' : 'Add your first task'}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
