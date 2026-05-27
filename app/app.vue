<template>
  <div class="app-shell">
    <header class="site-header">
      <nav class="nav">
        <div class="logo">Blue-Eyed Clownfish</div>
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

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <p>© {{ new Date().getFullYear() }} Blue-Eyed Clowns Reef Aquaculture. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
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

.site-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.5rem 1.5rem 2rem;
  background: radial-gradient(circle at top, #020617 0, #000 100%);
  color: #94a3b8;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
