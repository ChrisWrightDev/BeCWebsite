<template>
  <section class="page">
    <div class="inner">
      <header class="header">
        <h1>Contact us</h1>
        <p>
          Have a question about a specific clownfish, shipping, or wholesale? Send us a note and
          we’ll get back within one business day.
        </p>
      </header>

      <div class="grid">
        <form
          class="form"
          action="mailto:orders@example.com"
          method="post"
          enctype="text/plain"
        >
          <label>
            Name
            <input type="text" name="name" required />
          </label>

          <label>
            Email
            <input type="email" name="email" required />
          </label>

          <label>
            Subject
            <input type="text" name="subject" />
          </label>

          <label>
            Message
            <textarea name="message" rows="5" required></textarea>
          </label>

          <button type="submit" class="btn">Send message</button>
        </form>

        <aside class="details">
          <h2>Quick details</h2>
          <ul>
            <li><strong>Email</strong> orders@example.com</li>
            <li><strong>Location</strong> Shipments from the continental United States</li>
            <li><strong>Shipping days</strong> Monday–Wednesday to avoid weekend delays</li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 3.5rem 1.5rem 4rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 960px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.header p {
  color: #cbd5f5;
  max-width: 40rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
  gap: 2.25rem;
  margin-top: 2.5rem;
  align-items: flex-start;
}

.form {
  display: grid;
  gap: 1rem;
  padding: 1.75rem 1.5rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, #020617, #020617 55%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input,
textarea {
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6);
}

.btn {
  margin-top: 0.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  background: linear-gradient(to right, #22d3ee, #0ea5e9);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn:hover {
  filter: brightness(1.04);
}

.details h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details li {
  margin-bottom: 0.6rem;
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

