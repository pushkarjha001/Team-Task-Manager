import { useEffect, useState } from 'react'
import api from '../api/axios'

type DashboardStats = {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

const initialStats: DashboardStats = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  overdueTasks: 0,
}

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/dashboard')
        setStats(response.data)
      } catch {
        setStats(initialStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="page-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{isLoading ? '...' : stats.totalTasks}</h2>
          <p>Total tasks</p>
        </div>
        <div className="stat-card">
          <h2>{isLoading ? '...' : stats.completedTasks}</h2>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h2>{isLoading ? '...' : stats.pendingTasks}</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h2>{isLoading ? '...' : stats.overdueTasks}</h2>
          <p>Overdue</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
