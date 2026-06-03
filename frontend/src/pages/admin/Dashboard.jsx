import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ items: [], total: 0, pages: 1 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const params = { page, per_page: 20 }
      if (search) params.search = search
      const res = await api.get('/devocionais/admin', { params })
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, search])

  async function handleDelete(id, title) {
    if (!confirm(`Excluir "${title}"?`)) return
    setDeleting(id)
    try {
      await api.delete(`/devocionais/${id}`)
      load()
    } catch {
      alert('Erro ao excluir.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel</h1>
            <p className="text-gray-500 text-sm">Olá, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/categorias" className="btn-secondary text-sm">Categorias</Link>
                <Link to="/admin/comentarios" className="btn-secondary text-sm">Comentários</Link>
                <Link to="/admin/usuarios" className="btn-secondary text-sm">Usuários</Link>
              </>
            )}
            <Link to="/admin/devocionais/nova" className="btn-primary text-sm">+ Nova devocional</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex gap-3 mb-4">
            <input
              className="input flex-1"
              placeholder="Buscar devocionais..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-8">Carregando...</p>
          ) : data.items.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhuma devocional encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-left">
                    <th className="pb-2 font-medium">Título</th>
                    <th className="pb-2 font-medium">Autor</th>
                    <th className="pb-2 font-medium">Categoria</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Data</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-800 max-w-xs truncate">{d.title}</td>
                      <td className="py-3 pr-4 text-gray-500">{d.author?.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{d.category?.name || '—'}</td>
                      <td className="py-3 pr-4">
                        {d.is_published ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Publicado</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Rascunho</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(d.published_at || d.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 flex gap-2">
                        <Link to={`/admin/devocionais/${d.id}/editar`} className="text-primary-600 hover:underline">
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(d.id, d.title)}
                          disabled={deleting === d.id}
                          className="text-red-500 hover:underline disabled:opacity-40"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm disabled:opacity-40">
                ← Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-500">{page} / {data.pages}</span>
              <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="btn-secondary text-sm disabled:opacity-40">
                Próxima →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
