/* BY KEYU: interactions */

/* Booking: every "Book a call" button opens this Calendly event in a popup. */
const CALENDLY_URL = "https://calendly.com/keyuhu-ca/new-meeting";

/* The films on the ring. Case studies carry their breakdown notes for the player. */
const FILMS = [
  { id: "edits1", t: "Aloya Festival", k: "Event recap", ar: "4:3", meta: "Montréal / Event recap / 30 s", line: "A festival recap that makes you wish you'd been there.",
    notes: [["The idea", "I wanted someone watching from their couch to feel like they'd missed out. So I didn't film the stage. I filmed what people were doing: games, races, a basketball dunk, Pilates on a rooftop."],
      ["Hook", "A golden-hour shot of the crowd with \"POV: summer in Montréal\", then me welcoming you in. Within three seconds you know where you are and why to keep watching."],
      ["Structure", "Each sponsor activation plays like a small challenge with a prize, like free drinks or points, so the video moves like a game and ends on the sunset DJ set."],
      ["Sound & look", "Quick cuts on a pop track, a warm grade, and score-style captions such as \"200 points\" to keep it playful."],
      ["For your brand", "Sponsors appear as something people play with, not a logo in the background. That's the part of an event people remember and come back for."]] },
  { id: "ugc1", t: "Chaoxiyuan", k: "Immersive dining", ar: "16:9", meta: "Shanghai / Immersive dining / 54 s", line: "A dinner show, filmed from the guest's seat.",
    notes: [["The idea", "Everyone online was talking about this place. I wanted viewers to feel like they had a seat at the table, from getting into costume to the last course."],
      ["Hook", "A fan snaps open, then acrobats fly over the tables. I show the most surprising moment first and explain later."],
      ["Structure", "Everything in the order a guest lives it: costume and makeup, the lantern corridors, nine courses with aerial dancers, then where to find the restaurant."],
      ["Sound & look", "Cuts follow the drums, a whip transition on each costume change, and very little text, so nothing covers the costumes and the lighting."],
      ["For your brand", "When people can picture themselves at your table, booking one is the next step."]] },
  { id: "launchvideo", t: "En Marge", k: "Launch series", ar: "9:16", meta: "Student fundraiser / Episode 1 / 33 s", line: "Day one of a student-run show raising $10K for kids with cancer.",
    notes: [["The idea", "A few students setting out to fill a 1,000-seat theatre for kids with cancer. I wanted people to feel the size of that goal and want to be part of it."],
      ["Hook", "Me alone on an empty stage, asking whether a few students can fill a 1,000-seat theatre. The empty seats make the point."],
      ["Structure", "The challenge, then why it matters, then the $10K goal, and an ending that leaves the question open so people come back for episode two."],
      ["Sound & look", "Quiet in the empty theatre, louder over the concert footage, simple title cards, and subtitles in French and English."],
      ["For your brand", "A launch works better as a series people can follow over time. Show where you're starting and invite them along."]] },
  { id: "storytelling1", t: "The Art of Asking", k: "Storytelling", ar: "9:16", meta: "Wonderland / Storytelling / 75K views", line: "Free Fast Passes, one cold approach at a time. It's broken down beat by beat further down." },
  { id: "vibeyvlog3", t: "Frozen Heart", k: "Shanghai at night", ar: "16:9", meta: "Shanghai / Cinematic / 222K views", line: "Shanghai at night." },
  { id: "storytelling2", t: "10 days until CEGEP", k: "Series, ep 1", ar: "9:16", meta: "My storytelling series / Episode 1" },
  { id: "edits2", t: "10 PM in Shanghai", k: "Food", ar: "16:9", meta: "Shanghai / Food" },
  { id: "storytelling3", t: "A TED talk in 1h20", k: "Series, ep 2", ar: "9:16", meta: "My storytelling series / Episode 2" },
  { id: "edits3", t: "Bored in Montréal", k: "Rooftop party", ar: "16:9", meta: "Montréal / Nightlife" },
  { id: "storytelling4", t: "Dreams & balloons", k: "Series, ep 3", ar: "9:16", meta: "My storytelling series / Episode 3" },
  { id: "vibeyvlog2", t: "Rainy temple hike", k: "Hangzhou", ar: "16:9", meta: "Hangzhou / Travel" },
  { id: "storytelling5", t: "Turning 18 in Beijing", k: "Documentary", ar: "4:3", meta: "Beijing / Documentary" },
];

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const pad = (n, l = 2) => String(n).padStart(l, "0");
const root = document.documentElement;
if (reduce) root.classList.add("flat", "no-reveal");
/* GSAP + ScrollTrigger drive every scroll scene; without them (or with reduced motion) the page is a plain, fully visible layout */
const G = window.gsap, ST = window.ScrollTrigger;
const motion = !reduce && !!(G && ST);
if (motion) {
  G.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });
  root.classList.add("motion");
}

/* ---------- small facts: month, year, Montréal clock ---------- */
const next = new Date(); next.setMonth(next.getMonth() + 1);
$$("[data-month]").forEach((el) => (el.textContent = next.toLocaleString("en-US", { month: "long" })));
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
const clockFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "America/Toronto" });
const tickClock = () => $$("[data-clock]").forEach((el) => (el.textContent = clockFmt.format(new Date())));
tickClock(); setInterval(tickClock, 20000);

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
  if (motion) {
    // one clock: GSAP's ticker drives Lenis, and Lenis tells ScrollTrigger when it moved
    lenis.on("scroll", ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const scrollToEl = (target) => {
  if (lenis) lenis.scrollTo(target, { offset: 0 });
  else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
};
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute("href") === "#book") return;
  const id = a.getAttribute("href").slice(1);
  const target = id === "top" ? document.body : document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  if (id === "top") { lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return; }
  scrollToEl(target);
});

/* ---------- hero: tickers, giant word ---------- */
const stage = $(".hero__stage");
const hero = $(".hero");
(() => {
  const roles = $('[data-tick="roles"]');
  let r = "";
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) r += "<span>Visual storyteller<i>✦</i>Content strategist<i>✦</i>Editor<i>✦</i></span>";
  roles.innerHTML = r;
  const tcEl = $('[data-tick="tc"]');
  const tcs = (n) => `00:${pad(Math.floor(n / 60) % 60)}:${pad(n % 60)}:${pad((n * 7) % 24)}`;
  let t = "";
  for (let k = 0; k < 2; k++) for (let i = 0; i < 6; i++) t += `<span>▸ ${tcs(4 + i * 37)}  ${"/".repeat(20)}  ${i % 2 ? "Scroll to look inside" : "Press any film for sound"}  ${"/".repeat(20)}</span>`;
  tcEl.innerHTML = t;
})();

const WORDS = ["Visual storyteller", "Content strategist", "Editor"];
const giantWord = $(".giant__word");
const spell = (word, cls) => [...word].map((c) => (c === " " ? '<span class="sp"></span>' : `<span class="ch"><span class="${cls}">${c}</span></span>`)).join("");
const fitGiant = () => {
  const avail = stage.clientWidth - 2 * Math.min(28, stage.clientWidth * 0.03);
  const keep = giantWord.innerHTML;
  giantWord.style.fontSize = "200px";
  const longest = WORDS.reduce((a, b) => (a.length > b.length ? a : b));
  giantWord.innerHTML = spell(longest, "");
  const fs = (200 * avail) / giantWord.scrollWidth;
  giantWord.innerHTML = keep;
  giantWord.style.fontSize = fs + "px";
  stage.style.setProperty("--giant-h", Math.ceil(fs * 0.86 * 1.06 + 18) + "px");
};
giantWord.innerHTML = spell(WORDS[0], "");
if (!reduce) {
  let wi = 0;
  setInterval(() => {
    if (document.hidden || window.scrollY > innerHeight) return;
    $$(".ch > span", giantWord).forEach((s, i) => { s.style.transitionDelay = i * 22 + "ms"; s.classList.add("out"); });
    setTimeout(() => {
      wi = (wi + 1) % WORDS.length;
      giantWord.innerHTML = spell(WORDS[wi], "in");
      const spans = $$(".ch > span", giantWord);
      spans.forEach((s, i) => (s.style.transitionDelay = i * 22 + "ms"));
      void giantWord.offsetWidth;   // commit the start position, then let the letters rise in
      setTimeout(() => spans.forEach((s) => s.classList.remove("in")), 20);
    }, 650);
  }, 4600);
}

/* ---------- hero: line field + 3D head + dive into the eye ---------- */
const field = $("#field"), fctx = field.getContext("2d");
const headCanvas = $("#head");
const pointer = { x: 0.3, y: 0.3, moved: false };
window.addEventListener("pointermove", (e) => { pointer.x = e.clientX / innerWidth; pointer.y = e.clientY / innerHeight; pointer.moved = true; }, { passive: true });

const layout = { W: 1, H: 1, cx: 0, cy: 0, size: 300, top: 0, bottom: 0 };
const measure = () => {
  const W = stage.clientWidth, H = stage.clientHeight;
  const hgH = $(".hg").offsetHeight;
  const tickTop = $(".tick--roles").offsetTop;
  const fieldH = tickTop - hgH;
  layout.W = W; layout.H = H; layout.top = hgH; layout.bottom = tickTop;
  layout.cx = W / 2; layout.cy = hgH + fieldH * 0.5;
  layout.size = Math.max(140, Math.min(fieldH * 0.78, W * (W < 680 ? 0.6 : 0.4)));
  const dpr = Math.min(2, devicePixelRatio || 1);
  field.width = W * dpr; field.height = H * dpr; fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const drawField = (time, zoom) => {
  const { W, H, cx, cy, size, top, bottom } = layout;
  fctx.clearRect(0, 0, W, H);
  if (zoom > 0.6) return;
  const n = Math.round(W / (W < 680 ? 11 : 8.5)), R = size * 0.66;
  const mx = pointer.x * W, my = pointer.y * H;
  fctx.strokeStyle = "rgba(233,228,216,0.2)"; fctx.lineWidth = 1;
  fctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const x0 = (i * W) / n;
    for (let y = top; y <= bottom; y += 6) {
      let x = x0 + 8 * Math.sin(y * 0.012 + i * 0.21 + time * 0.0006) + 5 * Math.sin(y * 0.031 + i * 0.07 - time * 0.0004);
      const dx = x0 - cx, dy = y - cy, d = Math.hypot(dx, dy);
      const push = Math.max(0, 1 - d / R); x += Math.sign(dx || 1) * push * push * R * 0.42;
      const mdx = x0 - mx, md = Math.hypot(mdx, y - my), mp = Math.max(0, 1 - md / 120);
      x += Math.sign(mdx || 1) * mp * mp * 26;
      y === top ? fctx.moveTo(x, y) : fctx.lineTo(x, y);
    }
  }
  fctx.stroke();
};

let head = null;
const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("failed to load " + src)); document.head.appendChild(s); });
const startHead = async () => {
  try {
    if (!window.THREE) await loadScript("vendor/three/three.min.js");
    if (!window.THREE.RoomEnvironment) await loadScript("vendor/three/room-environment.js");
    if (!window.initKeyuHead) await loadScript("js/head.js");
    const img = new Image(); img.src = "assets/posters/storytelling1.jpg";
    await img.decode().catch(() => {});
    head = window.initKeyuHead(headCanvas, img);
    requestAnimationFrame(() => headCanvas.classList.add("is-ready"));
  } catch (err) {
    root.classList.add("no-webgl");
    console.warn("3D head unavailable:", err);
  }
};
// build the head only once the intro is over, so the opening titles never stutter
const introRunning = () => root.classList.contains("is-loading");
if (introRunning()) {
  let started = false;
  const go = () => { if (!started) { started = true; setTimeout(startHead, 60); } };
  window.addEventListener("keyu:intro-done", go, { once: true });
  setTimeout(go, 5000);
} else setTimeout(startHead, 60);

const sectionProgress = (el) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - innerHeight));
};

const heroLoop = (time) => {
  const r = hero.getBoundingClientRect();
  const visible = r.bottom > 0 && !introRunning();
  if (visible) {
    const zoom = reduce ? 0 : ss(0.06, 1, sectionProgress(hero));
    stage.style.setProperty("--z", zoom.toFixed(4));
    drawField(time, zoom);
    if (head) {
      const idle = !pointer.moved;
      head.frame({
        px: idle ? 0.5 + Math.sin(time * 0.0005) * 0.15 : pointer.x, py: idle ? 0.42 : pointer.y,
        cx: layout.cx, cy: layout.cy, size: layout.size, zoom, time,
      });
    }
  }
  if (!motion) {
    document.body.classList.toggle("past-hero", r.bottom < innerHeight * 0.5);
    const wr = work.getBoundingClientRect();
    document.body.classList.toggle("in-work", wr.top < innerHeight * 0.5 && wr.bottom > innerHeight * 0.5);
  }
  requestAnimationFrame(heroLoop);
};

/* ---------- work: films on a ring, letters on a slower drum ---------- */
const SIZES = { "9:16": [250, 444], "16:9": [520, 293], "4:3": [450, 338] };
const YOFF = [-40, 60, -70, 40, -20, 80, -60, 30, -80, 50, -30, 70];
const work = $(".work"), ring = $(".drum--ring"), letters = $(".drum--letters"), scaleEl = $(".work__scale");
const cards = [];
const buildWork = () => {
  const mobile = innerWidth < 760;
  const step = mobile ? 15 : 12;
  let html = "";
  ["W", "O", "R", "K"].forEach((ch, ri) => {
    for (let a = 0; a < 360; a += step) html += `<div class="L" style="transform:rotateY(${a}deg) translateZ(1150px) translateY(${(ri - 1.5) * 300}px)">${ch}</div>`;
  });
  letters.innerHTML = html;
  FILMS.forEach((f, i) => {
    const [w, h] = SIZES[f.ar];
    const el = document.createElement("div");
    el.className = "card"; el.tabIndex = 0; el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Watch ${f.t}, ${f.k}`);
    el.style.cssText = `width:${w}px;height:${h + 44}px;margin:${-(h + 44) / 2}px 0 0 ${-w / 2}px`;
    el.innerHTML = `<div class="card__media" style="background-image:url(assets/posters/${f.id}.jpg)"></div><div class="card__lab"><span>${f.t}</span><span>${pad(i + 1)}/${FILMS.length}</span></div>`;
    el.addEventListener("click", () => openFilm(i));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFilm(i); } });
    ring.appendChild(el);
    cards.push({ el, angle: i * (360 / FILMS.length), y: YOFF[i % YOFF.length], f, video: null });
  });
  // the same films as a plain list, for reduced motion
  $(".work__list").innerHTML = FILMS.map((f, i) => `<li><button type="button" data-film="${i}"><img src="assets/posters/${f.id}.jpg" alt="" loading="lazy" /><span class="mono">${pad(i + 1)} ${f.t}</span><br /><span class="mono dim">${f.k}</span></button></li>`).join("");
  $$(".work__list [data-film]").forEach((b) => b.addEventListener("click", () => openFilm(+b.dataset.film)));
};
const scaleWork = () => {
  const W = innerWidth, H = innerHeight;
  scaleEl.style.setProperty("--s", W < 760 ? (W / 820).toFixed(3) : Math.min(W / 1440, H / 900).toFixed(3));
};
const norm = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
const cardVideo = (c) => {
  if (c.video) return c.video;
  const v = document.createElement("video");
  v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
  ["muted", "playsinline", "webkit-playsinline", "loop", "disablepictureinpicture"].forEach((a) => v.setAttribute(a, ""));
  v.poster = `assets/posters/${c.f.id}.jpg`;
  v.src = `assets/videos/${c.f.id}.mp4`;
  v.addEventListener("playing", () => c.el.classList.add("is-playing"));
  $(".card__media", c.el).appendChild(v);
  c.video = v; return v;
};
let frontIdx = -1;
const updateWork = (p = sectionProgress(work)) => {
  if (reduce) return;
  const ringA = 18 - p * 372, lettersA = 8 - p * 372 * 0.55;
  ring.style.transform = `translateZ(-2350px) rotateX(-3deg) rotateZ(-4deg) rotateY(${ringA}deg)`;
  letters.style.transform = `translateZ(-2350px) rotateX(-3deg) rotateZ(-4deg) rotateY(${lettersA}deg)`;
  const inView = work.getBoundingClientRect().top < innerHeight && work.getBoundingClientRect().bottom > 0;
  let best = 0, bestD = 999;
  cards.forEach((c, i) => {
    const a = norm(c.angle + ringA);
    c.el.style.transform = `rotateY(${c.angle}deg) translateZ(1480px) translateY(${c.y}px)`;
    c.el.style.filter = `brightness(${(1 - Math.min(1, Math.abs(a) / 120) * 0.55).toFixed(3)})`;
    if (Math.abs(a) < bestD) { bestD = Math.abs(a); best = i; }
    const near = inView && Math.abs(a) < 42;
    if (near) { const v = cardVideo(c); if (v.paused) v.play().catch(() => {}); }
    else if (c.video && !c.video.paused) c.video.pause();
  });
  if (best !== frontIdx) {
    frontIdx = best;
    const f = FILMS[best];
    $("#nowIdx").textContent = `${pad(best + 1)} / ${FILMS.length}`;
    $("#nowTitle").textContent = f.t;
    $("#nowKind").textContent = f.k;
  }
};

/* ---------- film player ---------- */
const film = $("#film"), filmVideo = $("video", film);
function openFilm(i) {
  const f = FILMS[i];
  $("#filmMeta").textContent = f.meta || f.k;
  $("#filmTitle").textContent = f.t;
  $("#filmLine").textContent = f.line || "";
  $("#filmNotes").innerHTML = (f.notes || []).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  cards.forEach((c) => c.video && c.video.pause());
  filmVideo.poster = `assets/posters/${f.id}.jpg`;
  filmVideo.src = `assets/videos/${f.id}.mp4`;
  filmVideo.muted = false;
  film.showModal(); document.body.classList.add("film-open");
  lenis?.stop();
  filmVideo.play().catch(() => {});
}
const closeFilm = () => { if (film.open) film.close(); };
film.addEventListener("close", () => { filmVideo.pause(); filmVideo.removeAttribute("src"); filmVideo.load(); document.body.classList.remove("film-open"); lenis?.start(); });
$("[data-close]", film).addEventListener("click", closeFilm);
film.addEventListener("click", (e) => { if (e.target === film) closeFilm(); });
$(".film__cta", film).addEventListener("click", closeFilm);

/* ---------- helpers for the scroll scenes ---------- */
// wrap every word of an element's text in spans, keeping links and italics intact
const splitWords = (el, cls = "w") => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((n) => {
    const parts = n.textContent.split(/([ \t\n\r]+)/);   // no-break spaces stay inside a word
    const frag = document.createDocumentFragment();
    parts.forEach((pt) => {
      if (!pt) return;
      if (/^[ \t\n\r]+$/.test(pt)) { frag.appendChild(document.createTextNode(" ")); return; }
      const o = document.createElement("span");
      o.className = cls;
      if (cls === "w") { const i = document.createElement("span"); i.className = "wi"; i.textContent = pt; o.appendChild(i); }
      else o.textContent = pt;
      frag.appendChild(o);
    });
    n.replaceWith(frag);
  });
  return el;
};
if (motion) $$("[data-split]").forEach((el) => splitWords(el));
const whenIn = (trigger, start = "top 82%") => ({ trigger, start, toggleActions: "play none none reverse" });

/* ---------- body classes and the corner labels ---------- */
if (motion) {
  ST.create({ trigger: hero, start: "bottom 50%", end: () => "+=" + document.documentElement.scrollHeight,
    onEnter: () => document.body.classList.add("past-hero"), onLeaveBack: () => document.body.classList.remove("past-hero") });
  ST.create({ trigger: work, start: "top 50%", end: "bottom 50%", toggleClass: { targets: document.body, className: "in-work" } });
  ST.create({ trigger: work, start: "top bottom", end: "bottom top",
    onUpdate: () => updateWork(),
    onToggle: (s) => { if (!s.isActive) cards.forEach((c) => c.video && c.video.pause()); },
    onRefresh: () => updateWork() });
  $$("[data-section]").forEach((sec) => ST.create({ trigger: sec, start: "top 50%", end: "bottom 50%",
    onToggle: (s) => { if (s.isActive) $("#cnSection").textContent = sec.dataset.section; } }));
  const prog = $("#cnProgress");
  ST.create({ start: 0, end: "max", onUpdate: (s) => (prog.textContent = pad(Math.round(s.progress * 100)) + "%") });
} else {
  window.addEventListener("scroll", () => updateWork(), { passive: true });
}

/* ---------- headings: words rise out of a mask ---------- */
if (motion) {
  $$(".bd__title, .sv__title, .faq__title, .proof__title").forEach((h) =>
    G.from($$(".wi", h), { yPercent: 115, rotate: 4, duration: 1.05, ease: "expo.out", stagger: 0.05, scrollTrigger: whenIn(h) }));
  $$(".label").forEach((l) => { if (!l.closest(".made, .myths, .bd, .method, .proof__stage, .letter__side, .book")) G.from(l, { opacity: 0, x: -20, duration: 0.8, ease: "power3.out", scrollTrigger: whenIn(l, "top 92%") }); });
}

/* ---------- 3. made with: a marquee that speeds up and turns with the scroll ---------- */
(() => {
  const track = $(".marq__track");
  if (motion) [...track.children].forEach((li) => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c); });
  $$("li:not([aria-hidden]) img", track).forEach((img) => (img.alt = img.dataset.alt || img.nextElementSibling.textContent));
  $$("li[aria-hidden] img", track).forEach((img) => (img.alt = ""));
  if (!motion) return;
  const loop = G.to(track, { xPercent: -50, ease: "none", duration: 34, repeat: -1 });
  loop.totalTime(34 * 50);   // far from zero, so it can also run backwards
  let boost = 0, dir = 1, live = false;
  const skew = G.quickSetter(track, "skewX", "deg");
  ST.create({ trigger: ".made", start: "top bottom", end: "bottom top",
    onToggle: (s) => { live = s.isActive; live ? loop.play() : loop.pause(); },
    onUpdate: (s) => { dir = s.direction; boost = Math.min(6, Math.abs(s.getVelocity()) / 260); } });
  G.ticker.add(() => {
    if (!live) return;
    boost *= 0.93;
    const ts = loop.timeScale();
    loop.timeScale(ts + (dir * (1 + boost) - ts) * 0.12);
    skew(-dir * boost * 1.4);
  });
  G.from(".made__head > *", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: whenIn(".made") });
  G.from(".marq", { clipPath: "inset(0 50% 0 50%)", duration: 1.3, ease: "expo.inOut", scrollTrigger: whenIn(".marq", "top 88%") });
})();

/* ---------- 4. myths: struck through one by one, replaced by the truth ---------- */
if (motion) {
  const title = $(".myths__title");
  G.from($$(".anton .wi", title), { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: whenIn(".myths", "top 60%") });
  G.from($(".serif", title), { opacity: 0, y: 30, duration: 1, delay: 0.35, ease: "power3.out", scrollTrigger: whenIn(".myths", "top 60%") });
  const tl = G.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".myths", start: "top top", end: "bottom bottom", scrub: 0.7 } });
  tl.to({}, { duration: 0.8 })
    .to(title, { yPercent: -18, opacity: 0, duration: 0.8, ease: "power1.in" });
  const items = $$(".myths__list li");
  items.forEach((li, i) => {
    const myth = $(".myths__myth", li), strike = $(".strike", li), words = $$(".wi", li), line = $(".myths__line", li), n = $(".myths__n", li), big = $(".myths__big", li);
    tl.set(li, { visibility: "visible" }, i ? "-=0.12" : ">")
      .from(big, { opacity: 0, yPercent: 40, duration: 1, ease: "power2.out" }, "<")
      .from([n, myth], { opacity: 0, y: 50, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "<")
      .from(strike, { scaleX: 0, duration: 0.7, ease: "power2.inOut" })
      .to(myth, { opacity: 0.38, duration: 0.3 })
      .from(words, { yPercent: 118, duration: 1, stagger: 0.12, ease: "power3.out" }, "<")
      .from(line, { opacity: 0, y: 24, duration: 0.5 })
      .to({}, { duration: 1.1 });
    if (i < items.length - 1) tl.to(li, { opacity: 0, yPercent: -10, duration: 0.6, ease: "power1.in" })
      .to(big, { yPercent: -80, duration: 0.6, ease: "power1.in" }, "<");
  });
}

/* ---------- inline videos with sound on press (the breakdown player) ---------- */
const startVideo = (v) => {
  if (!v.src && v.dataset.src) { v.preload = "auto"; v.src = v.dataset.src; }
  v.play().catch(() => {});
};
$$("figure[data-video]").forEach((fig) => {
  const name = fig.dataset.video;
  const v = document.createElement("video");
  v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = "none";
  ["muted", "playsinline", "webkit-playsinline", "loop", "disablepictureinpicture"].forEach((a) => v.setAttribute(a, ""));
  v.poster = `assets/posters/${name}.jpg`; v.dataset.src = `assets/videos/${name}.mp4`;
  fig.prepend(v);
  const badge = document.createElement("span");
  badge.className = "snd"; badge.innerHTML = `<span class="off">${canHover ? "Press" : "Tap"} for sound</span><span class="on">Sound on</span>`;
  fig.appendChild(badge);
  fig.setAttribute("role", "button"); fig.tabIndex = 0; fig.setAttribute("aria-label", "Play The Art of Asking with sound");
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !reduce) startVideo(v); else if (!e.isIntersecting) { v.pause(); v.muted = true; fig.classList.remove("is-sound"); } }), { threshold: 0.25 }).observe(fig);
  const toggle = () => { v.muted = !v.muted; startVideo(v); fig.classList.toggle("is-sound", !v.muted); };
  fig.addEventListener("click", toggle);
  fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  if (name === "storytelling1") syncBreakdown(v);
});

/* ---------- 5. breakdown: scrolling steps through the beats, the video and the real waveform follow ---------- */
function syncBreakdown(v) {
  const beats = $$(".bd__beats li"), marks = $$(".bd__marks button"), svg = $("#wave");
  const from = beats.map((b) => +b.dataset.from), END = 74;
  let dur = END, cur = -1, clip = null, playhead = null, scene = null;
  const beatAt = (t) => { let i = 0; from.forEach((f, j) => { if (t >= f) i = j; }); return i; };
  const show = (i) => {
    if (i === cur) return;
    cur = i;
    beats.forEach((b, j) => b.classList.toggle("is-on", j === i));
    marks.forEach((m, j) => { m.classList.toggle("is-on", j === i); m.setAttribute("aria-pressed", String(j === i)); });
  };
  const seek = (i) => { show(i); if (v.readyState > 0) v.currentTime = from[i]; else v.addEventListener("loadedmetadata", () => (v.currentTime = from[i]), { once: true }); startVideo(v); };
  show(0);

  fetch("assets/data/wave.json").then((r) => r.json()).then((w) => {
    const bw = 1000 / w.length;
    const bars = w.map((a, i) => { const h = Math.max(2, a * 64); return `<rect x="${(i * bw).toFixed(2)}" y="${(35 - h / 2).toFixed(1)}" width="${(bw * 0.6).toFixed(2)}" height="${h.toFixed(1)}"/>`; }).join("");
    svg.innerHTML = `<defs><clipPath id="wclip"><rect id="wcr" x="0" y="0" width="0" height="70"/></clipPath></defs>`
      + `<g fill="rgba(233,228,216,.22)">${bars}</g><g fill="#A9C6E6" clip-path="url(#wclip)">${bars}</g>`
      + from.concat(END).map((m) => `<line x1="${(m / END) * 1000}" x2="${(m / END) * 1000}" y1="0" y2="70" stroke="rgba(233,228,216,.35)" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join("")
      + `<line id="ph" x1="0" x2="0" y1="-4" y2="74" stroke="#E9E4D8" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    clip = $("#wcr", svg); playhead = $("#ph", svg);
  }).catch(() => {});
  v.addEventListener("loadedmetadata", () => (dur = v.duration || END));
  v.addEventListener("timeupdate", () => {
    const t = v.currentTime;
    show(beatAt(t));
    if (playhead) { const x = (t / dur) * 1000; playhead.setAttribute("x1", x); playhead.setAttribute("x2", x); clip.setAttribute("width", x); }
  });

  if (motion) {
    let scrollBeat = 0;
    scene = ST.create({ trigger: ".bd", start: "top top", end: "bottom bottom",
      onUpdate: (s) => { const i = Math.min(beats.length - 1, Math.floor(s.progress * beats.length)); if (i !== scrollBeat) { scrollBeat = i; seek(i); } } });
    G.from([".bd__player", ".bd__beats", ".bd__wave"], { opacity: 0, y: 60, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: whenIn(".bd", "top 55%") });
  }
  const jump = (i) => {
    if (scene) { const y = scene.start + ((i + 0.5) / beats.length) * (scene.end - scene.start); lenis ? lenis.scrollTo(y) : scrollTo(0, y); }
    seek(i);
  };
  marks.forEach((m, i) => m.addEventListener("click", () => jump(i)));
  beats.forEach((b, i) => b.addEventListener("click", () => seek(i)));
}

/* ---------- 6. method: the strip slides left, each letter fills as it passes ---------- */
if (motion) {
  const sec = $(".method"), track = $(".method__track");
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  ST.addEventListener("refreshInit", () => (sec.style.height = innerHeight + dist() + "px"));
  sec.style.height = innerHeight + dist() + "px";
  const slide = G.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
  G.to(".method__bar i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.6 } });
  $$(".method__step").forEach((step) => {
    ST.create({ trigger: step, containerAnimation: slide, start: "left 78%",
      onEnter: () => step.classList.add("is-on"), onLeaveBack: () => step.classList.remove("is-on") });
    G.from(step.querySelectorAll("h3, p, .mono"), { y: 40, opacity: 0, stagger: 0.06, ease: "power2.out",
      scrollTrigger: { trigger: step, containerAnimation: slide, start: "left 90%", end: "left 55%", scrub: true } });
  });
  const intro = $(".method__intro");
  G.from(intro.children, { opacity: 0, y: 50, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: whenIn(sec, "top 55%") });
}

/* ---------- 7. services: names rise row by row; a poster follows the pointer ---------- */
if (motion) {
  $$(".sv__list li").forEach((li) => {
    G.from($("h3 > span", li), { yPercent: 110, duration: 1, ease: "expo.out", scrollTrigger: whenIn(li, "top 92%") });
    G.from($$(".sv__i, p, .sv__go", li), { opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out", scrollTrigger: whenIn(li, "top 92%") });
  });
  G.from(".sv__incl li", { opacity: 0, y: 16, duration: 0.6, stagger: 0.07, ease: "power2.out", scrollTrigger: whenIn(".sv__incl", "top 90%") });
  G.from(".sv__q span", { opacity: 0, scale: 0.4, rotate: -25, duration: 0.9, stagger: 0.12, ease: "back.out(2)", scrollTrigger: whenIn(".sv__founding", "top 85%") });
  G.from(".sv__ftxt, .sv__founding .btn", { opacity: 0, x: 40, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: whenIn(".sv__founding", "top 85%") });
}
(() => {
  const pv = $(".sv__preview"), img = $("img", pv);
  if (!canHover || reduce) return;
  let x = 0, y = 0, tx = 0, ty = 0, on = false, run = false;
  const loop = () => {
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    pv.style.transform = `translate(${x}px, ${y}px) rotate(${(tx - x) * 0.04}deg)`;
    if (on || Math.abs(tx - x) > 0.5) requestAnimationFrame(loop); else run = false;
  };
  $$(".sv__list li").forEach((li) => {
    li.addEventListener("mouseenter", () => { img.src = `assets/posters/${li.dataset.preview}.jpg`; on = true; pv.classList.add("is-on"); if (!run) { run = true; requestAnimationFrame(loop); } });
    li.addEventListener("mouseleave", () => { on = false; pv.classList.remove("is-on"); });
  });
  window.addEventListener("mousemove", (e) => { tx = e.clientX + 28; ty = e.clientY - 140; }, { passive: true });
})();

/* ---------- 8. the letter: every word lights up as you read ---------- */
(() => {
  const ps = $$(".letter__body p");
  $("#letterAll").textContent = pad(ps.length);
  if (!motion) return;
  const now = $("#letterNow");
  ps.forEach((p, i) => {
    splitWords(p, "lw");
    G.fromTo($$(".lw", p), { opacity: 0.13 }, { opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 52%", scrub: true,
        onToggle: (s) => { if (s.isActive) now.textContent = pad(i + 1); } } });
  });
  ST.matchMedia({
    "(min-width: 681px)": () => G.to(".letter__meter i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".letter__body", start: "top 70%", end: "bottom 60%", scrub: true } }),
    "(max-width: 680px)": () => G.to(".letter__meter i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".letter__body", start: "top 70%", end: "bottom 60%", scrub: true } }),
  });
  G.from(".letter__facts li", { opacity: 0, y: 30, duration: 0.8, stagger: 0.07, ease: "power3.out", scrollTrigger: whenIn(".letter__facts", "top 90%") });
})();

/* ---------- 9. proof: the numbers count up ---------- */
if (motion) {
  const nums = $$(".proof__stats [data-count]");
  nums.forEach((el) => (el.textContent = "0"));
  const tl = G.timeline({ scrollTrigger: { trigger: ".proof__pin", start: "top 35%", end: "bottom bottom", scrub: 0.5 } });
  nums.forEach((el, i) => {
    const o = { v: 0 }, cell = el.closest("div");
    tl.from(cell, { opacity: 0.12, y: 40, duration: 0.4, ease: "power2.out" }, i * 0.7)
      .to(o, { v: +el.dataset.count, duration: 0.9, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) }, i * 0.7);
  });
  tl.to({}, { duration: 0.5 });
  G.from(".proof__file", { opacity: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: whenIn(".proof__file", "top 88%") });
  G.from(".proof__dock li", { opacity: 0, y: 50, scale: 0.7, duration: 0.8, stagger: 0.06, ease: "back.out(1.7)", scrollTrigger: whenIn(".proof__dock", "top 88%") });
  $$(".proof__mini [data-count]").forEach((el) => {
    const o = { v: 0 }, n = +el.dataset.count;
    el.textContent = "0";
    G.to(o, { v: n, duration: 1.4, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: ".proof__ny", start: "top 80%", toggleActions: "play none none none" } });
  });
  G.from(".proof__ny > *", { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: whenIn(".proof__ny", "top 85%") });
}

/* ---------- 10. faq: a tight accordion, one answer open at a time ---------- */
(() => {
  const all = $$(".faq__list details");
  const close = (d) => {
    const a = $(".faq__a", d);
    if (!motion) { d.open = false; return; }
    G.to(a, { height: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => { d.open = false; a.style.height = ""; } });
  };
  all.forEach((d) => {
    $("summary", d).addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) { close(d); return; }
      all.forEach((o) => o !== d && o.open && close(o));
      d.open = true;
      if (motion) G.fromTo($(".faq__a", d), { height: 0 }, { height: "auto", duration: 0.5, ease: "power3.out", onComplete: () => ($(".faq__a", d).style.height = "") });
    });
  });
  if (motion) G.from(all, { opacity: 0, y: 24, duration: 0.7, stagger: 0.05, ease: "power2.out", scrollTrigger: whenIn(".faq__list", "top 85%") });
})();

/* ---------- 11. contact: the last words slam in, the button pulls toward the pointer ---------- */
if (motion) {
  const lines = $$(".book__l");
  const tl = G.timeline({ scrollTrigger: whenIn(".book", "top 62%") });
  lines.forEach((l, i) => tl.from($$(".wi", l), { yPercent: 120, rotate: i % 2 ? -5 : 5, duration: 1.2, ease: "expo.out", stagger: 0.05 }, i * 0.12));
  tl.from([".book .label", ".book__side > *"], { opacity: 0, y: 30, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.45);
  G.fromTo(".book__title", { scale: 0.94 }, { scale: 1, ease: "none", transformOrigin: "left bottom", scrollTrigger: { trigger: ".book", start: "top bottom", end: "top top", scrub: true } });
  if (canHover) {
    const btn = $(".book .btn"), qx = G.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" }), qy = G.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
    btn.addEventListener("mousemove", (e) => { const r = btn.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.25); qy((e.clientY - r.top - r.height / 2) * 0.35); });
    btn.addEventListener("mouseleave", () => { qx(0); qy(0); });
  }
}

/* ---------- cursor ---------- */
(() => {
  const cur = $(".cursor");
  if (!canHover || reduce) return;
  const label = $(".cursor__label", cur);
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY; cur.classList.add("is-visible");
    const t = e.target.closest(".card, [data-cursor], .bd__beats li");
    const txt = !t ? "" : t.classList.contains("card") ? "Watch" : t.matches("li") ? "Jump here" : t.classList.contains("is-sound") ? "Sound on" : "Press for sound";
    label.textContent = txt; cur.classList.toggle("is-act", !!t);
  }, { passive: true });
  document.addEventListener("mouseleave", () => cur.classList.remove("is-visible"));
  const loop = () => { x += (tx - x) * 0.22; y += (ty - y) * 0.22; cur.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); };
  loop();
})();

/* ---------- sound toggle: hovering a playing film on the ring plays its audio ---------- */
(() => {
  const btn = $("#soundToggle");
  let on = false;
  btn.addEventListener("click", () => { on = !on; btn.setAttribute("aria-pressed", String(on)); });
  ring.addEventListener("mouseover", (e) => {
    const c = cards.find((k) => k.el.contains(e.target));
    cards.forEach((k) => k.video && (k.video.muted = true));
    if (on && c?.video) c.video.muted = false;
  });
  ring.addEventListener("mouseleave", () => cards.forEach((k) => k.video && (k.video.muted = true)));
})();

/* ---------- booking → Calendly popup ---------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest('a[href="#book"], [data-book-main]');
  if (!btn) return;
  const isMain = btn.hasAttribute("data-book-main");
  e.preventDefault();
  if (window.Calendly) { closeFilm(); window.Calendly.initPopupWidget({ url: CALENDLY_URL }); }
  else if (isMain) window.location.href = "mailto:keyuhu.ca@gmail.com?subject=Let's%20work%20together";
  else scrollToEl($("#book"));
});

/* ---------- boot ---------- */
const onResize = () => { measure(); fitGiant(); scaleWork(); head?.resize(); if (!motion) updateWork(); };
buildWork();
document.fonts?.ready.then(() => { onResize(); if (motion) ST.refresh(); });
window.addEventListener("resize", onResize);
onResize();
if (motion) window.addEventListener("load", () => ST.refresh());
requestAnimationFrame(heroLoop);
