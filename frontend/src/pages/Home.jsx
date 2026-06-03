import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DevotionalCard from '../components/DevotionalCard'
import api from '../services/api'

export default function Home() {
  const [devotionals, setDevotionals] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 10 }
      if (search) params.search = search
      if (categoryId) params.category_id = categoryId
      const res = await api.get('/devocionais', { params })
      setDevotionals(Array.isArray(res.data?.items) ? res.data.items : [])
      setPagination({ pages: res.data?.pages ?? 1, total: res.data?.total ?? 0 })
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryId])

  useEffect(() => {
    api.get('/categorias').then((res) => setCategories(Array.isArray(res.data) ? res.data : [])).catch(() => {})
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    load()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <header className="bg-gray-900 text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ea580c 0%, transparent 60%)' }}
        />
        <div className="relative">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain mx-auto mb-4" />
          <h1 className="text-4xl font-bold font-serif mb-2">
            Igreja Batista <span className="text-primary-500">Sião</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Devocionais diárias para nutrir sua fé e transformar o seu dia.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              className="input flex-1"
              placeholder="Buscar por título, tema ou versículo..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
            <button type="submit" className="btn-primary whitespace-nowrap">Buscar</button>
          </form>
          <select
            className="input sm:w-48"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Carregando...</div>
        ) : devotionals.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📖</p>
            <p>Nenhuma devocional encontrada.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {devotionals.map((d) => <DevotionalCard key={d.id} devotional={d} />)}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-gray-500 text-sm">
                  {page} / {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="btn-secondary disabled:opacity-40"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
