import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

type Task = {
  id: number
  title: string
  status: string
}

type Project = {
  id: number
  name: string
}

type User = {
  id: number
  name: string
  email: string
}

function TasksPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [title, setTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch {
      setTasks([])
    }
  }

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch {
      setProjects([])
    }
  }

  const loadUsers = async () => {
    if (!isAdmin) return
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch {
      setUsers([])
    }
  }

  useEffect(() => {
    loadTasks()
    loadProjects()
    loadUsers()
  }, [])

  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage('')
    setIsCreatingTask(true)
    try {
      const taskData: any = { title }
      if (selectedProjectId) taskData.projectId = selectedProjectId
      if (selectedUserId) taskData.assignedUserId = selectedUserId
      if (dueDate) taskData.dueDate = dueDate

      await api.post('/tasks', taskData)
      setTitle('')
      setSelectedProjectId(null)
      setSelectedUserId(null)
      setDueDate('')
      setStatusMessage('Task created successfully.')
      loadTasks()
    } catch (err: any) {
      if (err.response?.status === 403) {
        setStatusMessage('Access denied. Admin privileges required.')
      } else if (err.response?.status === 400) {
        setStatusMessage('Invalid task data. Please check all fields.')
      } else {
        setStatusMessage('Failed to create task. Please try again.')
      }
    } finally {
      setIsCreatingTask(false)
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus })
      loadTasks()
    } catch (err: any) {
      if (err.response?.status === 403) {
        setStatusMessage('Access denied. Only assigned users can update task status.')
      } else if (err.response?.status === 404) {
        setStatusMessage('Task not found.')
      } else {
        setStatusMessage('Unable to update task status.')
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <section className="page-container">
      <h1>Tasks</h1>
      {isAdmin && (
        <form className="form-card" onSubmit={handleCreate}>
          <label>
            Task title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>
          <label>
            Project (optional)
            <select
              value={selectedProjectId || ''}
              onChange={(event) => setSelectedProjectId(Number(event.target.value) || null)}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assigned user (optional)
            <select
              value={selectedUserId || ''}
              onChange={(event) => setSelectedUserId(Number(event.target.value) || null)}
            >
              <option value="">No assignment</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date (optional)
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
          <button type="submit" disabled={isCreatingTask}>
            {isCreatingTask ? 'Creating...' : 'Create task'}
          </button>
          {statusMessage && <div className="form-note">{statusMessage}</div>}
        </form>
      )}

      <div className="list-card">
        <h2>Task list</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-row">
                <span>{task.title}</span>
                <select
                  value={task.status}
                  onChange={(event) => handleStatusChange(task.id, event.target.value)}
                  disabled={isUpdatingStatus}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default TasksPage
