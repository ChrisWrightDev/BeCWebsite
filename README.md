# Blue-Eyed Clowns Website

Nuxt storefront for Blue-Eyed Clowns, a captive-bred clownfish aquaculture business. Production site: https://blueeyedclowns.com

## Setup

Install dependencies:

```bash
npm ci
```

Copy the example environment file when you need live Stripe or Supabase integrations:

```bash
cp .env.example .env
```

## Local preview data

Shop listing and product detail preview routes work without Supabase credentials. When `NUXT_SUPABASE_URL` or `NUXT_SUPABASE_SERVICE_ROLE_KEY` is missing, the server APIs return a small safe local clownfish catalog so reviewers can smoke-test `/shop` and `/shop/standard-ocellaris` without access to production data.

For production-like data-backed previews, set these values in `.env`:

```bash
NUXT_SUPABASE_URL=https://your-project.supabase.co
NUXT_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

The browser client also uses `NUXT_SUPABASE_ANON_KEY` where Supabase client-side features are enabled.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

For review smoke tests on a fixed host/port:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

## Production build

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Dependency audit

Run the audit with:

```bash
npm audit --audit-level=high
```

As of this branch, `npm audit fix --dry-run` indicates that remediation would change Nuxt/Vite-related dependency versions in the lockfile. Treat the audit as deferred until a dependency-upgrade pass can validate the full Nuxt build and preview flow after the upgrades.

## Branded email layout

Every Resend message uses the shared shell in `shared/emailLayout.js`. Order confirmation, the staff new-order notice, and inquiry notices already call it. Pass `unsubscribeUrl: null` (or omit it) for transactional mail. Marketing and release-list mail should pass Resend's `{{unsubscribe_url}}` placeholder.

```js
import { wrapEmail, plainTextEmail } from './shared/emailLayout.js'

const html = wrapEmail({
  title: 'New captive-bred batch',
  preheader: 'Snowflake and designer clownfish just landed on the site.',
  bodyHtml: '<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#0f172a;">A new batch is listed at <a href="https://blueeyedclowns.com/shop" style="color:#0369a1;">blueeyedclowns.com/shop</a>.</p>',
  unsubscribeUrl: '{{unsubscribe_url}}',
})

const text = plainTextEmail({
  bodyText: 'A new batch is listed at https://blueeyedclowns.com/shop.',
  unsubscribeUrl: '{{unsubscribe_url}}',
})
```

`bodyHtml` is inserted as HTML. Escape any name, address, or other untrusted text before passing it in. A filled order-confirmation sample (fake data) is at `email-templates/bec-email-shell.html`. Regenerate it with `node email-templates/sample-order.mjs`.
