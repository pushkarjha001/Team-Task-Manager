import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-container">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard">Go to dashboard</Link>
    </section>
  )
}

export default NotFoundPage
