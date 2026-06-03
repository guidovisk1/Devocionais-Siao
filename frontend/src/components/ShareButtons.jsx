export default function ShareButtons({ title, url }) {
  const fullUrl = url || window.location.href
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedText = encodeURIComponent(`📖 ${title}\n\nLeia a devocional de hoje: `)

  const shares = [
    {
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      href: `https://wa.me/?text=${encodedText}${encodedUrl}`,
    },
    {
      label: 'Telegram',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`📖 ${title}`)}`,
    },
    {
      label: 'Facebook',
      color: 'bg-blue-700 hover:bg-blue-800',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ]

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).then(() => alert('Link copiado!'))
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500 font-medium">Compartilhar:</span>
      {shares.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${s.color} text-white text-sm px-3 py-1.5 rounded-lg transition-colors`}
        >
          {s.label}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-lg transition-colors"
      >
        Copiar link
      </button>
    </div>
  )
}
