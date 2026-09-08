import { lazy, Suspense, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingLedger from "../components/ListingLedger";
import LeadForm from "../components/LeadForm";

const MiniMap = lazy(() => import("../components/MiniMap"));
import { USE_TYPE_LABEL } from "../lib/commercial";
import { listingsForCities } from "../lib/listingsSource";
import { marketBySlug, markets } from "../lib/markets";
import { record } from "../lib/attunement";
import { BRAND, SITE } from "../lib/site";
import { useCanonical, useDocumentTitle, useJsonLd } from "../lib/seo";

/**
 * The geo squeeze pages. The crawler-facing version is stamped statically by
 * scripts/prerender.mjs from the same markets.json; this component is the
 * hydrated experience.
 */
export default function MarketPage({ slug }: { slug: string }) {
  const m = marketBySlug(slug)!;
  useDocumentTitle(`${m.h1} · ${BRAND}`, m.tagline);
  useCanonical(`/${m.slug}`);
  useJsonLd(
    m.slug,
    useMemo(
      () => ({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Place",
            name: `${m.name}, Florida`,
            description: m.tagline,
            geo: { "@type": "GeoCoordinates", latitude: m.lat, longitude: m.lon },
          },
          {
            "@type": "FAQPage",
            mainEntity: m.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }),
      [m]
    )
  );
  useEffect(() => {
    record({ t: "market", slug: m.slug });
  }, [m.slug]);

  const navigate = useNavigate();
  const related = listingsForCities(m.cities);
  const siblings = markets.filter((x) => x.slug !== m.slug);

  return (
    <section className="wrap section">
      <nav className="text-sm text-fg-3" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-fg">
          Home
        </Link>{" "}
        › Markets
      </nav>
      <p className="eyebrow mt-4">{m.name} · Nassau County · Florida</p>
      <h1 className="t-page mt-4 max-w-3xl">{m.h1}</h1>
      <p className="reading-lg mt-6 max-w-2xl text-fg-2">{m.tagline}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <p className="reading max-w-2xl text-fg">{m.intro}</p>

          <h2 className="eyebrow mb-3 mt-10">The corridors</h2>
          <ul className="flex flex-wrap gap-2">
            {m.corridors.map((c) => (
              <li key={c} className="chip cursor-default">
                {c}
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mb-3 mt-10">What trades here</h2>
          <ul className="flex flex-wrap gap-2">
            {m.useTypes.map((u) => (
              <li key={u} className="chip cursor-default">
                {USE_TYPE_LABEL[u]}
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mb-3 mt-10">The map</h2>
          <Suspense fallback={<div className="h-[340px] rounded border border-line bg-ground-2" />}>
            <MiniMap
              listings={related.length ? related : []}
              onOpen={(slug) => navigate(`/listings/${slug}`)}
              view={{ lat: m.lat, lon: m.lon, zoom: m.zoom }}
              heightClass="h-[340px]"
            />
          </Suspense>
          <p className="mt-2 text-xs text-fg-3">
            {related.length ? "Pins mark current listings. " : ""}The full map is at{" "}
            <Link to="/explore" className="text-accent hover:text-fg">
              /explore
            </Link>
            .
          </p>

          <h2 className="t-section mt-14">Buyer &amp; tenant questions</h2>
          <div className="rule-strong mt-6">
            {m.faqs.map((f) => (
              <div key={f.q} className="border-b border-line py-5">
                <h3 className="t-sub">{f.q}</h3>
                <p className="reading mt-2 max-w-2xl text-fg-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="pane p-6 lg:sticky lg:top-24">
            <p className="text-sm leading-relaxed text-fg-2">
              {SITE.name} is {SITE.title} at {SITE.brokerageShort}, the commercial practice for{" "}
              {m.name}.
            </p>
            <Link to="/contact" className="btn-primary mt-4 w-full px-5 py-2.5 text-sm">
              Talk about {m.shortName}
            </Link>
            <Link to="/explore" className="btn-outline mt-2 w-full px-5 py-2.5 text-sm">
              Open the map
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <p className="eyebrow mb-4">Current listings in {m.name}</p>
          <ListingLedger compact listings={related} />
        </div>
      )}

      <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <p className="eyebrow">Start here</p>
          <h2 className="t-section mt-3">Looking in {m.name}?</h2>
        </div>
        <div className="lg:col-span-8">
          <LeadForm context={{ market: m.name }} />
        </div>
      </div>

      <nav className="hairline mt-16 pt-8" aria-label="Other markets">
        <h2 className="eyebrow mb-3">Other Nassau County markets</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {siblings.map((s) => (
            <li key={s.slug}>
              <Link to={`/${s.slug}`} className="text-fg-2 hover:text-fg">
                {s.name} commercial real estate
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
