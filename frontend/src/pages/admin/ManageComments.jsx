import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

export default function ManageComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/admin/comentarios')
      setComments(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function approve(id) {
    try {
      await api.patch(`/comentarios/${id}/aprovar`)
      load()
    } catch {
      alert('Erro ao aprovar comentário')
    }
  }

  async function remove(id) {
    if (!confirm('Excluir este comentário?')) return
    try {
      await api.delete(`/comentarios/${id}`)
      load()
    } catch {
      alert('Erro ao excluir')
    }
  }

  const filtered = comments.filter((c) =>
    filter === 'all' ? true : filter === 'pending' ? !c.is_approved : c.is_approved
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="text-gray-400 hover:text-gray-600">← Painel</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-800">Comentários</h1>
        </div>

        <div className="flex gap-2 mb-4">
          {[['pending', 'Pendentes'], ['approved', 'Aprovados'], ['all', 'Todos']].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filter === value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhum comentário encontrado.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => (
                <div key={c.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-700 text-sm">{c.author_name}</span>
                        {c.author_email && <span className="text-gray-400 text-xs">{c.author_email}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${c.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {c.is_approved ? 'Aprovado' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{c.content}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(c.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        <Link to={`/devocional/${c.devotional_id}`} className="text-primary-500 hover:underline">
                          Ver devocional
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    {!c.is_approved && (
                      <button onClick={() => approve(c.id)} className="text-green-600 hover:underline text-sm">
                        Aprovar
                      </button>
                    )}
                    <button onClick={() => remove(c.id)} className="text-red-500 hover:underline text-sm">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
