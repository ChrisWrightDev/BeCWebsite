<script setup>
useSiteSeo({
  title: 'Terms of Service',
  description:
    'Terms of Service for using the Blue-Eyed Clowns website, ordering captive-bred clownfish, live animal shipping, guarantees, and customer support.',
  noindex: true,
})

const lastUpdated = 'June 3, 2026'

const toc = [
  ['acceptance', 'Acceptance of these Terms'],
  ['website-use', 'Website use'],
  ['orders', 'Products, orders, and availability'],
  ['shipping', 'Live animal shipping and delivery'],
  ['guarantee', 'Live arrival and health guarantee'],
  ['care-information', 'Aquarium care information'],
  ['accounts-payment', 'Accounts, checkout, and payment'],
  ['wholesale-pickup', 'Wholesale, local pickup, and special orders'],
  ['ip', 'Intellectual property'],
  ['conduct', 'User conduct'],
  ['third-party', 'Third-party links and services'],
  ['disclaimers', 'Disclaimers'],
  ['liability', 'Limitation of liability'],
  ['indemnification', 'Indemnification'],
  ['termination', 'Termination or suspension'],
  ['law-disputes', 'Governing law and disputes'],
  ['changes', 'Changes to these Terms'],
  ['contact', 'Contact information'],
]
</script>

<template>
  <article class="terms-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Terms of Service</span>
      </nav>

      <header class="hero">
        <p class="eyebrow">Website policies</p>
        <h1>Terms of Service</h1>
        <p>
          These Terms explain how customers and visitors may use the Blue-Eyed Clowns website,
          place orders, and interact with our live animal shipping and support policies.
        </p>
        <p class="updated">Last updated: {{ lastUpdated }}</p>
      </header>

      <section class="notice" aria-label="Legal review notice">
        <strong>Legal review notice:</strong>
        <span>
          This page is a business draft for website publication and is not legal advice. Blue-Eyed
          Clowns should have these Terms reviewed by qualified legal counsel before relying on them
          as final legal terms.
        </span>
      </section>

      <div class="layout">
        <aside class="toc" aria-label="Terms sections">
          <h2>On this page</h2>
          <ol>
            <li v-for="[id, label] in toc" :key="id">
              <a :href="`#${id}`">{{ label }}</a>
            </li>
          </ol>
        </aside>

        <div class="content">
          <section id="acceptance" class="panel">
            <h2>1. Acceptance of these Terms</h2>
            <p>
              Welcome to Blue-Eyed Clowns. By visiting our website, contacting us through the site,
              signing up for updates, placing an order, or purchasing products from us, you agree to
              these Terms of Service and any policies referenced here.
            </p>
            <p>
              If you do not agree with these Terms, please do not use the website or place an order.
              We may refuse service, cancel orders, or limit access when these Terms are not followed.
            </p>
          </section>

          <section id="website-use" class="panel">
            <h2>2. Website use</h2>
            <p>
              You may use this website to learn about Blue-Eyed Clowns, browse captive-bred
              clownfish, read care and shipping information, contact us, and purchase available
              products. You agree to use the site only for lawful purposes and in a way that does not
              disrupt the site or interfere with anyone else's use.
            </p>
            <p>
              Information on the site may change as inventory, shipping conditions, policies, and
              business operations change. We work to keep information accurate, but occasional
              errors, omissions, or outdated details may occur.
            </p>
          </section>

          <section id="orders" class="panel">
            <h2>3. Products, orders, and availability</h2>
            <p>
              Blue-Eyed Clowns specializes in captive-bred clownfish and related reef-aquarium
              offerings. Product photos may be representative unless a listing clearly says it is the
              exact individual fish being sold. Size, color, pattern, sex, pairing behavior, and
              availability can vary with live animals.
            </p>
            <p>
              Product listings, prices, and inventory are not guaranteed until an order is accepted
              and confirmed. We may correct listing errors, cancel unavailable items, request
              additional information, or decline an order when weather, carrier timing, animal health,
              payment, fraud risk, destination restrictions, or other operational concerns make the
              order unsuitable.
            </p>
          </section>

          <section id="shipping" class="panel">
            <h2>4. Live animal shipping and delivery</h2>
            <p>
              Live clownfish orders are shipped by overnight delivery on eligible shipping days. Our
              current site copy states that live-fish shipping is available Monday through Friday,
              subject to order cutoff, animal readiness, destination, weather, carrier availability,
              holidays, and other conditions that affect safe transit.
            </p>
            <p>
              The customer is responsible for providing a complete and accurate shipping address,
              monitoring tracking information, and receiving the shipment on the first delivery
              attempt. Delays caused by incorrect addresses, missed delivery attempts, package
              refusal, carrier reroutes requested by the customer, or failure to follow arrival
              instructions may affect guarantee eligibility.
            </p>
            <p>
              We may delay shipment for the animal's welfare when temperatures, storms, carrier
              disruptions, or other risks make shipping unsafe. When practical, we will contact you
              about a revised shipping date.
            </p>
          </section>

          <section id="guarantee" class="panel">
            <h2>5. Live arrival and health guarantee</h2>
            <p>
              Blue-Eyed Clowns currently offers a 3-day live guarantee for eligible clownfish orders.
              Guarantee coverage is intended to support customers when a fish arrives unhealthy,
              arrives dead, or declines within the stated guarantee window due to a pre-existing
              condition or covered shipping issue.
            </p>
            <p>
              To request guarantee support, contact us promptly at
              <a href="mailto:support@blueeyedclowns.com">support@blueeyedclowns.com</a>. For a
              dead-on-arrival concern, take clear photos of the unopened shipping bag within two
              hours of delivery and do not discard the fish until we confirm next steps. We may ask
              for photos, video, water parameters, acclimation details, delivery timing, or other
              information needed to evaluate the claim.
            </p>
            <p>
              Remedies may include replacement, store credit, refund, or another solution at our
              discretion and subject to availability. Shipping charges, optional services, and losses
              outside the eligible fish order may be excluded unless we state otherwise in writing.
            </p>
          </section>

          <section id="care-information" class="panel">
            <h2>6. Aquarium care information</h2>
            <p>
              Our website may include acclimation, husbandry, compatibility, nutrition, and reef
              aquarium information. This content is provided for general educational purposes only and
              is not a guarantee that any fish will thrive in a particular aquarium.
            </p>
            <p>
              You are responsible for maintaining appropriate water quality, tank maturity,
              quarantine practices, compatible tankmates, feeding, and acclimation procedures. Live
              animal outcomes depend on many factors outside our control after delivery.
            </p>
          </section>

          <section id="accounts-payment" class="panel">
            <h2>7. Accounts, checkout, and payment</h2>
            <p>
              If the website offers checkout, accounts, email signup, or other interactive features,
              you agree to provide current, complete, and accurate information. You are responsible
              for activity associated with information you submit and for keeping any account or
              checkout details secure.
            </p>
            <p>
              Payments may be processed by third-party payment providers. By placing an order, you
              authorize the applicable payment provider to charge your selected payment method for the
              order total, taxes, shipping, and any other charges shown at checkout.
            </p>
          </section>

          <section id="wholesale-pickup" class="panel">
            <h2>8. Wholesale, local pickup, and special orders</h2>
            <p>
              Wholesale inquiries, local pickup requests, special orders, breeding requests, and
              similar arrangements may require separate confirmation, pricing, timing, and terms.
              Unless we agree otherwise in writing, these Terms still apply to those arrangements.
            </p>
          </section>

          <section id="ip" class="panel">
            <h2>9. Intellectual property</h2>
            <p>
              The website, brand elements, text, graphics, product descriptions, photos, images,
              logos, and other content are owned by Blue-Eyed Clowns or used with permission. You may
              not copy, reproduce, modify, distribute, sell, or exploit site content without our prior
              written permission, except for ordinary personal, non-commercial use of the site.
            </p>
          </section>

          <section id="conduct" class="panel">
            <h2>10. User conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>submit false, misleading, or fraudulent information;</li>
              <li>attempt to access systems, data, accounts, or checkout flows without permission;</li>
              <li>interfere with site security, performance, or availability;</li>
              <li>use the website to harass, threaten, or abuse others;</li>
              <li>upload malware, spam, or unlawful content; or</li>
              <li>use the site in violation of applicable laws, regulations, or carrier rules.</li>
            </ul>
          </section>

          <section id="third-party" class="panel">
            <h2>11. Third-party links and services</h2>
            <p>
              The website may link to or rely on third-party services such as payment processors,
              shipping carriers, analytics providers, map services, email tools, social platforms, or
              other websites. We are not responsible for third-party content, policies, outages,
              errors, or practices. Your use of third-party services may be subject to their own
              terms and privacy policies.
            </p>
          </section>

          <section id="disclaimers" class="panel">
            <h2>12. Disclaimers</h2>
            <p>
              The website and its content are provided on an "as is" and "as available" basis. To
              the fullest extent permitted by law, Blue-Eyed Clowns disclaims warranties of any kind,
              whether express or implied, including implied warranties of merchantability, fitness for
              a particular purpose, title, and non-infringement.
            </p>
            <p>
              Because we sell live animals, we cannot guarantee specific color development, pattern
              development, pairing behavior, breeding outcomes, compatibility, disease resistance,
              aquarium performance, or long-term survival after delivery and acclimation.
            </p>
          </section>

          <section id="liability" class="panel">
            <h2>13. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Blue-Eyed Clowns and its owners, team members,
              suppliers, and service providers will not be liable for indirect, incidental, special,
              consequential, punitive, or exemplary damages, including loss of livestock, loss of
              profits, loss of data, aquarium losses, or other damages arising from your use of the
              website or purchase of products.
            </p>
            <p>
              To the fullest extent permitted by law, our total liability for any claim related to a
              product order will not exceed the amount you paid for the product that gave rise to the
              claim.
            </p>
          </section>

          <section id="indemnification" class="panel">
            <h2>14. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Blue-Eyed Clowns and its owners, team
              members, suppliers, and service providers from claims, damages, liabilities, costs, and
              expenses arising from your misuse of the website, violation of these Terms, violation of
              law, or violation of another person's rights.
            </p>
          </section>

          <section id="termination" class="panel">
            <h2>15. Termination or suspension</h2>
            <p>
              We may suspend or terminate your access to the website, refuse service, cancel orders,
              or block future purchases when we believe these Terms have been violated, an order is
              fraudulent or unsafe, or continued service creates operational, legal, animal-welfare,
              or security concerns.
            </p>
          </section>

          <section id="law-disputes" class="panel">
            <h2>16. Governing law and disputes</h2>
            <p>
              These Terms are intended to be governed by the laws of the state where Blue-Eyed Clowns
              is organized or primarily operates, without regard to conflict-of-law rules. This
              section should be finalized with qualified legal counsel before publication if a
              specific governing-law state, venue, arbitration process, class-action waiver, or other
              dispute-resolution procedure is desired.
            </p>
          </section>

          <section id="changes" class="panel">
            <h2>17. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. The updated version will be posted on this
              page with a revised last-updated date. Continued use of the website or placing an order
              after changes are posted means you accept the updated Terms.
            </p>
          </section>

          <section id="contact" class="panel">
            <h2>18. Contact information</h2>
            <p>
              Questions about these Terms, live animal shipping, guarantee support, wholesale orders,
              or local pickup can be sent to
              <a href="mailto:support@blueeyedclowns.com">support@blueeyedclowns.com</a> or through
              our <NuxtLink to="/contact">contact page</NuxtLink>.
            </p>
          </section>

          <section class="panel review-items" aria-labelledby="review-items-heading">
            <h2 id="review-items-heading">Assumptions and legal review items</h2>
            <p>
              The finalized business/legal version should confirm the official legal entity name,
              mailing address, governing-law state, dispute-resolution language, refund and shipping
              charge treatment, wholesale/local-pickup exceptions, and any state or carrier
              restrictions for live animal shipments.
            </p>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.terms-page {
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
.panel p + ul {
  margin-top: 0.85rem;
}

.panel ul {
  padding-left: 1.25rem;
}

.review-items {
  border-color: rgba(251, 191, 36, 0.35);
  background: rgba(69, 26, 3, 0.24);
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
  .terms-page {
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
