import assert from 'node:assert/strict'
import { renderBlogMarkdown } from '../app/utils/renderMarkdown.js'

const html = renderBlogMarkdown(`# Body title that must not be H1

Intro with **bold** and a [care guide](https://blueeyedclowns.com/guides/clownfish-care).

## Why this matters

- Captive-bred fish
- Overnight shipping

### Feeding notes

Plain paragraph after the list.

<script>alert('xss')</script>

[bad](javascript:alert(1))
`)

assert.match(html, /<h2>/)
assert.doesNotMatch(html, /<h1[\s>]/i)
assert.match(html, /<strong>bold<\/strong>/)
assert.match(html, /<ul>/)
assert.match(html, /<li>Captive-bred fish<\/li>/)
assert.match(html, /<h3>Feeding notes<\/h3>/)
assert.match(html, /href="https:\/\/blueeyedclowns.com\/guides\/clownfish-care"/)
assert.match(html, /rel="noopener noreferrer"/)
assert.match(html, /target="_blank"/)
assert.doesNotMatch(html, /<script/i)
assert.doesNotMatch(html, /href=["']javascript:/i)
assert.match(html, /\[bad\]\(javascript:alert\(1\)\)/)

const plain = renderBlogMarkdown(
  'Welcome to the Blue-Eyed Clowns blog. This space will collect our best hatchery notes.\n\nFuture posts will cover feeding.'
)
assert.match(plain, /<p>Welcome to the Blue-Eyed Clowns blog/)
assert.match(plain, /<p>Future posts will cover feeding.<\/p>/)
assert.doesNotMatch(plain, /<h[1-6]/)

assert.equal(renderBlogMarkdown(''), '')
assert.equal(renderBlogMarkdown(null), '')

const injected = renderBlogMarkdown('Click <img src=x onerror="alert(1)"> and <a href="javascript:alert(1)">here</a>.')
assert.match(injected, /&lt;img src=x onerror/)
assert.doesNotMatch(injected, /<img/i)
assert.doesNotMatch(injected, /<a href=["']javascript:/i)

console.log('renderMarkdown helpers passed')
