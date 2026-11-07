"use client";

import { gsap } from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { day, destination, discover, facts, gallery, inclusions, links, media, nav, plan, socials, stewardship, villas, type Media, type Villa } from "@/content/site";
import { paintAccent } from "@/lib/store";
import { Btn, Picture } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;

/* 02 THE EXPERIENCE */
export function Experience() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) {
        const i = refs.current.indexOf(e.target as HTMLLIElement);
        setActive(i);
        paintAccent(day[i].hour);
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" tabIndex={-1} className="outline-none">
      <div className="grid-page items-start pt-[clamp(3rem,6vw,6rem)]">
        <p data-fill className="order-1 col-span-12 text-[clamp(1.5rem,2.5vw,2.25rem)] font-display leading-[1.18] lg:order-2 lg:col-span-7 lg:col-start-6">
          Soneva Jani is on Medhufaru, 150 acres of island in a private archipelago of five islets. Over the water, roofs roll back to the sky and slides run straight into the lagoon.
        </p>
        <div data-mask className="order-2 col-span-12 mt-8 lg:order-1 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0"><Picture media={media.roof} sizes="(min-width:1024px) 33vw, 100vw" className="aspect-[4/3]" /></div>
      </div>
      <dl className="grid-page mt-[clamp(3rem,6vw,5rem)] gap-y-6">
        {facts.map(([big, small], i) => (
          <div key={big} data-rise={i} className="col-span-6 lg:col-span-3">
            <dt className="font-display text-[length:var(--step-sub)] leading-tight">{big}</dt>
            <dd className="mt-1 max-w-[24ch] text-[length:var(--step-small)]">{small}</dd>
          </div>
        ))}
      </dl>
      <div className="grid-page mt-[clamp(4rem,8vw,7rem)]"><h2 data-rise className="col-span-12 display-sec">A day set by the light</h2></div>
      <div className="grid-page mt-6 items-start">
        <div className="sticky top-[68px] col-span-12 z-[3] bg-bg pb-3 lg:top-[14svh] lg:col-span-7 lg:bg-transparent lg:pb-0">
          <div className="relative aspect-[16/10] overflow-clip bg-surface lg:aspect-[16/11]">
            {day.map((d, i) => (
              <div key={d.when} className="absolute inset-0 transition-opacity duration-[1100ms]" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
                <Picture media={d.image} eager sizes="(min-width:1024px) 58vw, 100vw" className="h-full w-full" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[length:var(--step-small)] text-muted" aria-live="polite">{active + 1} of {day.length}: {day[active].when}</p>
        </div>
        <ol className="col-span-12 relative z-[2] lg:col-span-4 lg:col-start-9">
          {day.map((d, i) => (
            <li key={d.when} ref={(el) => { refs.current[i] = el; }} className="flex min-h-[34svh] flex-col justify-center transition-opacity duration-500 lg:min-h-[62svh]" style={{ opacity: i === active ? 1 : 0.45 }}>
              <h3 className="font-display text-[length:var(--step-sub)] leading-tight">{d.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[length:var(--step-body)]">{d.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 03 EXTRAORDINARY VILLAS */
const fmtArea = (n: number) => `${n.toLocaleString("en-GB")} m²`;
const FILTERS = [["all", "All 10"], ["water", "Over water"], ["island", "On the beach"], ["signature", "Signature"]] as const;
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function Villas() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = useMemo(() => villas.filter((v) => filter === "all" || (filter === "signature" ? v.signature : v.kind === filter)), [filter]);
  const [open, setOpen] = useState<Villa | null>(null);

  return (
    <section id="villas" tabIndex={-1} className="section outline-none">
      <div className="grid-page items-end">
        <h2 data-rise className="col-span-12 display-sec lg:col-span-7">Extraordinary villas</h2>
        <div data-rise="1" role="group" aria-label="Filter villas" className="col-span-12 mt-6 flex flex-wrap gap-2 lg:col-span-5 lg:mt-0 lg:justify-end">
          {FILTERS.map(([k, l]) => <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className="chip">{l}</button>)}
        </div>
      </div>

      <ul className="grid-page mt-[clamp(2.5rem,5vw,4.5rem)] gap-y-[clamp(2.5rem,5vw,4.5rem)]">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((v, i) => {
            const wide = SPANS[i % 4] === "lg:col-span-7";
            return (
              <motion.li key={v.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className={`villa-card col-span-12 ${SPANS[i % 4]}`}>
                <button type="button" data-cursor="Explore" onClick={() => setOpen(v)} aria-haspopup="dialog" className="block w-full text-left">
                  <Picture media={v.images[0]} sizes={wide ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 42vw, 100vw"} className="aspect-[3/2]" />
                  <span className="mt-4 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                    <span className="villa-name">{v.bedrooms} Bedroom {v.name.replace(" with Slide", "")}</span>
                    <span className="text-[length:var(--step-small)] text-muted">{fmtArea(v.area)}{v.note ? `, ${v.note}` : ""}</span>
                  </span>
                  <span className="mt-1 block max-w-[52ch]">{v.line}</span>
                  <span className="link-arrow mt-2">Explore this villa <ArrowUpRight size={16} aria-hidden="true" /></span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <div className="grid-page mt-[clamp(4rem,8vw,7rem)] items-start">
        <h3 data-rise className="col-span-12 head lg:col-span-5">With every villa</h3>
        <ul className="col-span-12 mt-6 lg:col-span-7 lg:mt-0">
          {inclusions.map((x, i) => <li key={x} data-rise={Math.min(i, 4)} className="py-1.5 font-display text-[length:var(--step-lead)] leading-snug">{x}</li>)}
        </ul>
      </div>

      <AnimatePresence>{open && <VillaSheet villa={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

// The floor area drawn to scale against a tennis court, so 1,796 m² means something.
function Scale({ area }: { area: number }) {
  const side = Math.sqrt(area / 1796) * 100, court = Math.sqrt(261 / 1796) * 100;
  return (
    <figure className="mt-5 flex items-end gap-4">
      <div className="relative aspect-square w-24 shrink-0">
        <div className="absolute bottom-0 left-0 bg-[var(--glow)]" style={{ width: `${side}%`, height: `${side}%` }} />
        <div className="absolute bottom-0 left-0 bg-bg" style={{ width: `${court}%`, height: `${court}%` }} />
      </div>
      <figcaption className="max-w-[34ch] text-[length:var(--step-small)]">{fmtArea(area)} to scale. The dark square is a tennis court, 261 m².</figcaption>
    </figure>
  );
}

function VillaSheet({ villa, onClose }: { villa: Villa; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState(0);
  useDialog(box, close, onClose);
  return (
    <motion.div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="villa-title" ref={box}>
      <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div data-lenis-prevent initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }} className="glass-deep absolute inset-y-0 right-0 w-full overflow-y-auto p-[var(--margin)] lg:w-[62vw]">
        <div className="flex items-start justify-between gap-6">
          <h3 id="villa-title" className="head">{villa.bedrooms} Bedroom {villa.name}{villa.note ? ` (${villa.note})` : ""}</h3>
          <button ref={close} type="button" onClick={onClose} aria-label="Close villa details" className="iconbtn shrink-0"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="relative mt-5 aspect-[3/2] overflow-clip bg-surface">
          <AnimatePresence initial={false}>
            <motion.div key={shot} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <Image src={villa.images[shot].src} alt={villa.images[shot].alt} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" priority />
            </motion.div>
          </AnimatePresence>
        </div>
        <div role="group" aria-label="Villa photographs" className="mt-2 grid grid-cols-5 gap-2">
          {villa.images.map((m, i) => (
            <button key={m.src} type="button" aria-pressed={i === shot} aria-label={`Show photograph ${i + 1}: ${m.alt}`} onClick={() => setShot(i)} className="thumb relative aspect-[3/2] overflow-clip">
              <Image src={m.src} alt="" fill sizes="12vw" className="object-cover" />
            </button>
          ))}
        </div>
        <p className="mt-6 max-w-[46ch] text-[length:var(--step-lead)] font-display leading-snug">{villa.line}</p>
        {villa.detail && <p className="mt-3 max-w-[60ch]">{villa.detail}</p>}
        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <div><dt className="text-[length:var(--step-small)] text-muted">Where</dt><dd>{villa.kind === "water" ? "Over the water" : "On the beach"}</dd></div>
          <div><dt className="text-[length:var(--step-small)] text-muted">Bedrooms</dt><dd>{villa.bedrooms}</dd></div>
          <div><dt className="text-[length:var(--step-small)] text-muted">Size</dt><dd>{fmtArea(villa.area)}</dd></div>
          <div className="col-span-2 sm:col-span-1"><dt className="text-[length:var(--step-small)] text-muted">Sleeps</dt><dd>{villa.sleeps}</dd></div>
        </dl>
        <Scale area={villa.area} />
        <div className="mt-8 flex flex-wrap gap-3 pb-6">
          <Btn href={villa.url} variant="solid" external>View on Soneva</Btn>
          <Btn href={links.contact} external>Ask the resort</Btn>
        </div>
      </motion.div>
    </motion.div>
  );
}

function useDialog(box: React.RefObject<HTMLElement | null>, first: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    first.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !box.current) return;
      const f = [...box.current.querySelectorAll<HTMLElement>("a,button")];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1)!.focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    };
    addEventListener("keydown", key);
    return () => { removeEventListener("keydown", key); lenis?.start(); document.documentElement.style.overflow = ""; prev?.focus(); };
  }, [box, first, onClose]);
}

/* 04 DISCOVER PARADISE */
export function Discover() {
  return (
    <section id="experiences" tabIndex={-1} className="section outline-none">
      <div className="grid-page"><h2 data-rise className="col-span-12 display-sec">Discover paradise</h2></div>
      <div className="mt-[clamp(3rem,6vw,5rem)] flex flex-col gap-[clamp(5rem,10vw,9rem)]">
        {discover.map((d, c) => {
          const flip = c % 2 === 1;
          return (
            <article key={d.id} className="grid-page items-start">
              <div className={`col-span-12 lg:sticky lg:top-[14svh] lg:col-span-3 ${flip ? "lg:order-2 lg:col-start-10" : ""}`}>
                <h3 data-rise className="head">{d.title}</h3>
                <p data-rise="1" className="mt-3 max-w-[38ch]">{d.lead}</p>
                <ul className="mt-5 hidden lg:block">
                  {d.more.map(([n, w]) => <li key={n} className="py-1.5"><span className="block font-display text-[length:var(--step-lead)] leading-tight">{n}</span><span className="text-[length:var(--step-small)] text-muted">{w}</span></li>)}
                </ul>
                <a href={d.href} target="_blank" rel="noreferrer" className="link-arrow mt-4 hidden lg:inline-flex" data-cursor="Go">{d.cta} <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
              <ul className={`col-span-12 mt-7 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-8 lg:col-span-8 lg:mt-0 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-5"}`}>
                {d.tiles.map((t, i) => {
                  const big = i % 3 === 0;
                  return (
                    <li key={t.name} className={`xp-tile ${big ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
                      <div data-mask><Picture media={t.image} sizes={big ? "(min-width:1024px) 62vw, 100vw" : "(min-width:1024px) 31vw, 100vw"} className={big ? "aspect-[16/9]" : "aspect-[4/5]"} /></div>
                      <h4 className="mt-3 font-display text-[length:var(--step-lead)] leading-tight">{t.name}</h4>
                      <p className="text-[length:var(--step-small)] text-muted">{t.what}</p>
                    </li>
                  );
                })}
              </ul>
              <div className="col-span-12 mt-7 lg:hidden">
                <ul>{d.more.map(([n, w]) => <li key={n} className="py-1.5"><span className="block font-display text-[length:var(--step-lead)] leading-tight">{n}</span><span className="text-[length:var(--step-small)] text-muted">{w}</span></li>)}</ul>
                <a href={d.href} target="_blank" rel="noreferrer" className="link-arrow mt-4">{d.cta} <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* 05 IMMERSIVE GALLERY */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState<number | null>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - innerWidth;
      const tween = gsap.to(t, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: root.current!.querySelector(".g-stage"), scrub: true, invalidateOnRefresh: true } });
      gsap.utils.toArray<HTMLElement>(".g-item", t).forEach((el) => {
        const img = el.querySelector("img");
        if (img) gsap.fromTo(img, { xPercent: -6, scale: 1.14 }, { xPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo(el, { clipPath: "inset(10% 12% 10% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 100%", end: "left 62%", scrub: true } });
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  const n = gallery.length;
  return (
    <section ref={root} id="gallery" tabIndex={-1} className="section-top outline-none">
      <div className="g-stage flex min-h-svh flex-col justify-center gap-7 overflow-clip py-10">
        <h2 data-rise className="head px-[var(--margin)]">The lagoon, frame by frame</h2>
        <ul ref={track} className="g-track flex gap-4 px-[var(--margin)] will-change-transform">
          {gallery.map((m, i) => (
            <li key={m.src} className={`g-item shrink-0 overflow-clip ${i % 3 === 1 ? "g-tall" : "g-wide"}`}>
              <button type="button" data-cursor="Open" onClick={() => setAt(i)} className="group relative block h-full w-full overflow-clip" aria-label={`Open image ${i + 1} of ${n}: ${m.alt}`}>
                <motion.div layoutId={`g-${i}`} className="absolute inset-0">
                  <Image src={m.src} alt="" fill sizes="(min-width:900px) 50vw, 85vw" className="object-cover transition-[filter] duration-500 group-hover:brightness-115" />
                </motion.div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>{at !== null && <Lightbox at={at} setAt={setAt} items={gallery} />}</AnimatePresence>
    </section>
  );
}

function Lightbox({ at, setAt, items }: { at: number; setAt: (n: number | null) => void; items: Media[] }) {
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  const close = useRef(() => setAt(null));
  useDialog(box, first, close.current);
  const n = items.length;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setAt((at + 1) % n);
      if (e.key === "ArrowLeft") setAt((at - 1 + n) % n);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [at, n, setAt]);
  const m = items[at];
  return (
    <motion.div ref={box} role="dialog" aria-modal="true" aria-label={`Image ${at + 1} of ${n}`} className="fixed inset-0 z-[80] flex flex-col bg-black/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between gap-4 p-[var(--margin)] pb-3">
        <p className="text-[length:var(--step-small)]" aria-live="polite">{at + 1} of {n}: {m.alt}</p>
        <button ref={first} type="button" onClick={() => setAt(null)} aria-label="Close gallery" className="iconbtn shrink-0"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="relative mx-[var(--margin)] min-h-0 flex-1">
        <motion.div layoutId={`g-${at}`} className="absolute inset-0" transition={{ duration: 0.6, ease: EASE }}>
          <Image src={m.src} alt={m.alt} fill sizes="100vw" className="object-contain" />
        </motion.div>
      </div>
      <div className="flex justify-center gap-3 p-[var(--margin)] pt-3">
        <button type="button" className="iconbtn" aria-label="Previous image" onClick={() => setAt((at - 1 + n) % n)}><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" className="iconbtn" aria-label="Next image" onClick={() => setAt((at + 1) % n)}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
    </motion.div>
  );
}

/* 06 THE DESTINATION */
type Pt = [number, number];
type MapData = { coast: string[]; reef: string[]; points: { jani: Pt; male: Pt; maafaru: Pt } };

// Real outlines, memoised so that zooming only redraws the pins.
const Land = memo(function Land({ coast, reef }: { coast: string[]; reef: string[] }) {
  return (
    <>
      <path d={reef.join("")} fill="#1aa6a8" fillOpacity=".32" stroke="#59e0d0" strokeOpacity=".6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={coast.join("")} fill="#f3e6c9" stroke="#f3e6c9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </>
  );
});

export function Destination() {
  const svg = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<MapData | null>(null);
  const [failed, setFailed] = useState(false);
  const [stop, setStop] = useState(0);
  const [unit, setUnit] = useState(2); // map units per screen pixel; keeps pins and labels one size at any zoom
  const cur = destination.stops[stop];

  useEffect(() => {
    fetch("/map/maldives.json").then((r) => r.json()).then(setData).catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const sync = () => setUnit(el.viewBox.baseVal.width / (el.clientWidth || 1));
    const vb = cur.box.join(" ");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.setAttribute("viewBox", vb); sync(); return; }
    const t = gsap.to(el, { attr: { viewBox: vb }, duration: 1.9, ease: "power3.inOut", onUpdate: sync, onComplete: sync });
    addEventListener("resize", sync);
    return () => { t.kill(); removeEventListener("resize", sync); };
  }, [cur]);

  const u = unit;
  const pin = (at: Pt, label: string, accent: boolean, left = false) => (
    <g key={label}>
      <circle cx={at[0]} cy={at[1]} r={13 * u} fill="none" stroke={accent ? "var(--glow)" : "#f3e6c9"} strokeWidth={1.2 * u} />
      <circle cx={at[0]} cy={at[1]} r={5 * u} fill={accent ? "var(--glow)" : "#f3e6c9"} />
      <text x={at[0] + (left ? -20 : 20) * u} y={at[1] + 5 * u} textAnchor={left ? "end" : "start"} fontSize={14.5 * u} fill="#f4f1e8" stroke="#04121c" strokeWidth={3.5 * u} paintOrder="stroke" style={{ fontFamily: "var(--font-text)" }}>{label}</text>
    </g>
  );

  return (
    <section id="destination" tabIndex={-1} className="section outline-none">
      <div className="grid-page"><h2 data-rise className="col-span-12 display-sec">The destination</h2></div>
      <div className="grid-page mt-[clamp(2rem,4vw,3.5rem)] items-start">
        <figure className="relative col-span-12 overflow-clip bg-[#04121c] lg:sticky lg:top-[12svh] lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <svg ref={svg} viewBox={destination.stops[0].box.join(" ")} className="block aspect-[4/5] max-h-[80svh] w-full" role="img" aria-label={`Map of the northern Maldives. ${cur.title}.`}>
            {data && (
              <>
                <Land coast={data.coast} reef={data.reef} />
                {stop < 2 && <path d={`M${data.points.male}L${data.points.jani}`} fill="none" stroke="var(--glow)" strokeWidth={1.6 * u} strokeDasharray={`${7 * u} ${6 * u}`} />}
                {stop < 2 && pin(data.points.maafaru, "Maafaru Airport", false)}
                {stop === 0 && pin(data.points.male, "Malé, Velana Airport", false)}
                {pin(data.points.jani, "Soneva Jani", true, stop < 2)}
              </>
            )}
          </svg>
          {failed && <p className="absolute inset-x-5 top-5">The map could not load. Soneva Jani is at {destination.coords}, in the Noonu Atoll.</p>}
          <figcaption className="bg-bg pt-2 text-right text-[0.8125rem] text-muted">Map data © OpenStreetMap contributors</figcaption>
        </figure>

        <div className="col-span-12 mt-7 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mt-0">
          <p data-rise className="text-[length:var(--step-lead)] font-display tabular-nums">{destination.coords}, Noonu Atoll, Maldives</p>
          <div role="group" aria-label="Map view" className="mt-5 flex flex-wrap gap-2">
            {destination.stops.map((s, i) => <button key={s.id} type="button" aria-pressed={i === stop} onClick={() => setStop(i)} className="chip">{s.label}</button>)}
          </div>
          <div className="mt-6 min-h-[8.5rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={cur.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="font-display text-[length:var(--step-sub)] leading-tight">{cur.title}</h3>
                <p className="mt-2 max-w-[46ch]">{cur.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <a href={links.maps} target="_blank" rel="noreferrer" className="link-arrow mt-3" data-cursor="Go"><MapPin size={16} aria-hidden="true" /> Open in Google Maps</a>

          <h3 data-rise className="head mt-[clamp(3rem,6vw,5rem)]">Getting here</h3>
          <ul className="mt-5">
            {destination.routes.map((r, i) => (
              <li key={r.name} data-rise={i} className="py-3">
                <p className="flex flex-wrap items-baseline justify-between gap-x-4 font-display text-[length:var(--step-lead)] leading-tight"><span>{r.name}</span><span className="tabular-nums">{r.time}</span></p>
                <p className="mt-1 max-w-[46ch] text-[length:var(--step-small)] text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
          <a href={links.journey} target="_blank" rel="noreferrer" className="link-arrow mt-3" data-cursor="Go">Full journey details <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

/* STEWARDSHIP */
export function Stewardship() {
  return (
    <section id="stewardship" tabIndex={-1} className="section outline-none">
      <div className="grid-page items-center">
        <div data-mask className="col-span-12 lg:col-span-7"><Picture media={media.aerial28} sizes="(min-width:1024px) 58vw, 100vw" className="aspect-[16/11]" /></div>
        <div className="col-span-12 mt-7 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <h2 data-rise className="head">Kept as it was found</h2>
          <ul className="mt-5">
            {stewardship.map(([k, v], i) => (
              <li key={k} data-rise={i} className="py-2.5">
                <h3 className="font-display text-[length:var(--step-lead)] leading-tight">{k}</h3>
                <p className="mt-1 text-[length:var(--step-small)]">{v}</p>
              </li>
            ))}
          </ul>
          <a href={links.stewardship} target="_blank" rel="noreferrer" className="link-arrow mt-3" data-cursor="Go">Soneva on stewardship <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

/* PLAN YOUR STAY */
export function Plan() {
  return (
    <section id="plan" tabIndex={-1} className="section outline-none">
      <div className="grid-page items-start">
        <h2 data-rise className="col-span-12 head lg:col-span-4">Plan your stay</h2>
        <div className="col-span-12 mt-5 lg:col-span-7 lg:col-start-6 lg:mt-0">
          {plan.map(([q, a]) => (
            <details key={q} className="faq group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-display text-[length:var(--step-lead)] leading-tight">
                {q}<Plus size={20} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-4">{a}</p>
            </details>
          ))}
          <p className="mt-4"><a href={links.offers} target="_blank" rel="noreferrer" className="link-arrow" data-cursor="Go">Current offers and Soneva Unlimited <ArrowUpRight size={16} aria-hidden="true" /></a></p>
        </div>
      </div>
    </section>
  );
}

/* 07 EXCLUSIVE ESCAPE */
export function Escape() {
  return (
    <section id="book" tabIndex={-1} className="relative isolate mt-[clamp(6rem,12vw,11rem)] min-h-svh overflow-clip outline-none">
      <div data-drift="5" className="absolute inset-[-10%_0] -z-10"><Image src={media.aerial105.src} alt="" fill sizes="100vw" className="object-cover brightness-[.38]" /></div>
      <div className="grid-page min-h-svh items-center py-20">
        <p data-rise className="col-span-12 max-w-[26ch] font-display text-[length:var(--step-lead)] leading-snug lg:col-span-4">
          The light keeps moving out there, with or without you. Rates and dates live with the resort, and its team will take it from here.
        </p>
        <div data-rise="1" className="glass-card col-span-12 mt-8 p-7 sm:p-11 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:rotate-[-1.5deg]">
          <h2 className="head">Your escape begins here</h2>
          <p className="mt-3 max-w-[40ch]">Book directly with Soneva on its official site, or ask the reservations team about a villa.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn href={links.resort} variant="solid" external>Book Your Stay</Btn>
            <Btn href={links.contact} external>Contact Soneva</Btn>
          </div>
          <p className="mt-6 text-[length:var(--step-small)]">This concept takes no bookings and shows no prices or availability.</p>
        </div>
      </div>
    </section>
  );
}

/* 08 FOOTER */
export function Footer() {
  return (
    <footer className="grid min-h-svh grid-rows-[auto_1fr_auto] bg-sand px-[var(--margin)] pb-5 pt-10 text-[#0a1216]">
      <div className="grid grid-cols-2 gap-8 text-[0.9375rem] lg:grid-cols-4">
        <div><p className="font-medium">Soneva Jani</p><p className="mt-1">Medhufaru Island<br />Noonu Atoll, Maldives</p><p className="mt-1 tabular-nums">{destination.coords}</p></div>
        <nav aria-label="Footer"><p className="font-medium">Explore</p><ul className="mt-1">{nav.map((n) => <li key={n.href}><a className="foot-link" href={n.href}>{n.label}</a></li>)}</ul></nav>
        <div><p className="font-medium">Official Soneva channels</p><ul className="mt-1">{socials.map((s) => <li key={s.href}><a className="foot-link" href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul></div>
        <div><p className="font-medium">Official links</p><ul className="mt-1">
          <li><a className="foot-link" href={links.resort} target="_blank" rel="noreferrer">Soneva Jani</a></li>
          <li><a className="foot-link" href={links.contact} target="_blank" rel="noreferrer">Contact Soneva</a></li>
          <li><a className="foot-link" href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
          <li><a className="foot-link" href="tel:+9606604300">+960 660 4300</a></li>
        </ul></div>
      </div>
      <div />
      <div>
        <svg viewBox="0 0 1000 118" className="block w-full" role="img" aria-label="Soneva Jani">
          <text x="500" y="100" textAnchor="middle" textLength="990" lengthAdjust="spacingAndGlyphs" fontSize="128" fill="currentColor" style={{ fontFamily: "var(--font-display)" }}>Soneva Jani</text>
        </svg>
        <p className="mt-3 max-w-[90ch] text-[0.8125rem] leading-snug">Independent concept redesign, built as a portfolio project. Not affiliated with, endorsed by or connected to Soneva. Names belong to their owners. Facts and photographs © Soneva, from soneva.com; the hero lagoon is a real-time render. Map data © OpenStreetMap contributors. Type: Boska and Satoshi, Indian Type Foundry.</p>
      </div>
    </footer>
  );
}
