import LeadForm from "../components/LeadForm";
import { BRAND, SITE, telHref, mailHref } from "../lib/site";
import { useCanonical, useDocumentTitle } from "../lib/seo";

export default function Contact() {
  useDocumentTitle(
    `Contact · ${BRAND} · Antoinette Ferry`,
    `Reach ${SITE.name} directly: ${SITE.phone}, ${SITE.email}. Commercial sales and leasing across Nassau County, Florida.`
  );
  useCanonical("/contact");
  return (
    <section className="wrap section">
      <p className="eyebrow">Contact</p>
      <h1 className="t-page mt-4 max-w-3xl">Requirements welcome. Off-market conversations too.</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <dl className="rule-strong">
            <div className="spec-row">
              <dt>Direct</dt>
              <dd>
                <a href={telHref} className="hover:text-accent">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div className="spec-row">
              <dt>Email</dt>
              <dd>
                <a href={mailHref} className="hover:text-accent">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="spec-row">
              <dt>Brokerage</dt>
              <dd className="max-w-[16rem]">{SITE.brokerageShort}</dd>
            </div>
            <div className="spec-row">
              <dt>Office</dt>
              <dd className="max-w-[16rem]">{SITE.officeAddress}</dd>
            </div>
            <div className="spec-row">
              <dt>Office phone</dt>
              <dd>{SITE.officePhone}</dd>
            </div>
          </dl>
          <p className="reading mt-6 max-w-md text-fg-2">
            Calls and texts go to her directly, not a front desk. If you're standing on a property
            right now, just call. The traffic count can wait.
          </p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
