import LeadForm from "../components/LeadForm";
import Photo from "../components/Photo";
import { BRAND, SITE, telHref, mailHref } from "../lib/site";
import { useCanonical, useDocumentTitle } from "../lib/seo";

export default function About() {
  useDocumentTitle(
    `About ${SITE.name} · ${SITE.title} · ${BRAND}`,
    `${SITE.name} is ${SITE.title} at ${SITE.brokerage} in Fernandina Beach, Florida.`
  );
  useCanonical("/about");

  return (
    <>
      <section className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        {SITE.portrait && (
          <div className="lg:col-span-4">
            <Photo
              src={SITE.portrait}
              alt={SITE.name}
              widths={[320, 640, 960]}
              sizes="(min-width: 1024px) 380px, 100vw"
              loading="eager"
              width={960}
              height={960}
              className="aspect-square w-full max-w-sm rounded object-cover lg:max-w-none"
            />
          </div>
        )}
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="eyebrow">About</p>
          <h1 className="t-page mt-4">{SITE.name}</h1>
          <p className="mt-3 text-base text-fg-2">{SITE.title}</p>
          <p className="text-base text-fg-2">{SITE.brokerage}</p>

          {/* Her bio, in her voice, arrives via /admin. Until then the page states
              only verifiable facts — no ghost-written prose. */}
          {SITE.bioConfirmed ? (
            <p className="reading mt-8 max-w-2xl text-fg">{SITE.bio}</p>
          ) : (
            <dl className="rule-strong mt-10">
              <div className="spec-row">
                <dt>Practice</dt>
                <dd>Commercial sales &amp; leasing, Nassau County FL</dd>
              </div>
              <div className="spec-row">
                <dt>Office</dt>
                <dd>{SITE.officeAddress}</dd>
              </div>
              {SITE.memberships.map((m) => (
                <div className="spec-row" key={m}>
                  <dt>Member</dt>
                  <dd>{m}</dd>
                </div>
              ))}
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
            </dl>
          )}

          <p className="reading mt-8 max-w-2xl text-fg-2">
            Antoinette works both of the region's listing networks, realMLS across Northeast Florida
            and AINCAR on the island, so a Nassau County property reaches the mainland and the island
            at once, backed by the Berkshire Hathaway HomeServices commercial network.
          </p>

          <img
            src="/brand/hw-commercial-lockup-cab.svg"
            alt="Berkshire Hathaway HomeServices Heymann Williams Realty — Commercial Division"
            width={874}
            height={302}
            loading="lazy"
            className="mt-10 h-14 w-auto"
          />
        </div>
      </section>

      <section className="wrap grid gap-10 pb-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <p className="eyebrow">Contact</p>
          <h2 className="t-section mt-3">Reach her directly.</h2>
        </div>
        <div className="lg:col-span-8">
          <LeadForm />
        </div>
      </section>
    </>
  );
}
