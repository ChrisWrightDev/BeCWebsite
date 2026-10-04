// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://blueeyedclowns.com').replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Blue-Eyed Clowns',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/dm-sans-latin-opsz-normal.woff2',
          crossorigin: 'anonymous',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Captive-bred ocellaris, snowflake & designer clownfish. 3-day live guarantee, safe UPS or FedEx overnight shipping Monday through Thursday.',
        },
        { property: 'og:site_name', content: 'Blue-Eyed Clowns' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${siteUrl}/images/og-default.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },
  runtimeConfig: {
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'Blue Eyed Clowns <onboarding@resend.dev>',
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
    public: {
      stripePublishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://blueeyedclowns.com',
    },
  },
})
