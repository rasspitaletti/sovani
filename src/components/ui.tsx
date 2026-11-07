"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef, type ReactNode, type PointerEvent } from "react";
import type { Media } from "@/content/site";

export function Picture({ media, sizes, priority, eager, className = "" }: { media: Media; sizes: string; priority?: boolean; eager?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-clip bg-surface ${className}`}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : eager ? "eager" : "lazy"} className="object-cover" />
    </div>
  );
}

// Magnetic pull only on fine pointers; everyone else gets a plain, working control.
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.current!.getBoundingClientRect();
    el.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
  };
  const leave = () => { el.current!.style.transform = ""; };
  return <span ref={el} onPointerMove={move} onPointerLeave={leave} className={`magnetic ${className}`}>{children}</span>;
}

export function Btn({ href, children, variant = "glass", external, onClick }: { href: string; children: ReactNode; variant?: "solid" | "glass"; external?: boolean; onClick?: () => void }) {
  return (
    <Magnetic>
      <a href={href} onClick={onClick} data-cursor="Go" className={`btn btn-${variant}`} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        <span className="btn-roll" data-text={String(children)}><span>{children}</span></span>
        {external && <ArrowUpRight size={16} aria-hidden="true" />}
        {external && <span className="sr-only"> (opens the official Soneva site)</span>}
      </a>
    </Magnetic>
  );
}

export const scrollToHash = (hash: string) => {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(target, { duration: 1.5 });
  else target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  target.focus({ preventScroll: true });
};
