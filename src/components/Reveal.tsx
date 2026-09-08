import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useReveal } from "../lib/useReveal";

type Props<T extends ElementType> = { as?: T } & Omit<ComponentPropsWithoutRef<T>, "as">;

/** A block that fades up once, the first time it scrolls into view. */
export default function Reveal<T extends ElementType = "div">({ as, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useReveal<HTMLElement>();
  return <Tag ref={ref} {...rest} />;
}
