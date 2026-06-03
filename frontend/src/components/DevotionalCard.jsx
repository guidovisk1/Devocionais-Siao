import { Link } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function DevotionalCard({ devotional }) {
  const preview = devotional.content ? devotional.content.replace(/[#*_`]/g, '').slice(0, 120) + '...' : ''

  return (
    <article className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {devotional.category && (
            <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full mb-2">
              {devotional.category.name}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">
            <Link to={`/devocional/${devotional.id}`} className="hover:text-primary-600 transition-colors">
              {devotional.title}
            </Link>
          </h2>
          {devotional.bible_verse && (
            <p className="text-sm text-primary-600 font-medium mb-2 italic">{devotional.bible_verse}</p>
          )}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{preview}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Por {devotional.author?.name}</span>
        <span>{formatDate(devotional.published_at || devotional.created_at)}</span>
      </div>
    </article>
  )
}
