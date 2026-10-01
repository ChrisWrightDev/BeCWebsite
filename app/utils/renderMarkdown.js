import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false,
})

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'a',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'hr',
]

const ALLOWED_SCHEMES = ['http', 'https', 'mailto']

function isSafeHref(href) {
  if (!href || typeof href !== 'string') return false
  const value = href.trim()
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('?')) return true
  try {
    const url = new URL(value, 'https://blueeyedclowns.com')
    return ALLOWED_SCHEMES.includes(url.protocol.replace(':', ''))
  } catch {
    return false
  }
}

export function renderBlogMarkdown(content) {
  if (!content || typeof content !== 'string') return ''

  const rawHtml = markdown.render(content)

  return sanitizeHtml(rawHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'rel', 'target'],
    },
    allowedSchemes: ALLOWED_SCHEMES,
    allowProtocolRelative: false,
    transformTags: {
      h1: 'h2',
      a: (tagName, attribs) => {
        const href = attribs.href || ''
        if (!isSafeHref(href)) {
          return { tagName: 'span', attribs: {} }
        }

        const next = {
          href,
          rel: 'noopener noreferrer',
        }

        if (attribs.title) next.title = attribs.title
        if (/^https?:/i.test(href)) next.target = '_blank'

        return { tagName: 'a', attribs: next }
      },
    },
  })
}
