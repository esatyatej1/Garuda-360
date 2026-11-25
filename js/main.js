/* ===== Site settings: edit these ===== */
const SITE = {
  links: {
    garuda360: "https://www.youtube.com/channel/UCZ1MWcl46VDxFjN_WzUPRsQ",
    // TODO: replace with the real Garuda Vision channel URL
    garudaVision: "https://www.youtube.com/@GarudaVision"
  },
  email: "x.one.0369@gmail.com"
};

/* channel links + email */
document.querySelectorAll("[data-link]").forEach(a => {
  const base = SITE.links[a.dataset.link];
  if (base) a.href = base + (a.hasAttribute("data-sub") || a.classList.contains("cta") ? "?sub_confirmation=1" : "");
});
document.querySelectorAll(".year").forEach(e => e.textContent = new Date().getFullYear());
const mail = document.getElementById("mail");
if (mail) {
  document.getElementById("mailText").textContent = SITE.email;
  mail.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(SITE.email); toast("Email copied to clipboard"); }
    catch { location.href = "mailto:" + SITE.email; }
  });
}
document.querySelectorAll("[data-email]").forEach(a => { a.href = "mailto:" + SITE.email; a.textContent = SITE.email; });
function toast(msg) {
  const t = document.getElementById("toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

/* nav */
const nav = document.getElementById("nav"), burger = document.getElementById("burger");
const onScroll = () => nav && nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
if (burger) {
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll("#links a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));
}

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".rv, #steps").forEach(el => io.observe(el));

/* card tilt */
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (fine && !still) document.querySelectorAll("[data-tilt]").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
  });
  c.addEventListener("mouseleave", () => c.style.transform = "");
});

/* starfield + drifting aurora */
(() => {
  const cv = document.getElementById("sky"); if (!cv) return;
  const ctx = cv.getContext("2d"); let w, h, dpr, stars = [], t = 0, my = 0;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(w * h / 5200);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .2, z: Math.random() * .8 + .2, p: Math.random() * 6.28 }));
  }
  function blob(x, y, r, c) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, "transparent"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function draw() {
    t += .004; ctx.fillStyle = "#07080c"; ctx.fillRect(0, 0, w, h);
    const s = Math.max(w, h);
    blob(w * (.2 + .06 * Math.sin(t)), h * (.15 + .05 * Math.cos(t * .8)) - my * .05, s * .55, "rgba(246,182,42,.07)");
    blob(w * (.85 + .05 * Math.cos(t * .7)), h * (.55 + .06 * Math.sin(t)) - my * .08, s * .5, "rgba(56,199,255,.06)");
    blob(w * .5, h * 1.05, s * .45, "rgba(255,122,26,.04)");
    for (const st of stars) {
      const y = (st.y - my * st.z * .15) % h, yy = y < 0 ? y + h : y;
      ctx.globalAlpha = (.35 + .65 * Math.abs(Math.sin(t * 3 * st.z + st.p))) * st.z;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(st.x, yy, st.r, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!still) requestAnimationFrame(draw);
  }
  addEventListener("resize", size); addEventListener("scroll", () => { my = scrollY; if (still) draw(); }, { passive: true });
  size(); draw();
})();
