import { lazy, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import ListingLedger from "../components/ListingLedger";
import Photo from "../components/Photo";

const MiniMap = lazy(() => import("../components/MiniMap"));
import {
  LEASE_BASIS_LABEL,
  priceLine,
  STATUS_LABEL,
  TRANSACTION_LABEL,
  USE_TYPE_LABEL,
  type CommercialListing,
} from "../lib/commercial";
import { aadt, acres, miles, minutes, pct, sf, usd } from "../lib/format";
import { allListings, bySlug } from "../lib/listingsSource";
import { record } from "../lib/attunement";
import { BRAND, SITE } from "../lib/site";
import { useCanonical, useDocumentTitle, useJsonLd } from "../lib/seo";

function Spec({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="eyebrow rule-strong pt-3">{title}</h3>
      <dl className="mt-1">{children}</dl>
    </div>
  );
}

function jsonLdFor(l: CommercialListing) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: l.headline,
        url: `${SITE.domain}/listings/${l.slug}`,
        ...(l.listedAt ? { datePosted: l.listedAt } : {}),
        about: {
          "@type": "Place",
          name: l.address,
          address: {
            "@type": "PostalAddress",
            streetAddress: l.address,
            addressLocality: l.city,
            addressRegion: l.state,
            postalCode: l.zip,
            addressCountry: "US",
          },
          geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lon },
        },
        ...(l.salePrice
          ? { offers: { "@type": "Offer", price: l.salePrice, priceCurrency: "USD" } }
          : {}),
      },
      { "@id": `${SITE.domain}/#agent` },
    ],
  };
}

export default function ListingDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const l = slug ? bySlug(slug) : undefined;

  useDocumentTitle(
    l ? `${l.address}, ${l.city} · ${TRANSACTION_LABEL[l.transaction]} · ${BRAND}` : `Listing · ${BRAND}`,
    l?.summary
  );
  useCanonical(l ? `/listings/${l.slug}` : "/listings");
  useJsonLd(l?.slug ?? "none", useMemo(() => (l ? jsonLdFor(l) : null), [l]));

  useEffect(() => {
    if (l) {
      record({
        t: "listing_open",
        id: l.id,
        useType: l.useType,
        transaction: l.transaction,
        price: l.salePrice ?? null,
      });
      const opened = Date.now();
      return () => record({ t: "listing_dwell", id: l.id, ms: Date.now() - opened });
    }
  }, [l]);

  if (!l) {
    return (
      <section className="wrap section text-center">
        <h1 className="t-page">That listing isn't available.</h1>
        <Link to="/listings" className="btn-primary mt-8 inline-flex px-6 py-3 text-sm">
          Current listings
        </Link>
      </section>
    );
  }

  const others = allListings().filter((x) => x.id !== l.id).slice(0, 3);
  const hero = l.photos[0];
  const hasSite = l.zoning || l.frontageOn || l.trafficCount || l.ingress || l.corner || l.parcelId;
  const hasLogistics = l.distances?.length || l.driveTimes?.length;
  const hasTenancy = l.tenancy || l.tenants?.length || l.neighboringTenants?.length || l.occupancyPct !== undefined;

  return (
    <article>
      {/* head */}
      <div className="wrap pt-10 sm:pt-14">
        <nav className="text-sm text-fg-3" aria-label="Breadcrumb">
          <Link to="/listings" className="hover:text-fg">
            Listings
          </Link>{" "}
          › {l.city}
        </nav>
        <header className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              {TRANSACTION_LABEL[l.transaction]} · {USE_TYPE_LABEL[l.useType]}
              {l.status !== "available" ? ` · ${STATUS_LABEL[l.status]}` : ""}
            </p>
            <h1 className="t-page mt-4">{l.headline}</h1>
            <p className="reading-lg mt-4 text-fg-2">
              {l.address} · {l.city}, {l.state} {l.zip}
            </p>
          </div>
          <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
            <div className="rule-strong pt-3">
              <p className="figure">{priceLine(l)}</p>
            </div>
            <dl>
              {l.pricePerSF ? <Spec label="Per SF" value={`${usd(l.pricePerSF)}/SF`} /> : null}
              {l.capRate ? <Spec label="Cap rate" value={`${l.capRate}%`} /> : null}
              {l.landAcres ? <Spec label="Land" value={acres(l.landAcres)} /> : null}
              {l.buildingSF ? <Spec label="Building" value={sf(l.buildingSF)} /> : null}
            </dl>
          </div>
        </header>
      </div>

      {/* the photograph, full bleed */}
      <div className="mt-8">
        <Photo
          src={hero?.src}
          alt={hero?.alt ?? l.headline}
          widths={[960, 1600, 2400]}
          sizes="100vw"
          loading="eager"
          width={2400}
          height={1000}
          className="aspect-[16/10] w-full object-cover sm:aspect-[21/9] lg:aspect-[2.4/1]"
        />
        <div className="wrap">
          <p className="num border-b border-line py-2 text-xs text-fg-3">
            {l.photos.length > 1 ? `${l.photos.length} photos` : hero?.alt}
            {l.mlsNumber ? ` · MLS #${l.mlsNumber}` : ""}
          </p>
        </div>
      </div>

      {l.photos.length > 1 ? (
        <section className="wrap mt-4" aria-label="Property photos">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {l.photos.slice(1).map((p) => (
              <a
                key={p.src}
                href={p.src}
                target="_blank"
                rel="noopener"
                className="block overflow-hidden rounded transition-opacity hover:opacity-90"
              >
                <Photo
                  src={p.src}
                  alt={p.alt}
                  sizes="(min-width: 1024px) 300px, 50vw"
                  width={800}
                  height={533}
                  className="aspect-[3/2] w-full object-cover"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* the record */}
      <div className="wrap mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <section>
            <h2 className="t-sub">The property</h2>
            <p className="reading mt-4 text-fg">{l.summary}</p>
            {l.positioning && <p className="reading mt-4 italic text-fg-2">{l.positioning}</p>}
          </section>

          <section className="mt-12 grid gap-x-10 sm:grid-cols-2">
            <div>
              <Group title="The numbers">
                <Spec label="Sale price" value={l.salePrice ? usd(l.salePrice) : null} />
                <Spec label="Lease rate" value={l.leaseRate ? `$${l.leaseRate.toFixed(2)}/SF/yr` : null} />
                <Spec label="Lease basis" value={l.leaseBasis ? LEASE_BASIS_LABEL[l.leaseBasis] : null} />
                <Spec label="NOI" value={l.noi ? `${usd(l.noi)}/yr` : null} />
                <Spec label="Cap rate" value={l.capRate ? `${l.capRate}%` : null} />
                <Spec label="Price / SF" value={l.pricePerSF ? usd(l.pricePerSF) : null} />
              </Group>
              <Group title="The building">
                <Spec label="Building" value={l.buildingSF ? sf(l.buildingSF) : null} />
                <Spec label="Available" value={l.availableSF && l.availableSF !== l.buildingSF ? sf(l.availableSF) : null} />
                <Spec label="Land" value={l.landAcres ? acres(l.landAcres) : null} />
                <Spec label="Built" value={l.yearBuilt} />
                <Spec label="Renovated" value={l.yearRenovated} />
                <Spec label="Stories" value={l.stories} />
                <Spec label="Clear height" value={l.ceilingHeight} />
                <Spec label="Dock doors" value={l.dockDoors} />
                <Spec label="Drive-in doors" value={l.driveInDoors} />
                <Spec label="Power" value={l.power} />
                <Spec label="Parking" value={l.parkingSpaces ? `${l.parkingSpaces} spaces${l.parkingRatio ? ` · ${l.parkingRatio}` : ""}` : l.parkingRatio} />
                <Spec label="Divisible" value={l.divisible ? `Yes${l.minDivisibleSF ? `, from ${sf(l.minDivisibleSF)}` : ""}` : null} />
              </Group>
            </div>

            <div>
              {hasSite ? (
                <Group title="The site">
                  <Spec label="Zoning" value={l.zoning} />
                  <Spec label="Frontage" value={l.frontageFt ? `${l.frontageFt} ft on ${l.frontageOn}` : l.frontageOn} />
                  <Spec label="Traffic" value={l.trafficCount ? `${aadt(l.trafficCount)} (${l.trafficCountYear})` : null} />
                  <Spec label="Ingress" value={l.ingress} />
                  <Spec label="Corner" value={l.corner ? "Yes" : null} />
                  <Spec label="Parcel" value={l.parcelId} />
                  {l.zoningNote && <p className="mt-3 text-sm leading-relaxed text-fg-3">{l.zoningNote}</p>}
                  {l.trafficCount && (
                    <p className="mt-2 text-xs leading-relaxed text-fg-3">Source: {l.trafficCountSource}.</p>
                  )}
                </Group>
              ) : null}

              {hasLogistics ? (
                <Group title="Logistics">
                  {(l.distances ?? []).map((d) => (
                    <Spec key={d.label} label={d.label} value={miles(d.miles)} />
                  ))}
                  {(l.driveTimes ?? []).map((d) => (
                    <Spec key={d.label} label={`${d.label} (drive)`} value={minutes(d.minutes)} />
                  ))}
                </Group>
              ) : null}

              {hasTenancy ? (
                <Group title="Tenancy">
                  <Spec label="Tenancy" value={l.tenancy ? l.tenancy.replace("-", " ") : null} />
                  <Spec label="Occupancy" value={l.occupancyPct !== undefined ? pct(l.occupancyPct) : null} />
                  {(l.tenants ?? []).map((t) => (
                    <Spec key={t.name} label={t.name} value={`${sf(t.sf)}${t.expires ? ` · to ${t.expires}` : ""}`} />
                  ))}
                  {l.neighboringTenants?.length ? (
                    <p className="mt-3 text-sm leading-relaxed text-fg-3">Nearby: {l.neighboringTenants.join(", ")}.</p>
                  ) : null}
                </Group>
              ) : null}
            </div>
          </section>

          {l.documents?.length ? (
            <section className="mt-12">
              <h3 className="eyebrow rule-strong pt-3">Documents</h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {l.documents.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      className="btn-outline px-4 py-2 text-sm"
                      onClick={() => record({ t: "doc_open", id: l.id, label: d.label })}
                    >
                      {d.label} ↓
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-12">
            <h3 className="eyebrow rule-strong pt-3">On the map</h3>
            <div className="mt-4">
              <Suspense fallback={<div className="h-[320px] rounded border border-line bg-ground-2" />}>
                <MiniMap
                  listings={[l]}
                  onOpen={() => navigate(`/explore?listing=${l.slug}`)}
                  view={{ lat: l.lat, lon: l.lon, zoom: 14.6 }}
                  heightClass="h-[320px]"
                />
              </Suspense>
            </div>
            <Link
              to={`/explore?listing=${l.slug}`}
              className="group flex items-baseline justify-between gap-4 border-b border-line py-4 text-fg hover:text-accent"
            >
              <span className="font-medium">See this property on the map →</span>
              <span className="text-sm text-fg-3">Ingress, neighboring rooftops, and the drive to I-95. Measured, not just described.</span>
            </Link>
          </section>

          <p className="mt-10 text-xs leading-relaxed text-fg-3">
            Listed by {l.listingAgent ?? SITE.name}, {SITE.brokerage}.{l.mlsNumber ? ` MLS #${l.mlsNumber}.` : ""}
            {l.listedAt ? ` Listed ${l.listedAt}.` : ""} All information deemed reliable but not guaranteed; verify
            independently.
          </p>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-24">
            <h2 className="t-sub">Ask about this property</h2>
            <div className="mt-4">
              <LeadForm context={{ listing: `${l.address}, ${l.city} (${l.slug})` }} />
            </div>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="wrap section">
          <p className="eyebrow mb-4">More listings</p>
          <ListingLedger compact listings={others} />
        </section>
      )}
    </article>
  );
}
