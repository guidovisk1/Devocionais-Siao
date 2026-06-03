import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-4">
        <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain mb-4 opacity-40" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Página não encontrada</h1>
        <p className="text-gray-400 mb-6">A página que você busca não existe ou foi removida.</p>
        <Link to="/" className="btn-primary">Voltar ao início</Link>
      </div>
    </div>
  )
}
