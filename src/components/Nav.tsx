"use client";

import { ArrowUp, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { links, nav } from "@/content/site";
import { Btn, Magnetic, scrollToHash } from "./ui";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(false);
  const bar = useRef<SVGCircleElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      if (bar.current) bar.current.style.strokeDashoffset = String(100 - p * 100);
      setPast(scrollY > innerHeight * 0.8);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  // Menu behaves as a dialog: page frozen, Escape closes, focus stays inside and returns to the toggle.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("a,button")];
      const first = toggle.current!, last = f.at(-1)!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", key);
    const btn = toggle.current;
    return () => {
      removeEventListener("keydown", key);
      lenis?.start();
      document.documentElement.style.overflow = "";
      btn?.focus();
    };
  }, [open]);

  const go = (href: string) => { setOpen(false); setTimeout(() => scrollToHash(href), 420); };

  return (
    <>
      <a href="#experience" className="skip">Skip to content</a>
      <header data-past={past} className="head-bar fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--margin)] py-4">
        <a href="#home" className="leading-tight" data-cursor="Top">
          <span className="wordmark block text-[1.375rem]">Soneva Jani</span>
          <span className="block text-[0.8125rem]">Independent concept, not affiliated</span>
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.slice(1, -1).map((n) => <a key={n.href} href={n.href} className="navlink">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden lg:block"><Btn href="#book" variant="solid">Book Your Stay</Btn></span>
          <Magnetic>
            <button ref={toggle} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} className="iconbtn relative z-[70]">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle ref={bar} cx="18" cy="18" r="15.9" fill="none" stroke="var(--glow)" strokeWidth="1.2" pathLength="100" strokeDasharray="100" strokeDashoffset="100" />
              </svg>
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </Magnetic>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel} id="menu" role="dialog" aria-modal="true" aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="glass-deep fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto px-[var(--margin)] pb-8 pt-24"
          >
            <ul className="flex flex-col">
              {nav.map((n, i) => (
                <li key={n.href} className="overflow-clip">
                  <motion.a
                    href={n.href} onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(n.href); }}
                    initial={{ y: "105%" }} animate={{ y: 0 }} exit={{ y: "105%" }}
                    transition={{ duration: 0.8, delay: 0.14 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="menu-link"
                  >{n.label}</motion.a>
                </li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap justify-between gap-4 text-[length:var(--step-small)] text-muted">
              <span>Noonu Atoll, Maldives</span>
              <a href={links.resort} target="_blank" rel="noreferrer" className="underline underline-offset-4">The official Soneva Jani site</a>
              <span>Independent concept, not affiliated with Soneva</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {past && !open && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-5 right-[var(--margin)] z-40">
            <Magnetic><a href="#home" aria-label="Back to top" className="iconbtn" data-cursor="Top"><ArrowUp size={18} aria-hidden="true" /></a></Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
