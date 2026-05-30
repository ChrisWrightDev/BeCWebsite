<script setup>
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
            Blue-Eyed Clowns
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
        </div>

        <div class="footer-columns">
          <div class="footer-col">
            <h2 class="footer-heading">Shop</h2>
            <ul>
              <li><NuxtLink to="/shop">All clownfish</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h2 class="footer-heading">Support</h2>
            <ul>
              <li><NuxtLink to="/contact">Contact</NuxtLink></li>
              <li><NuxtLink to="/contact#faq">Shipping FAQ</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h2 class="footer-heading">Policies</h2>
            <ul>
              <li><span class="footer-placeholder">Privacy Policy (coming soon)</span></li>
              <li><span class="footer-placeholder">Terms of Service (coming soon)</span></li>
              <li><span class="footer-placeholder">Live Arrival Guarantee (coming soon)</span></li>
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
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e0f2fe;
  text-decoration: none;
}

.logo:focus-visible,
.nav-links a:focus-visible,
.footer-col a:focus-visible,
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
