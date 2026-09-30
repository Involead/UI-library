"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function TransitionLink({ href, className, children }: Props) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // let ctrl/cmd/shift-click and middle-click behave normally
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    document.querySelector(".landing")?.classList.add("landing-leaving");
    window.setTimeout(() => router.push(href), 220);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
