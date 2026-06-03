import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo Igreja Batista Sião" className="h-10 w-10 object-contain" />
          <span className="font-bold text-white text-lg leading-tight">
            Igreja Batista <span className="text-primary-500">Sião</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/admin" className="text-sm text-gray-300 hover:text-primary-400 transition-colors">
                Painel
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
