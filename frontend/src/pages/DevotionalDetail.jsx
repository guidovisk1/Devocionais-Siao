import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ShareButtons from '../components/ShareButtons'
import CommentSection from '../components/CommentSection'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function DevotionalDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [devotional, setDevotional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/devocionais/${id}`)
      .then((res) => setDevotional(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Carregando...</div>
      </div>
    )
  }

  if (notFound || !devotional) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-xl font-semibold mb-2">Devocional não encontrada</p>
          <Link to="/" className="text-primary-600 hover:underline text-sm mt-2">Voltar ao início</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto w-full px-4 py-10 flex-1">
        <Link to="/" className="text-sm text-gray-400 hover:text-primary-600 transition-colors mb-6 inline-block">
          ← Todas as devocionais
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {devotional.category && (
            <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
              {devotional.category.name}
            </span>
          )}

          <h1 className="text-3xl font-bold font-serif text-gray-800 mb-3">{devotional.title}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <span>Por <strong className="text-gray-600">{devotional.author?.name}</strong></span>
            <span>·</span>
            <time>{formatDate(devotional.published_at || devotional.created_at)}</time>
          </div>

          {devotional.bible_verse && (
            <blockquote className="border-l-4 border-primary-400 bg-primary-50 px-5 py-4 rounded-r-lg mb-6">
              {devotional.bible_text && (
                <p className="text-gray-700 italic mb-2 leading-relaxed">"{devotional.bible_text}"</p>
              )}
              <cite className="text-primary-700 font-semibold text-sm not-italic">{devotional.bible_verse}</cite>
            </blockquote>
          )}

          <div className="prose-devotional">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {devotional.content}
            </ReactMarkdown>
          </div>

          {user && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => navigate(`/admin/devocionais/${id}/editar`)}
                className="btn-secondary text-sm"
              >
                Editar
              </button>
            </div>
          )}
        </article>

        <div className="mt-6 card">
          <ShareButtons title={devotional.title} />
        </div>

        <div className="mt-2 card">
          <CommentSection devotionalId={id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
