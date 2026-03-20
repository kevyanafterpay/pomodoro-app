import { useState } from 'react'
import { Timer as TimerIcon, CheckSquare, Settings } from 'lucide-react'
import { Timer } from '@/components/timer/Timer'
import { TaskList } from '@/components/tasks/TaskList'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

type View = 'timer' | 'tasks' | 'settings'

function App(): React.JSX.Element {
  const [view, setView] = useState<View>('timer')

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Top nav */}
      <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍅</span>
          <span className="text-lg font-bold text-text">Pomodoro</span>
        </div>
        <nav className="flex gap-1">
          {([
            { id: 'timer' as View, icon: TimerIcon, label: 'Timer' },
            { id: 'tasks' as View, icon: CheckSquare, label: 'Tasks' },
            { id: 'settings' as View, icon: Settings, label: 'Settings' }
          ]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:text-text hover:bg-surface-muted'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        {view === 'timer' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl border border-border p-6">
                <Timer />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-surface rounded-2xl border border-border p-6">
                <TaskList />
              </div>
            </div>
          </div>
        )}
        {view === 'tasks' && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <TaskList />
          </div>
        )}
        {view === 'settings' && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text mb-6">Settings</h2>
            <SettingsPanel />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
