'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText, useGSAP);

// ===================== HERO =====================
interface HeroProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
  microDetails?: Array<string>;
}
export default function Hero({
  title,
  description,
  badgeText = "Generative Surfaces",
  badgeLabel = "New",
  ctaButtons = [
    { text: "Get started", href: "#get-started", primary: true },
    { text: "View showcase", href: "#showcase" }
  ],
  microDetails = ["Low\u2011weight font", "Tight tracking", "Subtle motion"]
}: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const microItem1Ref = useRef<HTMLLIElement | null>(null);
  const microItem2Ref = useRef<HTMLLIElement | null>(null);
  const microItem3Ref = useRef<HTMLLIElement | null>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      try {
        document.fonts.ready.then(() => {
          try {
            const split = new SplitText(headerRef.current!, {
              type: 'lines',
              wordsClass: 'lines',
            });
            gsap.set(split.lines, {
              filter: 'blur(16px)',
              yPercent: 30,
              autoAlpha: 0,
              scale: 1.06,
              transformOrigin: '50% 100%',
            });
            if (badgeRef.current) gsap.set(badgeRef.current, { autoAlpha: 0, y: -8 });
            if (paraRef.current) gsap.set(paraRef.current, { autoAlpha: 0, y: 8 });
            if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 });
            const microItems = [microItem1Ref.current, microItem2Ref.current, microItem3Ref.current].filter(Boolean);
            if (microItems.length > 0) gsap.set(microItems, { autoAlpha: 0, y: 6 });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            if (badgeRef.current) tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.0);
            tl.to(split.lines, { filter: 'blur(0px)', yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.15 }, 0.1);
            if (paraRef.current) tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.55');
            if (ctaRef.current) tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35');
            if (microItems.length > 0) tl.to(microItems, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.25');
          } catch {
            // SplitText failed — make sure everything is visible
            [badgeRef, paraRef, ctaRef].forEach(r => { if (r.current) gsap.set(r.current, { autoAlpha: 1, y: 0 }); });
            [microItem1Ref, microItem2Ref, microItem3Ref].forEach(r => { if (r.current) gsap.set(r.current, { autoAlpha: 1, y: 0 }); });
          }
        });
      } catch {
        // fonts.ready failed — everything stays visible via CSS defaults
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400"
    >
      {/* Radial overlays for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(59,130,246,0.5),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(139,92,246,0.4),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(6,182,212,0.25),transparent)]" />

      {/* Bottom fade to white */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 pb-16 pt-28 sm:gap-6 sm:px-6 sm:pb-24 sm:pt-36 md:gap-8 md:px-10 md:pt-44 lg:px-16">
        <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-[10px] font-light uppercase tracking-[0.08em] text-white/80">{badgeLabel}</span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span className="text-[11px] font-light tracking-tight text-white/90 sm:text-xs">{badgeText}</span>
        </div>
        <h1 ref={headerRef} className="max-w-[90vw] text-left text-[clamp(2rem,8vw,4.5rem)] font-extralight leading-[1.08] tracking-tight text-white sm:max-w-2xl">
          {title}
        </h1>
        <p ref={paraRef} className="max-w-[90vw] text-left text-sm font-light leading-relaxed tracking-tight text-white/85 sm:max-w-xl sm:text-base md:text-lg">
          {description}
        </p>
        <div ref={ctaRef} className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {ctaButtons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              className={`rounded-2xl border px-5 py-3 text-center text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 sm:text-sm ${
                button.primary
                  ? "border-white/20 bg-white text-indigo-600 hover:bg-white/90"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {button.text}
            </a>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-4 text-[11px] font-extralight tracking-tight text-white/70 sm:mt-8 sm:gap-6 sm:text-xs">
          {microDetails.map((detail, index) => {
            const refMap = [microItem1Ref, microItem2Ref, microItem3Ref];
            return (
              <li key={index} ref={refMap[index]} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/50" /> {detail}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
