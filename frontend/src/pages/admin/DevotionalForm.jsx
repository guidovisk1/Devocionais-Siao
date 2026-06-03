import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

export default function DevotionalForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    content: '',
    bible_verse: '',
    bible_text: '',
    category_id: '',
    is_published: true,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/categorias').then((res) => setCategories(res.data))
    if (isEditing) {
      setLoading(true)
      api.get(`/devocionais/${id}`)
        .then((res) => {
          const d = res.data
          setForm({
            title: d.title || '',
            content: d.content || '',
            bible_verse: d.bible_verse || '',
            bible_text: d.bible_text || '',
            category_id: d.category?.id || '',
            is_published: d.is_published,
          })
        })
        .catch(() => navigate('/admin'))
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, navigate])

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim()) {
      setError('Título e conteúdo são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      }
      if (isEditing) {
        await api.put(`/devocionais/${id}`, payload)
      } else {
        await api.post('/devocionais', payload)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20 text-gray-400">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">← Painel</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar devocional' : 'Nova devocional'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input className="input" value={form.title} onChange={set('title')} placeholder="Ex: A fé que move montanhas" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versículo (referência)</label>
                <input className="input" value={form.bible_verse} onChange={set('bible_verse')} placeholder="Ex: Mateus 17:20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select className="input" value={form.category_id} onChange={set('category_id')}>
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto do versículo</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={form.bible_text}
                onChange={set('bible_text')}
                placeholder="Cole aqui o texto completo do versículo..."
              />
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo da devocional *
              <span className="text-gray-400 font-normal ml-1">(suporta Markdown)</span>
            </label>
            <textarea
              className="input resize-y font-mono text-sm"
              rows={16}
              value={form.content}
              onChange={set('content')}
              placeholder="Escreva aqui a sua reflexão...

Você pode usar Markdown:
**negrito**, *itálico*, # Título, ## Subtítulo"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Dica: use **texto** para negrito, *texto* para itálico, # para títulos.
            </p>
          </div>

          <div className="card">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              <div>
                <span className="font-medium text-gray-700">Publicar imediatamente</span>
                <p className="text-xs text-gray-400">Desmarque para salvar como rascunho</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Publicar devocional'}
            </button>
            <Link to="/admin" className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
