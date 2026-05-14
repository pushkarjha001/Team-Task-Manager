import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      login(response.data.token, response.data)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (err.response?.status === 403) {
        setError('Account is disabled. Contact administrator.')
      } else {
        setError('Login failed. Please try again later.')
      }
    }
  }

  return (
    <section className="page-container">
      <h1>Login</h1>
      <form className="form-card" onSubmit={handleSubmit}>
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
        {error && <div className="form-error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p className="page-note">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </section>
  )
}

export default LoginPage
