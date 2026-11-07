// Clicks through every interactive path on the running site. Run with the server up: node scripts/flow-test.mjs
// Uses reduced motion so software-rendered WebGL does not stall the automation.
import { execFileSync } from "node:child_process";

const ab = (...a) => execFileSync("agent-browser", a, { encoding: "utf8", shell: true, timeout: 110000 }).trim();
const ev = (js) => { const out = ab("eval", `"${js.replaceAll('"', '\\"')}"`); try { return JSON.parse(out); } catch { return out; } };
let fails = 0;
const check = (name, ok, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"} ${name} ${extra}`); if (!ok) fails++; };
const wait = (ms) => ab("wait", String(ms));

ab("set", "viewport", "1280", "800");
ab("set", "media", "reduced-motion");
ab("open", "http://localhost:3000");
wait(1500);

// Internal anchors all resolve
const anchors = ev(`[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>!document.querySelector(h))`);
check("every internal link has a target", anchors.length === 0, JSON.stringify(anchors));
const ext = ev(`[...new Set([...document.querySelectorAll('a[href^="http"]')].map(a=>a.href))].filter(h=>!/soneva\\.com|instagram\\.com\\/soneva|facebook\\.com\\/SonevaOfficial|tiktok\\.com\\/@sonevaofficial|linkedin\\.com\\/company\\/soneva|wa\\.me|google\\.com\\/maps/.test(h))`);
check("external links only go to official channels", ext.length === 0, JSON.stringify(ext));
check("one h1", ev(`document.querySelectorAll('h1').length`) === 1);
check("images have alt attributes", ev(`[...document.images].filter(i=>i.getAttribute('alt')===null).length`) === 0);
check("no horizontal overflow", ev(`document.documentElement.scrollWidth<=innerWidth`));

// Hour dial
ev(`(()=>{const r=document.querySelector('#hour');const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(r,21.5);r.dispatchEvent(new Event('input',{bubbles:true}))})()`);
wait(200);
check("hour dial updates readout", /Under the stars/.test(ev(`document.querySelector('output').textContent`)));
check("hour dial tints the page", ev(`getComputedStyle(document.documentElement).getPropertyValue('--glow')`) !== "#ffb98a");

// Menu
ev(`document.querySelector('button[aria-controls=menu]').click()`);
wait(900);
check("menu opens as dialog", ev(`!!document.querySelector('#menu[role=dialog]')`));
check("menu lists six shortcuts", ev(`document.querySelectorAll('#menu li a').length`) === 6);
ab("press", "Escape");
wait(900);
check("Escape closes menu", ev(`!document.querySelector('#menu')`));
check("focus returns to toggle", ev(`document.activeElement.getAttribute('aria-controls')`) === "menu");
ev(`document.querySelector('button[aria-controls=menu]').click()`);
wait(800);
ev(`document.querySelectorAll('#menu li a')[1].click()`);
wait(1500);
check("all villas have real photos", ev(`[...document.querySelectorAll('.villa-card img')].every(i=>i.src.includes('official'))`));
check("menu link scrolls to Villas", ev(`Math.abs(document.querySelector('#villas').getBoundingClientRect().top)<40`), String(ev(`document.querySelector('#villas').getBoundingClientRect().top`)));

// Villa filter and sheet
const row = `document.querySelectorAll('.villa-card button')`;
check("ten villas listed", ev(`${row}.length`) === 10);
ev(`[...document.querySelectorAll('#villas .chip')][1].click()`);
wait(900);
check("filter shows over-water villas", ev(`${row}.length`) === 4, String(ev(`${row}.length`)));
ev(`[...document.querySelectorAll('#villas .chip')][0].click()`);
wait(700);
ev(`${row}[3].click()`);
wait(1000);
check("villa sheet opens with real data", /1,421/.test(ev(`document.querySelector('[aria-labelledby=villa-title]').textContent`)));
check("villa sheet has its gallery", ev(`document.querySelectorAll('[aria-labelledby=villa-title] img').length`) >= 3);
ab("press", "Escape");
wait(1000);
check("Escape closes villa sheet", ev(`!document.querySelector('[aria-labelledby=villa-title]')`));

// Lightbox
ev(`document.querySelector('.g-item button').click()`);
wait(900);
check("lightbox opens", /1 of 8/.test(ev(`document.querySelector('[role=dialog][aria-label^=Image]')?.textContent||''`)));
ab("press", "ArrowRight");
wait(500);
check("arrow key moves lightbox", /2 of 8/.test(ev(`document.querySelector('[role=dialog][aria-label^=Image]')?.textContent||''`)));
ab("press", "Escape");
wait(700);
check("Escape closes lightbox", ev(`!document.querySelector('[role=dialog][aria-label^=Image]')`));

// Map
ev(`document.querySelector('#destination').scrollIntoView()`);
wait(1500);
check("map loads real paths", ev(`document.querySelectorAll('#destination svg path').length`) >= 2);
ev(`[...document.querySelectorAll('#destination .chip')][2].click()`);
wait(1200);
check("map stop changes view and text", /Medhufaru/.test(ev(`document.querySelector('#destination [aria-live]').textContent`)) && /^650/.test(ev(`document.querySelector('#destination svg').getAttribute('viewBox')`)));

// Back to top and booking
check("booking points at official site", ev(`document.querySelector('#book a').href`) === "https://soneva.com/resorts/soneva-jani/");
check("back to top present", ev(`!!document.querySelector('a[aria-label="Back to top"]')`));

console.log(fails ? `${fails} FAILED` : "ALL PASSED");
process.exit(fails ? 1 : 0);
