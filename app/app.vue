<script setup>
import { SOCIAL_PROFILES } from '~/utils/socialProfiles'

const navOpen = ref(false)
const route = useRoute()

function toggleNav() {
  navOpen.value = !navOpen.value
}

function closeNav() {
  navOpen.value = false
}

watch(
  () => route.path,
  () => closeNav()
)
</script>

<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="site-header">
      <nav class="nav" aria-label="Main navigation">
        <div class="nav-top">
          <NuxtLink to="/" class="logo" aria-label="Blue-Eyed Clowns home">
            <img
              src="/images/logo.png"
              alt="Blue-Eyed Clowns"
              class="logo-mark"
              width="40"
              height="40"
              decoding="async"
            />
            <span class="logo-text">Blue-Eyed Clowns</span>
          </NuxtLink>

          <div class="nav-actions">
            <span class="nav-cart-desktop">
              <CartIcon />
            </span>
            <button
              type="button"
              class="nav-toggle"
              :aria-expanded="navOpen"
              aria-controls="primary-nav"
              @click="toggleNav"
            >
              <span class="sr-only">{{ navOpen ? 'Close menu' : 'Open menu' }}</span>
              <span class="nav-toggle-bar" aria-hidden="true"></span>
              <span class="nav-toggle-bar" aria-hidden="true"></span>
              <span class="nav-toggle-bar" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <ul id="primary-nav" class="nav-links" :class="{ open: navOpen }">
          <li><NuxtLink to="/" @click="closeNav">Home</NuxtLink></li>
          <li><NuxtLink to="/shop" @click="closeNav">Clownfish</NuxtLink></li>
          <li><NuxtLink to="/bonded-pairs" @click="closeNav">Bonded Pairs</NuxtLink></li>
          <li><NuxtLink to="/guides/clownfish-care" @click="closeNav">Care Guide</NuxtLink></li>
          <li><NuxtLink to="/blog" @click="closeNav">Blog</NuxtLink></li>
          <li><NuxtLink to="/about" @click="closeNav">About</NuxtLink></li>
          <li><NuxtLink to="/contact" @click="closeNav">Contact</NuxtLink></li>
          <li class="nav-cart-mobile">
            <CartIcon />
          </li>
        </ul>
      </nav>
    </header>

    <main id="main-content" class="main-content" tabindex="-1">
      <NuxtPage />
    </main>

    <CartToast />

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <p class="footer-name">Blue-Eyed Clowns</p>
          <p class="footer-tagline">Premium tank-bred clownfish</p>
          <nav class="footer-social" aria-label="Blue-Eyed Clowns on social media">
            <a
              v-for="profile in SOCIAL_PROFILES"
              :key="profile.name"
              :href="profile.href"
              :aria-label="profile.label"
              target="_blank"
              rel="noopener"
            >
              <svg
                v-if="profile.name === 'TikTok'"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M14.5 3c.4 2.4 1.8 4.2 4.1 4.5v3c-1.4 0-2.7-.5-3.8-1.3v6.6c0 3.4-2.7 6.1-6.1 6.1S2.6 19.2 2.6 15.8c0-3.3 2.6-6 5.9-6.1.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1V3h2.9Z"
                />
              </svg>
              <svg
                v-else-if="profile.name === 'Instagram'"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
              </svg>
              <svg
                v-else-if="profile.name === 'X'"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M15.6 3h3.1l-6.8 7.8L20 21h-5.5l-4.3-5.6L5.3 21H2.2l7.3-8.3L4 3h5.6l3.9 5.2L15.6 3Zm-1.1 16.2h1.7L9.6 4.7H7.8l6.7 14.5Z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M13.5 21v-7.1h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.1-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.5v2.8h2.5V21H6.1C4.4 21 3 19.6 3 17.9V6.1C3 4.4 4.4 3 6.1 3h11.8C19.6 3 21 4.4 21 6.1v11.8c0 1.7-1.4 3.1-3.1 3.1h-4.4Z"
                />
              </svg>
            </a>
          </nav>
        </div>

        <div class="footer-columns">
          <div class="footer-col">
            <h2 class="footer-heading">Shop</h2>
            <ul>
              <li><NuxtLink to="/shop">All clownfish</NuxtLink></li>
              <li><NuxtLink to="/bonded-pairs">Bonded pairs</NuxtLink></li>
              <li><NuxtLink to="/shop/standard-ocellaris">Standard Ocellaris</NuxtLink></li>
              <li><NuxtLink to="/shop/blue-ghost-storm">Blue Ghost Storm</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog & hatchery journal</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h2 class="footer-heading">Support</h2>
            <ul>
              <li><NuxtLink to="/contact">Contact</NuxtLink></li>
              <li><NuxtLink to="/contact#faq">Shipping FAQ</NuxtLink></li>
              <li><NuxtLink to="/guides/clownfish-care">Clownfish care guide</NuxtLink></li>
              <li><NuxtLink to="/guides/clownfish-morphs">Morph guide</NuxtLink></li>
              <li><NuxtLink to="/guides/shipping-live-clownfish">Live shipping guide</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h2 class="footer-heading">Policies</h2>
            <ul>
              <li><NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms-of-service">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/3-day-live-guarantee">3-Day Live Guarantee</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <p class="footer-copy">
        © {{ new Date().getFullYear() }} Blue-Eyed Clowns. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style>
:root {
  color-scheme: dark;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: #f5f7ff;
  background-color: #020617;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: #0ea5e9;
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0.5rem;
}

.skip-link:focus {
  left: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #0f172a 0, #020617 50%, #000 100%);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(16px);
  background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(8, 47, 73, 0.9));
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.nav {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.nav-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e0f2fe;
  text-decoration: none;
  min-width: 0;
}

.logo-mark {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(125, 211, 252, 0.35);
}

.logo-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo:focus-visible,
.nav-links a:focus-visible,
.footer-col a:focus-visible,
.footer-social a:focus-visible,
.nav-toggle:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
  border-radius: 2px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.8);
  cursor: pointer;
}

.nav-toggle-bar {
  display: block;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  border-radius: 1px;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0;
  margin: 0;
}

.nav-links a {
  color: #e5e7eb;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding-bottom: 0.1rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #7dd3fc;
  border-color: #7dd3fc;
}

.nav-cart-mobile {
  display: none;
}

.main-content {
  flex: 1;
}

.main-content:focus {
  outline: none;
}

.site-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding: 2.5rem 1.5rem 2rem;
  background: radial-gradient(circle at top, #020617 0, #000 100%);
  color: #94a3b8;
  font-size: 0.875rem;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.footer-name {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
  color: #e0f2fe;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer-tagline {
  margin: 0;
  color: #cbd5e1;
}

.footer-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
}

.footer-social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 999px;
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.footer-social a:hover {
  color: #ecfeff;
  border-color: rgba(125, 211, 252, 0.7);
  background-color: rgba(8, 47, 73, 0.7);
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.footer-heading {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e2e8f0;
}

.footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-col li + li {
  margin-top: 0.5rem;
}

.footer-col a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-col a:hover {
  color: #7dd3fc;
}

.footer-placeholder {
  color: #64748b;
  font-style: italic;
}

.footer-copy {
  max-width: 1120px;
  margin: 0 auto;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }

  .footer-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-toggle {
    display: flex;
  }

  .nav-cart-desktop {
    display: none;
  }

  .nav-cart-mobile {
    display: block;
    margin-top: 0.5rem;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(148, 163, 184, 0.25);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-links a {
    display: block;
    padding: 0.75rem 0;
    border-bottom: none;
  }
}
</style>
