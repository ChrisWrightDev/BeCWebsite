// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Blue-Eyed Clowns',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Captive-bred ocellaris, snowflake & designer clownfish. 30-day health guarantee, safe overnight shipping.',
        },
        { property: 'og:site_name', content: 'Blue-Eyed Clowns' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://www.blueeyedclowns.com/images/og-default.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  runtimeConfig: {
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
    public: {
      stripePublishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.blueeyedclowns.com',
    },
  },
})
