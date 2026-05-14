import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('MEMBER')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await api.post('/auth/signup', { name, email, password, role })
      setSuccess('Signup successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err: any) {
      const message = err.response?.data?.error ?? ''
      if (err.response?.status === 409 || message.toLowerCase().includes('email')) {
        setError('Email already exists. Please use a different email.')
      } else if (err.response?.status === 400) {
        setError('Invalid information. Please check all fields.')
      } else {
        setError('Signup failed. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-container">
      <h1>Signup</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-note">{success}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <p className="page-note">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default SignupPage
