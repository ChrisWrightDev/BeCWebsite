<script setup>
useSiteSeo({
  title: '3-Day Live Guarantee',
  description:
    'Learn how Blue-Eyed Clowns protects your live clownfish order with safe overnight shipping, live arrival support, and a clear 3-day guarantee claim process.',
})

const lastUpdated = 'June 5, 2026'

const toc = [
  ['overview', 'Guarantee overview'],
  ['covered', 'What is covered'],
  ['qualify', 'How to qualify'],
  ['claim-window', 'Claim timeframe'],
  ['proof', 'Required proof'],
  ['exclusions', 'What is not covered'],
  ['remedies', 'Remedy options'],
  ['support', 'How to contact us'],
]
</script>

<template>
  <article class="guarantee-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">3-Day Live Guarantee</span>
      </nav>

      <header class="hero">
        <p class="eyebrow">Live animal support</p>
        <h1>3-Day Live Guarantee</h1>
        <p>
          We pack and ship every clownfish with care. If an eligible fish arrives in poor
          condition, arrives dead, or does not survive the first 3 days after delivery, this page
          explains how Blue-Eyed Clowns reviews guarantee claims and helps make things right.
        </p>
        <p class="updated">Last updated: {{ lastUpdated }}</p>
      </header>

      <section class="notice" aria-label="Important guarantee note">
        <strong>Important:</strong>
        <span>
          Live animal outcomes depend on shipping conditions, delivery timing, acclimation, and the
          receiving aquarium. Please contact us quickly if something looks wrong so we can help while
          details are fresh.
        </span>
      </section>

      <div class="layout">
        <aside class="toc" aria-label="Guarantee sections">
          <h2>On this page</h2>
          <ol>
            <li v-for="[id, label] in toc" :key="id">
              <a :href="`#${id}`">{{ label }}</a>
            </li>
          </ol>
        </aside>

        <div class="content">
          <section id="overview" class="panel">
            <h2>Guarantee overview</h2>
            <p>
              Blue-Eyed Clowns offers a 3-day live guarantee for eligible live clownfish orders. The
              guarantee begins when the carrier marks the shipment delivered and runs through the
              first 3 calendar days after delivery.
            </p>
            <p>
              The guarantee is designed to support customers when a covered fish arrives dead,
              arrives visibly unhealthy, or declines within the guarantee window due to a covered
              shipping or pre-existing health concern.
            </p>
          </section>

          <section id="covered" class="panel">
            <h2>What is covered</h2>
            <p>For eligible orders, the 3-Day Live Guarantee may cover:</p>
            <ul>
              <li>a clownfish that is dead on arrival;</li>
              <li>a clownfish that arrives visibly distressed or injured;</li>
              <li>
                a clownfish that does not survive the first 3 days after delivery despite proper
                acclimation and aquarium conditions; and
              </li>
              <li>
                covered shipping concerns that directly affect the health of the delivered fish.
              </li>
            </ul>
          </section>

          <section id="qualify" class="panel">
            <h2>How to qualify</h2>
            <p>To keep guarantee coverage in place, please:</p>
            <ul>
              <li>provide a complete, accurate shipping address before the order ships;</li>
              <li>be available to receive the shipment on the first delivery attempt;</li>
              <li>inspect the box and livestock as soon as the package arrives;</li>
              <li>follow the acclimation instructions provided with your order or on our site;</li>
              <li>
                place the fish only into a mature, stable, saltwater aquarium with appropriate water
                quality and compatible tankmates; and
              </li>
              <li>contact us within the claim windows below if there is a concern.</li>
            </ul>
          </section>

          <section id="claim-window" class="panel">
            <h2>Claim timeframe</h2>
            <p>
              For dead-on-arrival concerns, contact us within 2 hours of the carrier delivery scan
              whenever possible. Please photograph the fish in the unopened shipping bag before
              acclimation or disposal.
            </p>
            <p>
              For issues during the rest of the guarantee period, contact us as soon as you notice a
              problem and no later than the end of the third calendar day after delivery. Waiting to
              report a problem may limit what we can verify or offer.
            </p>
          </section>

          <section id="proof" class="panel">
            <h2>Required proof</h2>
            <p>
              We may ask for clear photos or video so we can review the claim fairly. Helpful proof
              includes:
            </p>
            <ul>
              <li>photos of the unopened shipping bag for dead-on-arrival claims;</li>
              <li>photos or video of the fish and its condition;</li>
              <li>photos of the shipping box and label if the package appears damaged or delayed;</li>
              <li>delivery time, acclimation steps, and when symptoms were first noticed;</li>
              <li>current aquarium water parameters, including temperature, salinity, pH, ammonia, nitrite, and nitrate when available; and</li>
              <li>any other details we reasonably need to evaluate the claim.</li>
            </ul>
            <p>
              Please do not discard the fish, shipping bag, or packaging until we confirm next steps.
            </p>
          </section>

          <section id="exclusions" class="panel">
            <h2>What is not covered</h2>
            <p>The guarantee may not apply when loss or decline is caused by:</p>
            <ul>
              <li>an incorrect or incomplete shipping address;</li>
              <li>a missed first delivery attempt, package refusal, or customer-requested reroute;</li>
              <li>failure to report a concern within the required claim window;</li>
              <li>improper acclimation, unstable water quality, or an unsuitable aquarium;</li>
              <li>aggressive or incompatible tankmates;</li>
              <li>discarding the fish or packaging before we can review required proof;</li>
              <li>events outside the eligible fish order, including other livestock, equipment, or aquarium losses; or</li>
              <li>
                carrier disruptions, weather events, or other circumstances outside our control when
                they prevent safe or timely delivery after the shipment leaves our care.
              </li>
            </ul>
          </section>

          <section id="remedies" class="panel">
            <h2>Remedy options</h2>
            <p>
              Approved remedies may include a replacement fish, store credit, refund, or another
              solution that fits the situation. Remedy availability depends on livestock availability,
              order details, weather, carrier conditions, and our review of the claim.
            </p>
            <p>
              Shipping charges, replacement-shipping costs, optional services, and non-livestock
              losses may be excluded unless we state otherwise in writing.
            </p>
          </section>

          <section id="support" class="panel support-panel">
            <h2>How to contact us</h2>
            <p>
              If you need guarantee support, email
              <a href="mailto:support@blueeyedclowns.com">support@blueeyedclowns.com</a> or use our
              <NuxtLink to="/contact">contact page</NuxtLink>. Include your order details, delivery
              time, photos or video, and a short description of what happened.
            </p>
            <p>
              We care about the animals we raise and the customers who receive them. The sooner you
              reach out, the faster we can review the issue and help with next steps.
            </p>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.guarantee-page {
  padding: 3.5rem 1.5rem 4.5rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%, #000 100%);
  color: #e5e7eb;
}

.inner {
  max-width: 1120px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.breadcrumb a,
.content a,
.toc a {
  color: #7dd3fc;
  text-decoration: none;
}

.breadcrumb a:hover,
.content a:hover,
.toc a:hover {
  text-decoration: underline;
}

.hero {
  max-width: 760px;
}

.eyebrow {
  color: #7dd3fc;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin: 0 0 0.5rem;
}

h1 {
  font-size: clamp(2.25rem, 5vw, 4rem);
  line-height: 1.04;
  margin: 0 0 1rem;
}

.hero p {
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.7;
}

.updated {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.notice,
.panel,
.toc {
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.32);
}

.notice {
  display: flex;
  gap: 0.65rem;
  margin: 2rem 0;
  padding: 1rem 1.15rem;
  color: #dbeafe;
}

.notice strong {
  color: #e0f2fe;
  white-space: nowrap;
}

.layout {
  display: grid;
  grid-template-columns: 17rem minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.toc {
  position: sticky;
  top: 6rem;
  padding: 1.25rem;
}

.toc h2 {
  color: #e0f2fe;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 0.9rem;
}

.toc ol {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding-left: 1.2rem;
  color: #64748b;
}

.toc a {
  color: #cbd5e1;
  font-size: 0.92rem;
}

.content {
  display: grid;
  gap: 1rem;
}

.panel {
  scroll-margin-top: 6.5rem;
  padding: 1.4rem;
}

.panel h2 {
  color: #e0f2fe;
  font-size: 1.35rem;
  line-height: 1.25;
  margin: 0 0 0.85rem;
}

.panel p,
.panel li {
  color: #cbd5e1;
  line-height: 1.7;
}

.panel p {
  margin: 0;
}

.panel p + p,
.panel p + ul,
.panel ul + p {
  margin-top: 0.85rem;
}

.panel ul {
  padding-left: 1.25rem;
}

.support-panel {
  border-color: rgba(34, 211, 238, 0.35);
  background: linear-gradient(135deg, rgba(8, 47, 73, 0.38), rgba(15, 23, 42, 0.72));
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .toc {
    position: static;
  }
}

@media (max-width: 640px) {
  .guarantee-page {
    padding: 2.5rem 1rem 3.5rem;
  }

  .notice {
    flex-direction: column;
  }

  .notice strong {
    white-space: normal;
  }

  .panel {
    padding: 1.15rem;
  }
}
</style>
