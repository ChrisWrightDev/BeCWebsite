# Blue-Eyed Clowns Website

Nuxt storefront for Blue-Eyed Clowns, a captive-bred clownfish aquaculture business.

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
