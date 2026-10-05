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

Every Resend message uses the shared shell in `shared/emailLayout.js`. Order confirmation, the staff new-order notice, and inquiry notices call `wrapEmail` and omit `unsubscribeUrl`, so those transactional messages have no unsubscribe line.

Marketing and release-list mail should call `wrapMarketingEmail`. It requires `unsubscribeUrl` and always adds an Unsubscribe link in the footer. Pass a real link (`https://blueeyedclowns.com/unsubscribe/<token>`) or Resend's `{{unsubscribe_url}}` placeholder.

```js
import { wrapMarketingEmail, plainTextMarketingEmail } from './shared/emailLayout.js'

const html = wrapMarketingEmail({
  title: 'New captive-bred batch',
  preheader: 'Snowflake and designer clownfish just landed on the site.',
  bodyHtml: '<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#0f172a;">A new batch is listed at <a href="https://blueeyedclowns.com/shop" style="color:#0369a1;">blueeyedclowns.com/shop</a>.</p>',
  unsubscribeUrl: '{{unsubscribe_url}}',
})

const text = plainTextMarketingEmail({
  bodyText: 'A new batch is listed at https://blueeyedclowns.com/shop.',
  unsubscribeUrl: '{{unsubscribe_url}}',
})
```

`bodyHtml` is inserted as HTML. Escape any name, address, or other untrusted text before passing it in. A filled order-confirmation sample for Mission Control is at `email-templates/bec-email-shell.html`.

The release-list welcome email (`shared/releaseListEmail.js`) uses this marketing shell. It sends when someone joins for the first time or rejoins after unsubscribing, and it does not send again while they are already subscribed. The from address is `EMAIL_FROM_MARKETING`, which defaults to `Blue Eyed Clowns <hello@blueeyedclowns.com>` and falls back to `EMAIL_FROM` only if that default is blank. Set `EMAIL_FROM_MARKETING` to the same value as `EMAIL_FROM` to send welcome mail from the orders address. Welcome mail is skipped when `RESEND_API_KEY` is unset. Mission Control samples: `email-templates/bec-marketing-welcome-sample.html` and `email-templates/bec-marketing-shell-sample.html`. Regenerate them with `node email-templates/sample-marketing.mjs`. That script does not send mail.

Unsubscribe reasons are stored on `public.subscribers` (`unsubscribe_reason`, `unsubscribe_feedback`). Apply `supabase/migrations/20261005113150_subscriber_unsubscribe_feedback.sql` before deploying this change. The migration does not delete rows. Admins remain select-only; the unsubscribe route updates with the service role.

`email-templates/bec-order-confirmation-sample.html` is a manual Resend test payload. It is not sent by the app.

- Subject: `Order BEC-TESTEMAIL01 confirmed — Blue Eyed Clowns`
- From: `Blue Eyed Clowns <orders@blueeyedclowns.com>`

The buyer in that file is Riley Sample, the fish is “Sample Clownfish (test email only)”, and the totals are $10.00 merchandise, $5.00 shipping, and $15.00 total. Those amounts are fake and are not live shop prices. Regenerate both HTML files with `node email-templates/sample-order.mjs`.
