import { Link } from "react-router-dom";
import ListingLedger from "../components/ListingLedger";
import LeadForm from "../components/LeadForm";
import Photo from "../components/Photo";
import Reveal from "../components/Reveal";
import { availableListings } from "../lib/listingsSource";
import { markets } from "../lib/markets";
import { BRAND, SITE, telHref, mailHref } from "../lib/site";
import { useCanonical, useDocumentTitle } from "../lib/seo";

const WHY = [
  {
    eyebrow: "Networks",
    head: "Two MLS networks.",
    body: "Member of realMLS and AINCAR, so every listing reaches both the mainland and the island.",
  },
  {
    eyebrow: "Practice",
    head: "Commercial only.",
    body: "The firm's dedicated commercial desk, not a residential sideline. Zoning, lease structures, cap rates, and corridor data, every day.",
  },
  {
    eyebrow: "Brokerage",
    head: "Berkshire behind it.",
    body: `${SITE.brokerageShort}, locally owned with the reach of the Berkshire Hathaway HomeServices network.`,
  },
];

export default function Home() {
  useDocumentTitle(
    `${BRAND} · Nassau County Commercial Real Estate · Antoinette Ferry`,
    "Commercial sales and leasing across Nassau County, Florida, including Fernandina Beach, Amelia Island, Yulee, and Callahan."
  );
  useCanonical("/");
  const listings = availableListings();
  const submarkets = markets.filter((m) => m.slug !== "nassau-county-commercial-real-estate");

  return (
    <>
      {/* the hero: the mark, centered, standing in for a headline — on ink */}
      <section className="on-ink bg-ground text-fg">
        <div className="wrap section flex flex-col items-center text-center">
          <p className="eyebrow">Nassau County · Florida</p>
          <h1 className="mt-8 flex flex-col items-center">
            <img
              src="/brand/hw-name-lockup-cream.svg"
              alt="Commercial real estate, from the port to the interstate. Berkshire Hathaway HomeServices Heymann Williams Realty"
              width={875}
              height={195}
              className="h-16 w-auto sm:h-24 lg:h-28"
            />
            <img
              src="/brand/hw-mark-lockup-cream.svg"
              alt=""
              width={701}
              height={106}
              className="mt-2 h-[35px] w-auto sm:mt-3 sm:h-[52px] lg:h-[61px]"
            />
          </h1>
          <p className="reading-lg mt-8 max-w-2xl text-fg-2">
            {SITE.name} is {SITE.title} at {SITE.brokerageShort}, the county's dedicated commercial
            practice. She handles sales, leasing, and tenant and landlord representation across
            Fernandina Beach, Amelia Island, Yulee, and Callahan.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={SITE.mlsFeedPage} rel="noopener" className="btn-primary px-6 py-3 text-sm">
              View all my listings ↗
            </a>
            <Link to="/listings" className="btn-outline px-6 py-3 text-sm">
              Current listings
            </Link>
            <a href={telHref} className="btn-outline px-6 py-3 text-sm">
              Call {SITE.phone}
            </a>
          </div>
          {SITE.portrait && (
            <div className="mt-14 flex items-center gap-4">
              <Photo
                src={SITE.portrait}
                alt={SITE.name}
                widths={[320, 640]}
                sizes="80px"
                loading="eager"
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded object-cover shadow-[0_24px_48px_-28px_rgb(0_0_0/0.6)]"
              />
              <div className="text-left text-sm leading-snug">
                <p className="font-medium text-fg">{SITE.name}</p>
                <p className="mt-1 text-fg-3">{SITE.title}</p>
                <a href={mailHref} className="mt-2 block text-accent hover:text-fg">
                  {SITE.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* the inventory — every listing, as a ledger */}
      <Reveal as="section" className="wrap section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Current inventory</p>
            <h2 className="t-section mt-3">Every listing, in full.</h2>
          </div>
          <a href={SITE.mlsFeedPage} rel="noopener" className="text-sm text-accent hover:text-fg">
            All listings on the MLS →
          </a>
        </div>
        <ListingLedger listings={listings} />
        <p className="reading mt-8 max-w-2xl text-fg-2">
          Every property page already has the traffic counts, frontage, zoning, and drive times a
          site selector needs. Then{" "}
          <Link to="/explore" className="text-accent hover:text-fg">
            see it on the map
          </Link>
          .
        </p>
      </Reveal>

      {/* the markets — an editorial index, not tiles */}
      <Reveal as="section" className="wrap">
        <div className="rule-strong section grid gap-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow">The submarkets</p>
              <h2 className="t-section mt-3">One county, four commercial markets.</h2>
              <Link
                to="/nassau-county-commercial-real-estate"
                className="mt-6 inline-block text-sm text-accent hover:text-fg"
              >
                Read the county overview →
              </Link>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {submarkets.map((m, i) => (
              <li key={m.slug} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6 first:border-t first:border-line">
                <span className="num pt-1 text-sm text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <Link to={`/${m.slug}`} className="t-sub text-fg hover:text-accent">
                    {m.name}
                  </Link>
                  <p className="reading mt-2 text-fg-2">{m.tagline}</p>
                  <p className="mt-3 text-xs text-fg-3">{m.corridors.slice(0, 3).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* why her — a ruled triptych on ink */}
      <Reveal as="section" className="on-ink bg-ground text-fg">
        <div className="wrap section">
          <div className="grid sm:grid-cols-3">
            {WHY.map((w, i) => (
              <div
                key={w.eyebrow}
                className={`border-t border-line py-8 sm:pr-8 ${i > 0 ? "sm:border-l sm:pl-8" : ""}`}
              >
                <p className="eyebrow">{w.eyebrow}</p>
                <h2 className="t-section mt-3">{w.head}</h2>
                <p className="reading mt-4 text-fg-2">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* the close */}
      <Reveal as="section" className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-x-6" id="contact">
        <div className="lg:col-span-5">
          <p className="eyebrow">Start here</p>
          <h2 className="t-section mt-3">Tell her what you're looking for.</h2>
          <p className="reading mt-4 max-w-md text-fg-2">
            Five fields, one conversation. Requirements stay confidential.
          </p>
          <p className="mt-6 text-sm text-fg-2">
            <a href={telHref} className="text-fg hover:text-accent">
              {SITE.phone}
            </a>
            <br />
            <a href={mailHref} className="hover:text-fg">
              {SITE.email}
            </a>
          </p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm />
        </div>
      </Reveal>
    </>
  );
}
