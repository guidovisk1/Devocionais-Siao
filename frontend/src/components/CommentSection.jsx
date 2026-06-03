import { useState, useEffect } from 'react'
import api from '../services/api'

export default function CommentSection({ devotionalId }) {
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ author_name: '', author_email: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/devocionais/${devotionalId}/comentarios`)
      .then((res) => setComments(res.data))
      .catch(() => {})
  }, [devotionalId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Nome e comentário são obrigatórios.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = { ...form, author_email: form.author_email.trim() || null }
      await api.post(`/devocionais/${devotionalId}/comentarios`, payload)
      setSubmitted(true)
      setForm({ author_name: '', author_email: '', content: '' })
    } catch {
      setError('Erro ao enviar comentário. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Comentários</h3>

      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">{c.author_name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-8">Nenhum comentário ainda. Seja o primeiro!</p>
      )}

      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm">
          Comentário enviado! Ele será exibido após aprovação pelo administrador.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 rounded-xl p-5">
          <h4 className="font-semibold text-gray-700">Deixe um comentário</h4>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Seu nome *"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Seu email (opcional)"
              type="email"
              value={form.author_email}
              onChange={(e) => setForm({ ...form, author_email: e.target.value })}
            />
          </div>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Seu comentário *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Enviando...' : 'Enviar comentário'}
          </button>
        </form>
      )}
    </section>
  )
}
