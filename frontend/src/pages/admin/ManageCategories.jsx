import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/categorias')
      setCategories(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setError('')
    setSaving(true)
    try {
      await api.post('/categorias', form)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao criar categoria')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Excluir a categoria "${name}"? As devocionais dessa categoria não serão excluídas.`)) return
    try {
      await api.delete(`/categorias/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao excluir')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="text-gray-400 hover:text-gray-600">← Painel</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-800">Categorias</h1>
        </div>

        <div className="card mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Nova categoria</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              className="input"
              placeholder="Nome da categoria (ex: Fé, Oração, Família)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Descrição (opcional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Criando...' : 'Criar categoria'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Categorias existentes</h2>
          {loading ? (
            <p className="text-gray-400 text-sm py-4 text-center">Carregando...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">Nenhuma categoria criada ainda.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium text-gray-700">{c.name}</span>
                    {c.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="text-red-400 hover:text-red-600 text-sm transition-colors"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
