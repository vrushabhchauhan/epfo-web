import { Link } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <div className="auth-wordmark">Ek EPFO</div>
        <section className="auth-card">{children}</section>
        <Link to="/" className="auth-home-link">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default AuthLayout
