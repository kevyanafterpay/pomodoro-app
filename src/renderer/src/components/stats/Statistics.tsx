import { DailySummary } from './DailySummary'
import { WeeklyChart } from './WeeklyChart'
import { AllTimeStats } from './AllTimeStats'

export function Statistics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-surface rounded-2xl border border-border p-6">
          <DailySummary />
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6">
          <WeeklyChart />
        </div>
      </div>
      <div className="bg-surface rounded-2xl border border-border p-6">
        <AllTimeStats />
      </div>
    </div>
  )
}
