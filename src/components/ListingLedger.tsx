import { Link } from "react-router-dom";
import Photo from "./Photo";
import {
  priceLine,
  sizeLine,
  STATUS_LABEL,
  USE_TYPE_LABEL,
  type CommercialListing,
} from "../lib/commercial";

/**
 * The inventory as a ledger. Seven listings don't need a search or a card
 * grid — they need a ruled table a commercial reader can scan in one pass:
 * property, price, size, use, city. Every row is the whole record's link.
 */
export default function ListingLedger({
  listings,
  compact = false,
}: {
  listings: CommercialListing[];
  compact?: boolean;
}) {
  return (
    <div className="rule-strong">
      {!compact && (
        <div className="ledger-head hidden lg:grid" aria-hidden>
          <span className="eyebrow col-span-2">Property</span>
          <span className="eyebrow text-right">Price</span>
          <span className="eyebrow text-right">Size</span>
          <span className="eyebrow">Use · City</span>
          <span />
        </div>
      )}
      {listings.map((l) => {
        const hero = l.photos[0];
        const status = l.status !== "available" ? STATUS_LABEL[l.status] : null;
        return (
          <Link key={l.id} to={`/listings/${l.slug}`} className="ledger-row group">
            <Photo
              src={hero?.src}
              alt={hero?.alt ?? l.headline}
              sizes="96px"
              width={96}
              height={64}
              className="aspect-[3/2] w-full rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-fg">{l.address}</p>
              {!compact && <p className="reading truncate text-[0.9375rem] text-fg-2">{l.headline}</p>}
              <p className="num mt-0.5 text-sm text-fg-2 lg:hidden">
                <span className="font-medium text-fg">{priceLine(l)}</span> · {sizeLine(l)} · {USE_TYPE_LABEL[l.useType]} ·{" "}
                {l.city}
                {status ? ` · ${status}` : ""}
              </p>
            </div>
            <p className="figure hidden text-right text-fg lg:block">{priceLine(l)}</p>
            <p className="num hidden text-right text-sm text-fg-2 lg:block">{sizeLine(l)}</p>
            <p className="hidden text-sm text-fg-2 lg:block">
              {USE_TYPE_LABEL[l.useType]} · {l.city}
              {status ? (
                <>
                  <br />
                  <span className="text-accent">{status}</span>
                </>
              ) : null}
            </p>
            <span className="hidden text-fg-3 transition-colors group-hover:text-accent lg:block" aria-hidden>
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
