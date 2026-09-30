"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

const FALLBACK_DELAY_MS = 220;

function readTransitionDelay() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--transition-slow")
    .trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return FALLBACK_DELAY_MS;
  return raw.endsWith("ms") ? value : value * 1000;
}

export function TransitionLink({ href, className, children }: Props) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // let ctrl/cmd/shift-click and middle-click behave normally
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    document.querySelector(".landing")?.classList.add("landing-leaving");
    window.setTimeout(() => router.push(href), readTransitionDelay());
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}