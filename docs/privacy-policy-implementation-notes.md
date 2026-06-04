# Privacy Policy implementation notes

Branch: `feat/t_7680d64a-privacy-policy`

## Changed files

- `app/pages/privacy-policy.vue` — adds the dedicated Privacy Policy page with the approved policy content, desktop/mobile readable layout, section table of contents, and contact links.
- `app/app.vue` — replaces the footer placeholder with a live `Privacy Policy` link to `/privacy-policy`.
- `docs/privacy-policy-implementation-notes.md` — records implementation details for review.

## Publication details

- Route: `/privacy-policy`
- Footer location: Policies column
- Effective date used for publication: June 3, 2026
- Contact placeholders were linked to `support@blueeyedclowns.com`, matching the public support email used elsewhere on the site.
- The mailing-address placeholder was formatted as “Contact us for current mailing information” because no public mailing address was provided in the task context.
- The advisory review notes from the parent artifact were not published as customer-facing policy content; the relevant review caveat is represented as a legal review notice at the top of the page.

## Remaining deployment steps

- Technology Director review and approval.
- Merge the review branch.
- Deploy the site through the existing website deployment pipeline after merge.
- Optional legal/business confirmation before relying on the policy as final legal text, especially provider list, mailing address, and state/international privacy notices.
