"use client";

import type { ComponentProps } from "react";
import { BRIEF_EVENT, type BriefType } from "@/content/brief";
import { TransitionLink } from "@/components/transition-link";

/**
 * A link that opens the contact brief with a type already chosen (or the
 * hiring door, with `brief="hiring"`). On the home page it glides to
 * #contact and fires the `brief:open` event; from any other page the
 * `?brief=` param carries the choice through the navigation.
 */
export function BriefLink({
  brief,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof TransitionLink>, "href"> & {
  brief: BriefType | "hiring";
}) {
  return (
    <TransitionLink
      href={`/?brief=${brief}#contact`}
      onClick={(e) => {
        onClick?.(e);
        window.dispatchEvent(new CustomEvent(BRIEF_EVENT, { detail: brief }));
      }}
      {...rest}
    />
  );
}
