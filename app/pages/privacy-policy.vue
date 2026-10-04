<script setup>
useSiteSeo({
  title: 'Privacy Policy',
  description:
    'Privacy policy for orders, the release list, contact inquiries, and email sent through Resend.',
  noindex: true,
})

const lastUpdated = 'October 4, 2026'

const toc = [
  ['information', 'Information we may collect'],
  ['cookies', 'Cookies and analytics'],
  ['use', 'How we use information'],
  ['sharing', 'Limited third-party sharing'],
  ['security', 'Data security'],
  ['retention', 'How long we keep information'],
  ['choices', 'User choices and requests'],
  ['children', 'Children’s privacy'],
  ['links', 'Links to other websites'],
  ['rights', 'State, regional, or international privacy rights'],
  ['updates', 'Policy updates'],
  ['contact', 'Contact us'],
]
</script>

<template>
  <article class="privacy-page">
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Privacy Policy</span>
      </nav>

      <header class="hero">
        <p class="eyebrow">Website policies</p>
        <h1>Privacy Policy</h1>
        <p>
          Blue Eyed Clowns ("Blue Eyed Clowns," "we," "our," or "us") respects
          your privacy. This Privacy Policy explains what information we may collect when you visit
          or use the Blue Eyed Clowns website, shop for captive-bred clownfish, contact us, or
          request customer support; how we use and protect that information; when limited sharing may
          be necessary; and the choices available to you.
        </p>
        <p class="updated">Last updated: {{ lastUpdated }}</p>
      </header>

      <div class="layout">
        <aside class="toc" aria-label="Privacy policy sections">
          <h2>On this page</h2>
          <ol>
            <li v-for="[id, label] in toc" :key="id">
              <a :href="`#${id}`">{{ label }}</a>
            </li>
          </ol>
        </aside>

        <div class="content">
          <section id="information" class="panel">
            <h2>1. Information We May Collect</h2>
            <p>
              We collect information you choose to give us, information needed to process orders or
              answer requests, and limited technical information about website use.
            </p>
            <p>Orders. When you check out, we store:</p>
            <ul>
              <li>Name and email address;</li>
              <li>Shipping address;</li>
              <li>The clownfish or bonded pairs in the order, quantities, and totals;</li>
              <li>Order status and a Stripe payment intent id.</li>
            </ul>
            <p>
              Card numbers are entered in Stripe’s payment form and processed by Stripe. We do not
              store full payment card numbers on Blue Eyed Clowns servers. Stripe may return payment
              status and the payment intent id so we can record a paid order.
            </p>
            <p>Release list. If you join the release list on the homepage, footer, or an empty shop page, we store:</p>
            <ul>
              <li>Email address;</li>
              <li>Name, if you provide one;</li>
              <li>Where you signed up, whether you are subscribed, and an unsubscribe token.</li>
            </ul>
            <p>
              Contact inquiries. The contact form stores wholesale requests, local pickup requests,
              product questions, and other messages, including name, email, phone if you provide one,
              subject, message, and the fish or bonded-pair page you asked about.
            </p>
            <p>Other information you may send us:</p>
            <ul>
              <li>Photos or notes for live-arrival, health guarantee, refund, or replacement requests; and</li>
              <li>Messages you send directly to blueeyedclowns@gmail.com.</li>
            </ul>
            <p>Technical and website-use information may include:</p>
            <ul>
              <li>IP address;</li>
              <li>Browser type, device type, and operating system;</li>
              <li>Pages visited, links clicked, and approximate visit duration;</li>
              <li>Referring website or search terms;</li>
              <li>Approximate location inferred from IP address;</li>
              <li>Date and time of visits; and</li>
              <li>Cookies or similar tracking technologies, if enabled on the website.</li>
            </ul>
          </section>

          <section id="cookies" class="panel">
            <h2>2. Cookies and Analytics</h2>
            <p>
              The shopping cart is stored in local storage in your browser on this device. It is not
              sent to us until you start checkout. We do not run a third-party advertising pixel or
              a separate analytics product on this site.
            </p>
            <p>
              Stripe’s payment form at checkout is provided by Stripe and may use cookies or similar
              technology under Stripe’s own privacy policy. The site is hosted on Vercel, which may
              process standard server logs such as IP address, browser, and the page requested.
            </p>
            <p>
              Most browsers let you block or delete cookies and site data. Checkout may not work if
              the browser blocks the payment form.
            </p>
          </section>

          <section id="use" class="panel">
            <h2>3. How We Use Information</h2>
            <p>We may use collected information to:</p>
            <ul>
              <li>Process, confirm, and fulfill orders, including the order confirmation email;</li>
              <li>Arrange shipping and delivery of live fish and related products;</li>
              <li>Send release-list emails when you have subscribed, and stop them when you unsubscribe;</li>
              <li>Provide customer service and respond to inquiries;</li>
              <li>Evaluate live-arrival, health guarantee, refund, replacement, or support claims;</li>
              <li>
                Communicate order updates, shipping instructions, acclimation guidance, policy
                information, and support responses;
              </li>
              <li>Respond to wholesale, local pickup, or business inquiries;</li>
              <li>Improve website content, product availability, and customer experience;</li>
              <li>Maintain website security and prevent fraud, abuse, or unauthorized access;</li>
              <li>Keep business, accounting, tax, and transaction records; and</li>
              <li>
                Comply with legal, tax, regulatory, shipping, insurance, or law-enforcement
                requirements.
              </li>
            </ul>
            <p>
              We do not use personal information for purposes that are unrelated to operating the
              website, fulfilling customer requests, supporting customers, improving the business,
              protecting the website, or meeting legal obligations unless we first provide
              appropriate notice or obtain consent where required.
            </p>
          </section>

          <section id="sharing" class="panel">
            <h2>4. Limited Third-Party Sharing</h2>
            <p>
              Blue Eyed Clowns does not sell, rent, or trade users’ personal information. We also do
              not divulge users’ personal information to third-party services for their own unrelated
              marketing or sales purposes.
            </p>
            <p>
              We may share limited personal information only when reasonably necessary to operate the
              website, provide requested services, fulfill orders, support customers, protect the
              business, or comply with legal obligations. For example, we may share information with:
            </p>
            <ul>
              <li>Stripe, to take payment and confirm that an order was paid;</li>
              <li>Supabase, which stores orders, customers, release-list signups, and inquiries;</li>
              <li>Vercel, which hosts the website;</li>
              <li>UPS or FedEx, to deliver orders Monday through Thursday;</li>
              <li>
                Resend, to send order confirmation emails to you, and to notify
                blueeyedclowns@gmail.com about new orders and new inquiries;
              </li>
              <li>
                Professional advisors, such as accountants, attorneys, insurers, or compliance
                consultants, when needed for ordinary business purposes; and
              </li>
              <li>
                Government, regulatory, or law-enforcement authorities when required by law,
                subpoena, court order, or valid legal process, or when disclosure is reasonably
                necessary to protect rights, safety, property, customers, animals, or the integrity of
                our services.
              </li>
            </ul>
            <p>
              These third parties should receive only the information reasonably necessary to perform
              the relevant service or legal function. Blue Eyed Clowns does not authorize service
              providers to use personal information for their own unrelated marketing or sales
              purposes.
            </p>
          </section>

          <section id="security" class="panel">
            <h2>5. Data Security</h2>
            <p>
              We use reasonable administrative, technical, and physical safeguards intended to protect
              personal information from unauthorized access, loss, misuse, alteration, or disclosure.
            </p>
            <p>Examples may include:</p>
            <ul>
              <li>
                Limiting access to customer information to people who need it for business
                operations;
              </li>
              <li>Using secure website connections where appropriate;</li>
              <li>
                Relying on reputable payment processors rather than storing full payment card details
                directly;
              </li>
              <li>Maintaining account access controls for business systems; and</li>
              <li>
                Reviewing support, order, and shipping workflows for unnecessary exposure of customer
                information.
              </li>
            </ul>
            <p>
              No website, email system, payment system, or internet transmission is completely secure.
              We cannot guarantee absolute security, but we aim to handle personal information
              responsibly and to use safeguards appropriate for a small ecommerce and aquaculture
              business.
            </p>
          </section>

          <section id="retention" class="panel">
            <h2>6. How Long We Keep Information</h2>
            <p>
              We keep personal information for as long as reasonably necessary to provide services,
              fulfill orders, respond to support or guarantee requests, maintain business and tax
              records, resolve disputes, prevent fraud, and comply with legal obligations.
            </p>
            <p>
              Retention periods may vary depending on the type of information and the reason it was
              collected. For example, order and transaction records may need to be kept longer than
              general website analytics data.
            </p>
          </section>

          <section id="choices" class="panel">
            <h2>7. User Choices and Requests</h2>
            <p>You may contact us to request that we:</p>
            <ul>
              <li>Provide a copy of certain personal information associated with you;</li>
              <li>Correct inaccurate contact or order information;</li>
              <li>
                Delete information that is no longer needed, subject to legal, tax, fraud-prevention,
                shipping, warranty, guarantee, accounting, or recordkeeping requirements; or
              </li>
              <li>
                Unsubscribe from the release list. Use the unsubscribe link in a release email, or
                the unsubscribe page linked from that email. That does not stop order or shipping
                emails for a purchase you already made.
              </li>
            </ul>
            <p>
              Order-related, shipping, safety, warranty, guarantee, legal, and customer-service
              communications may still be sent when necessary to complete a transaction or respond to
              a request.
            </p>
            <p>
              To make a privacy request, contact us at
              <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a>. We may
              need to verify your identity before completing certain requests.
            </p>
          </section>

          <section id="children" class="panel">
            <h2>8. Children’s Privacy</h2>
            <p>
              The Blue Eyed Clowns website is intended for general audiences interested in reef
              aquariums, aquaculture, and purchasing captive-bred clownfish. It is not directed to
              children under 13, and we do not knowingly collect personal information from children
              under 13.
            </p>
            <p>
              If a parent or guardian believes a child has provided personal information to us, they
              should contact us at
              <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a>, and we
              will review and delete the information where appropriate.
            </p>
          </section>

          <section id="links" class="panel">
            <h2>9. Links to Other Websites</h2>
            <p>
              The website may contain links to third-party websites, services, payment pages, social
              media pages, shipping carriers, or other resources. Blue Eyed Clowns is not responsible
              for the privacy practices, security, or content of third-party websites. Visitors should
              review the privacy policies of those third parties before providing information to them.
            </p>
          </section>

          <section id="rights" class="panel">
            <h2>10. State, Regional, or International Privacy Rights</h2>
            <p>
              Depending on where you live, you may have additional privacy rights under state,
              national, or regional privacy laws. Blue Eyed Clowns is a U.S. aquaculture business
              shipping captive-bred clownfish. If a privacy law applies to your information, contact
              us and we will respond.
            </p>
            <p>
              If a legally applicable privacy right applies to your information, you may contact us at
              <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a> to submit a
              request.
            </p>
          </section>

          <section id="updates" class="panel">
            <h2>11. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our website,
              business practices, legal requirements, service providers, or customer support workflows.
              When we update the Policy, we will revise the last-updated date above.
            </p>
            <p>
              Continued use of the website after an updated Privacy Policy is posted means the updated
              Policy applies going forward.
            </p>
          </section>

          <section id="contact" class="panel">
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how Blue Eyed Clowns handles personal
              information, please contact us:
            </p>
            <p>
              Blue Eyed Clowns<br />
              Email: <a href="mailto:blueeyedclowns@gmail.com">blueeyedclowns@gmail.com</a><br />
              Website: <a href="https://blueeyedclowns.com/">https://blueeyedclowns.com/</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.privacy-page {
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
.panel ul + p,
.panel ul + ul {
  margin-top: 0.85rem;
}

.panel ul {
  padding-left: 1.25rem;
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
  .privacy-page {
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
