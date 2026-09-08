import { Link } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import Reveal from "../components/Reveal";
import { BRAND, SITE } from "../lib/site";
import { useCanonical, useDocumentTitle } from "../lib/seo";

const SERVICES = [
  {
    key: "tenant-rep",
    name: "Tenant representation",
    lead: "Finding the right space costs less than settling for the wrong one.",
    body: "Requirement definition, corridor and co-tenancy analysis, tour management, and lease negotiation on your side of the table: rate, basis, TI, options, and the clauses that matter down the road. Much of this county's inventory never lists publicly, so representation is access.",
  },
  {
    key: "landlord-rep",
    name: "Landlord representation",
    lead: "Vacancy is the most expensive line on the statement.",
    body: "Positioning, pricing against real corridor comps, marketing through both MLSs and the Berkshire network, tenant screening, and lease structuring that protects the asset: basis, escalations, and renewals built with the exit in mind, not just the signing.",
  },
  {
    key: "investment-sales",
    name: "Investment sales",
    lead: "Small-market assets deserve institutional-grade underwriting.",
    body: "NOI reconstruction, cap-rate and per-foot positioning against what has actually traded in Nassau County, quiet marketing to qualified buyers, and management of diligence through close. For buyers: sourcing on and off market, including 1031 timelines.",
  },
  {
    key: "leasing",
    name: "Commercial leasing",
    lead: "The lease is the asset.",
    body: "Full-cycle leasing for owners and operators: NNN, modified gross, and full-service structures, renewals, expansions, and the documentation discipline that keeps a small portfolio financeable.",
  },
  {
    key: "site-selection",
    name: "Site selection & land",
    lead: "Corridor position decides more than the building does.",
    body: "Traffic counts with FDOT citations, ingress and median analysis, zoning and future land use reads, utility due diligence, and entitlement navigation across Fernandina Beach, Yulee, and the county's western corridors.",
  },
];

export default function Services() {
  useDocumentTitle(
    `Commercial Services · Tenant Rep, Landlord Rep, Investment Sales · ${BRAND}`,
    "Tenant representation, landlord representation, investment sales, leasing, and site selection across Nassau County, Florida."
  );
  useCanonical("/services");
  return (
    <>
      <section className="wrap section">
        <p className="eyebrow">Services</p>
        <h1 className="t-page mt-4 max-w-3xl">One commercial practice, both sides of every table.</h1>
        <p className="reading-lg mt-6 max-w-2xl text-fg-2">
          {SITE.name} runs the dedicated commercial desk at {SITE.brokerageShort}. This is the whole
          job, not a sideline to residential.
        </p>

        <ol className="rule-strong mt-14">
          {SERVICES.map((s, i) => (
            <li key={s.key} className="grid gap-4 border-b border-line py-8 lg:grid-cols-12 lg:gap-x-6">
              <div className="lg:col-span-4">
                <span className="num text-sm text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="t-sub mt-2">{s.name}</h2>
              </div>
              <div className="lg:col-span-8">
                <p className="reading-lg italic text-fg">{s.lead}</p>
                <p className="reading mt-4 max-w-2xl text-fg-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Reveal as="section" className="on-ink bg-ground text-fg">
        <div className="wrap section grid gap-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <h2 className="t-section">Not sure which you need?</h2>
            <p className="reading mt-4 max-w-xl text-fg-2">
              Most engagements start with a short call about the requirement, or the property. Start
              there.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Link to="/contact" className="btn-primary px-6 py-3 text-sm">
              Talk to Antoinette
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-x-6" id="engage">
        <div className="lg:col-span-4">
          <p className="eyebrow">Engage</p>
          <h2 className="t-section mt-3">Put the requirement in writing.</h2>
        </div>
        <div className="lg:col-span-8">
          <LeadForm />
        </div>
      </Reveal>
    </>
  );
}
