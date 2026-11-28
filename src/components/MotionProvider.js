"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, inView, hover } from "motion";

gsap.registerPlugin(ScrollTrigger);

// Kartu yang masuk dengan animasi (Motion) dan terangkat saat di-hover.
const CARDS = ".mcard,.pcard,.lomba-card,.xp-card,.bt,.adv-card,.tk-card,.ds-card,.ds-box,.pd-card,.idcard,.order,.dprofile,.mentor-cta,.mk-side,.auth-card";
// Kartu yang tidak ikut terangkat saat hover (sudah punya gaya sendiri / besar).
const NO_LIFT = ".order,.dprofile,.idcard,.mentor-cta,.ds-box,.auth-card,.mk-side,.mprofile .card";
// Blok yang muncul pelan saat discroll (GSAP ScrollTrigger).
const BLOCKS = ".lp-head,.pd-h2,.section>h2,.section>.row>h2,.mprofile+h2,.lp-cta,.band-fun .xp-more,.video-profile,.faq,.faq-item";
const EASE = [0.22, 1, 0.36, 1];

export default function MotionProvider({ children }) {
  const path = usePathname();

  // 1) Lenis: scroll halus, disambungkan ke ScrollTrigger lewat ticker GSAP.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, anchors: { offset: -80 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null; };
  }, []);

  // 2) Tiap pindah halaman: kembali ke atas dengan halus, lalu pasang animasi untuk isi halaman baru.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.location.hash) { if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0); }
    if (reduce) return;

    const stops = [];
    const done = new WeakSet();

    const setupCard = (el, i) => {
      if (done.has(el) || el.closest("[data-no-motion]")) return;
      done.add(el);
      const delay = Math.min(i % 6, 5) * 0.06;
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      const stop = inView(el, () => {
        animate(el, { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] }, { duration: 0.55, delay, ease: EASE })
          .finished.then(() => { el.style.opacity = ""; el.style.transform = ""; });
      }, { amount: 0.12, margin: "0px 0px -6% 0px" });
      stops.push(stop);
      if (!el.matches(NO_LIFT)) {
        stops.push(hover(el, () => {
          animate(el, { transform: "translateY(-5px)" }, { duration: 0.25, ease: EASE });
          return () => animate(el, { transform: "translateY(0px)" }, { duration: 0.35, ease: EASE });
        }));
      }
    };

    const setupBlock = (el) => {
      if (done.has(el)) return;
      done.add(el);
      gsap.fromTo(el, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    };

    const scan = (root) => {
      root.querySelectorAll?.(CARDS).forEach((el, i) => setupCard(el, i));
      root.querySelectorAll?.(BLOCKS).forEach(setupBlock);
    };

    // Tunggu hydration React selesai dulu, supaya atribut style tidak berbeda dari HTML server.
    let pt, mo;
    const start = () => {
    // Parallax ringan untuk ilustrasi header
    const hero = document.querySelector(".hero-bg svg, .hs-art, .lp-hero .sky");
        if (hero) pt = gsap.to(hero, { yPercent: 8, ease: "none", scrollTrigger: { trigger: hero.parentElement || hero, start: "top top", end: "bottom top", scrub: 0.6 } });

    scan(document);
    // Konten yang dimuat belakangan (data dari localStorage / API) juga ikut dianimasikan.
    mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.matches?.(CARDS)) setupCard(n, 0); scan(n); } });
      ScrollTrigger.refresh();
    });
    mo.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });

    };
    const timer = setTimeout(start, 350);

    return () => { clearTimeout(timer); mo?.disconnect(); stops.forEach((s) => s && s()); pt?.scrollTrigger?.kill(); pt?.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [path]);

  return children;
}
