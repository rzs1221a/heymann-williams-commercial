import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BRAND, NAV, SITE, telHref, mailHref } from "../lib/site";
import { SAMPLE_DATA } from "../lib/listingsSource";
import { markets } from "../lib/markets";

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function SampleNotice() {
  if (!SAMPLE_DATA) return null;
  return (
    <div className="bg-cabernet px-4 py-1.5 text-center text-xs text-paper">
      Preview build. Sample inventory shown while live listings load.
    </div>
  );
}

const MARK = {
  name: { file: "hw-name-lockup", width: 875, height: 195, alt: "Berkshire Hathaway HomeServices Heymann Williams Realty" },
  full: { file: "hw-commercial-lockup", width: 875, height: 302, alt: "Berkshire Hathaway HomeServices Heymann Williams Realty — Commercial Division" },
} as const;

function Wordmark({
  variant,
  mark = "full",
  className = "",
  imgClassName = "h-9",
}: {
  variant: "cream" | "cab" | "black";
  mark?: keyof typeof MARK;
  className?: string;
  imgClassName?: string;
}) {
  const m = MARK[mark];
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label={`${BRAND} — ${SITE.name}, home`}>
      <img
        src={`/brand/${m.file}-${variant}.svg`}
        alt={m.alt}
        width={m.width}
        height={m.height}
        className={`w-auto ${imgClassName}`}
      />
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const close = () => setOpen(false);
  // the home hero is ink; the bar sits on it until the page scrolls
  const onInk = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        onInk ? "on-ink bg-ground text-fg" : "on-paper bg-ground text-fg border-b border-line"
      }`}
    >
      <SampleNotice />
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Wordmark variant={onInk ? "cream" : "cab"} mark="name" imgClassName="h-11" />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `border-b-2 pb-0.5 text-sm transition-colors ${
                  isActive ? "border-accent text-fg" : "border-transparent text-fg-2 hover:text-fg"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={telHref} className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
            {SITE.phone}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="btn-outline h-9 w-9 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line md:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={close}
              className="wrap block border-b border-line py-3.5 text-base text-fg hover:bg-ground-2"
            >
              {n.label}
            </NavLink>
          ))}
          <div className="wrap py-4">
            <a href={telHref} onClick={close} className="btn-primary w-full px-4 py-3 text-base">
              Call {SITE.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="on-ink-deep bg-ground text-fg">
      <div className="wrap section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <Wordmark variant="cream" mark="full" imgClassName="h-12" />
            <p className="mt-6 text-sm text-fg-2">
              {SITE.name} · {SITE.title}
              <br />
              {SITE.brokerage}
            </p>
            <p className="mt-4 text-sm">
              <a href={telHref} className="text-fg hover:text-accent">
                {SITE.phone}
              </a>
              <br />
              <a href={mailHref} className="text-fg-2 hover:text-fg">
                {SITE.email}
              </a>
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">Markets</p>
            <ul className="space-y-2 text-sm text-fg-2">
              {markets.map((m) => (
                <li key={m.slug}>
                  <Link to={`/${m.slug}`} className="hover:text-fg">
                    {m.name} commercial real estate
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">Office</p>
            <p className="text-sm text-fg-2">
              {SITE.officeAddress}
              <br />
              Office {SITE.officePhone}
            </p>
            <p className="mt-4 text-sm text-fg-2">
              <a href={SITE.mlsFeedPage} rel="noopener" className="hover:text-fg">
                All of Antoinette's MLS listings ↗
              </a>
              <br />
              <a href={SITE.commercialSearch} rel="noopener" className="hover:text-fg">
                Search all BHHS commercial listings ↗
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-fg-3">
          <p>
            {SITE.name}
            {SITE.licenseConfirmed ? `, ${SITE.licenseNumber}` : ""}. {SITE.brokerage}, {SITE.officeAddress},{" "}
            {SITE.officePhone}.
          </p>
          <p className="mt-2">{SITE.franchiseDisclosure}</p>
          <p className="mt-2">
            Property information is provided by the listing agent and deemed reliable but not guaranteed; buyers and
            tenants should verify all figures, including square footage, zoning, and traffic counts, independently.
            Traffic counts cite FDOT published AADT with station and year where shown.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <div className="on-paper min-h-screen bg-ground text-fg">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
