import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

type Project = {
  id: number
  name: string
}

type User = {
  id: number
  name: string
  email: string
}

function ProjectsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projectName, setProjectName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [status, setStatus] = useState('')

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
    loadProjects()
    loadUsers()
  }, [])

  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    setIsCreatingProject(true)

    try {
      await api.post('/projects', { name: projectName })
      setProjectName('')
      setStatus('Project created successfully.')
      loadProjects()
    } catch (err: any) {
      if (err.response?.status === 403) {
        setStatus('Access denied. Admin privileges required.')
      } else if (err.response?.status === 400) {
        setStatus('Invalid project name. Please try again.')
      } else {
        setStatus('Failed to create project. Please try again.')
      }
    } finally {
      setIsCreatingProject(false)
    }
  }

  const handleAddMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedProjectId || !selectedUserId) return

    setIsAddingMember(true)
    try {
      await api.post(`/projects/${selectedProjectId}/members`, { userId: selectedUserId })
      setStatus('Member added successfully.')
      setSelectedProjectId(null)
      setSelectedUserId(null)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setStatus('Access denied. Admin privileges required.')
      } else if (err.response?.status === 404) {
        setStatus('Project or user not found.')
      } else if (err.response?.status === 409) {
        setStatus('User is already a member of this project.')
      } else {
        setStatus('Failed to add member. Please try again.')
      }
    } finally {
      setIsAddingMember(false)
    }
  }

  return (
    <section className="page-container">
      <h1>Projects</h1>
      {isAdmin && (
        <>
          <form className="form-card" onSubmit={handleCreate}>
            <label>
              Project name
              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={isCreatingProject}>
              {isCreatingProject ? 'Creating...' : 'Create project'}
            </button>
          </form>

          <form className="form-card" onSubmit={handleAddMember}>
            <h3>Add Member to Project</h3>
            <label>
              Select Project
              <select
                value={selectedProjectId || ''}
                onChange={(event) => setSelectedProjectId(Number(event.target.value) || null)}
                required
              >
                <option value="">Choose project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Select User
              <select
                value={selectedUserId || ''}
                onChange={(event) => setSelectedUserId(Number(event.target.value) || null)}
                required
              >
                <option value="">Choose user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={isAddingMember}>
              {isAddingMember ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </>
      )}

      {status && <div className="form-note">{status}</div>}

      <div className="list-card">
        <h2>Project list</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ProjectsPage
