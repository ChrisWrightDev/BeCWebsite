<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="site-header">
      <nav class="nav" aria-label="Main navigation">
        <NuxtLink to="/" class="logo" aria-label="Blue-Eyed Clowns home">
          Blue-Eyed Clowns
        </NuxtLink>
        <ul class="nav-links">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/shop">Clownfish</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          <li class="nav-cart">
            <CartIcon />
          </li>
        </ul>
      </nav>
    </header>

    <main id="main-content" class="main-content" tabindex="-1">
      <NuxtPage />
    </main>

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
              <li><span class="footer-placeholder">Shipping FAQ (coming soon)</span></li>
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
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
.footer-col a:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
  border-radius: 2px;
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

.nav-cart {
  margin-left: 0.5rem;
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
  .nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-links a {
    transition: none;
  }
}
</style>
