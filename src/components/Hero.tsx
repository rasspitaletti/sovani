"use client";

import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fmtHour, HOURS, nameOfHour } from "@/lib/sky";
import { lagoon, noonuHourNow, paintAccent, setHour } from "@/lib/store";
import { Btn } from "./ui";

const LagoonCanvas = dynamic(() => import("./LagoonCanvas"), { ssr: false });
const hasWebgl = () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } };

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);
  const [hour, setH] = useState(17.3);
  const [now, setNow] = useState<number | null>(null);

  const change = (h: number) => { setH(h); setHour(h); paintAccent(h); };

  useEffect(() => {
    setNow(noonuHourNow()); paintAccent(17.3);
    // The shader compiles after the opening has played, so it can never hold the first frames back.
    const t = setTimeout(() => setGl(hasWebgl()), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) { lagoon.open = 1; return; }
      // The DOM opening runs in CSS (see .roof), on the clock, whatever the main thread is doing. The 3D beams follow it.
      gsap.to(lagoon, { open: 1, duration: 2.6, ease: "power3.inOut", delay: 1.5 });

      // Scroll: out from under the roof, up, and down onto the lagoon.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true, onUpdate: (s) => { lagoon.scroll = s.progress; } } })
        .to(".hero-copy", { yPercent: -16, autoAlpha: 0, ease: "none", duration: 0.32 }, 0)
        .to(".hero-dial, .hero-cta, .scroll-cue", { autoAlpha: 0, ease: "none", duration: 0.16 }, 0.03)
        .fromTo(".hero-second", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.14 }, 0.42)
        .to(".hero-second", { autoAlpha: 0, y: -24, ease: "none", duration: 0.12 }, 0.72)
        .to(".hero-fade", { opacity: 1, ease: "none", duration: 0.1 }, 0.9);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="home" tabIndex={-1} aria-labelledby="hero-title" className="relative h-[300svh] outline-none">
      <div className="sticky top-0 h-svh overflow-clip bg-black">
        <Image src="/media/hero-golden.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        {gl && <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}><LagoonCanvas onReady={() => setReady(true)} /></div>}
        <div className="hero-scrim absolute inset-0" />
        <div className="hero-fade pointer-events-none absolute inset-0 bg-bg opacity-0" />

        <div className="hero-copy absolute inset-x-[var(--margin)] top-[15svh] flex flex-col items-center text-center lg:top-[13svh]">
          <h1 id="hero-title" className="display-hero">
            <span className="hero-line"><span style={{ animationDelay: ".55s" }}>Beyond</span></span>{" "}
            <span className="hero-line"><span style={{ animationDelay: ".65s" }}>Paradise.</span></span>
          </h1>
          <p className="hero-after mt-5 text-[length:var(--step-sub)] font-display leading-tight">An extraordinary escape beyond the horizon.</p>
          <p className="hero-after mt-2 text-[length:var(--step-small)]">Soneva Jani, Noonu Atoll, Maldives</p>
        </div>

        <div className="hero-after hero-cta absolute inset-x-[var(--margin)] bottom-[calc(var(--margin)+8.4rem)] sm:bottom-[calc(var(--margin)+8.6rem)] flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:bottom-9 lg:right-[calc(var(--margin)+6rem)] lg:justify-end xl:right-[var(--margin)] xl:justify-center">
          <Btn href="#experience" variant="solid">Explore the Experience</Btn>
          <Btn href="#villas">Discover Our Villas</Btn>
        </div>

        <p className="hero-second absolute inset-x-[var(--margin)] top-[38svh] mx-auto max-w-[20ch] text-center font-display text-[length:var(--step-head)] leading-[1.02] opacity-0" aria-hidden="true">
          Over the water, the roof rolls back.
        </p>

        <div className="hero-dial hero-after glass absolute left-[var(--margin)] right-[var(--margin)] bottom-[var(--margin)] p-3 sm:right-auto sm:w-[24rem] lg:bottom-8">
          <label htmlFor="hour" className="flex items-baseline justify-between gap-3 text-[length:var(--step-small)]">
            <span className="whitespace-nowrap">Set the hour</span>
            <output htmlFor="hour" className="whitespace-nowrap font-medium tabular-nums">{nameOfHour(hour)}, {fmtHour(hour)}</output>
          </label>
          <input id="hour" type="range" min={5} max={23.5} step={0.05} value={hour} data-cursor="Drag" onChange={(e) => change(Number(e.target.value))} className="hour-range mt-2 w-full" aria-valuetext={`${nameOfHour(hour)}, ${fmtHour(hour)}`} />
          <div className="mt-1 flex items-center justify-between gap-2 text-[length:var(--step-small)]">
            <button type="button" onClick={() => change(HOURS[(HOURS.findIndex((x) => x.h > hour) + HOURS.length) % HOURS.length].h)} className="underline underline-offset-4">Next light</button>
            {now !== null && <button type="button" onClick={() => change(Math.min(23.5, Math.max(5, now)))} className="underline underline-offset-4">Now in Noonu, {fmtHour(now)}</button>}
          </div>
        </div>

        <a href="#experience" aria-label="Scroll to the experience" className="hero-after scroll-cue absolute bottom-9 right-[var(--margin)] hidden items-center gap-2 text-[length:var(--step-small)] lg:flex">
          Scroll <ChevronDown size={16} aria-hidden="true" />
        </a>

        
        {/* The closed roof, opened by CSS in the first second and a half. */}
        <div className="roof absolute inset-0 z-10 flex flex-col" aria-hidden="true">
          {[...Array(9)].map((_, i) => <div key={i} className="roof-slat flex-1" style={{ animationDelay: `${0.25 + Math.abs(i - 4) * 0.06}s` }} />)}
        </div>
      </div>
    </section>
  );
}
