"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { scrollToHash } from "./ui";

gsap.registerPlugin(ScrollTrigger);

// Smooth scroll, anchor handling and every declarative scroll animation:
// [data-rise] rises once, [data-mask] opens from a clip, [data-fill] inks word by word, [data-drift] parallaxes.
export function Choreo() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(pointer: coarse)").matches;
    let lenis: Lenis | undefined;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduce && !touch) {
      lenis = new Lenis({ lerp: 0.12 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      scrollToHash(a.getAttribute("href")!);
    };
    document.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, { y: 26, autoAlpha: 0, duration: 0.85, ease: "expo.out", delay: Number(el.dataset.rise || 0) * 0.08, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(14% 8% 14% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        const img = el.querySelector("img");
        if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const v = Number(el.dataset.drift || 6);
        gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-fill]").forEach((el) => {
        const words = el.textContent!.trim().split(/\s+/);
        el.setAttribute("aria-label", el.textContent!.trim());
        el.innerHTML = words.map((w) => `<span aria-hidden="true" style="display:inline-block">${w}</span>`).join(" ");
        gsap.fromTo(el.children, { opacity: 0.45 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: true } });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      ctx.revert();
      document.removeEventListener("click", onClick);
      removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}

// A dot and a ring on desktop; the ring names what a click will do. Off on touch and under reduced motion.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(ring.current!, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(ring.current!, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      gsap.set(dot.current!, { x: e.clientX, y: e.clientY, autoAlpha: 1 });
      x(e.clientX); y(e.clientY);
      const t = (e.target as Element).closest?.<HTMLElement>("a,button,input,[data-cursor]");
      setLabel(t?.dataset.cursor ?? "");
      ring.current!.dataset.active = t ? "1" : "0";
    };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, []);

  return (
    <div aria-hidden="true" style={{ display: on ? undefined : "none" }}>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring"><span>{label}</span></div>
    </div>
  );
}
