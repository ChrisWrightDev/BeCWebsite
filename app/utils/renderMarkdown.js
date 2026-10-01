import MarkdownIt from 'markdown-it'
import createDOMPurify from 'dompurify'
import { parseHTML } from 'linkedom'

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

function demoteBodyH1(html) {
  return html.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
}

const purifyWindow = parseHTML('<!DOCTYPE html><html><body></body></html>')
const sanitizer = createDOMPurify(purifyWindow)

function rewriteLinks(html) {
  const parsed = parseHTML(`<html><body>${html}</body></html>`)
  const document = parsed.document

  for (const node of document.querySelectorAll('a')) {
    const href = node.getAttribute('href') || ''
    if (!isSafeHref(href)) {
      node.replaceWith(document.createTextNode(node.textContent || ''))
      continue
    }

    node.setAttribute('rel', 'noopener noreferrer')
    if (/^https?:/i.test(href)) {
      node.setAttribute('target', '_blank')
    } else {
      node.removeAttribute('target')
    }
  }

  return document.body.innerHTML
}

export function renderBlogMarkdown(content) {
  if (!content || typeof content !== 'string') return ''

  const rawHtml = demoteBodyH1(markdown.render(content))
  const cleanHtml = sanitizer.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })

  return rewriteLinks(cleanHtml)
}
