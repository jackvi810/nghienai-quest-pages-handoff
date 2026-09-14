import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = "power3.out";

/**
 * Motion that belongs to reading the page: entrances and scroll reveals.
 * Component state (carousel, task results, accordion) stays with Framer Motion.
 */
export function useQuestMotion(): RefObject<HTMLDivElement | null> {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let media: gsap.MatchMedia | undefined;
    const context = gsap.context(() => {
      const appear = (selector: string, vars: gsap.TweenVars = {}) => {
        const targets = gsap.utils.toArray<HTMLElement>(selector);
        if (!targets.length) return;
        gsap.from(targets, {
          autoAlpha: 0,
          y: 18,
          duration: 0.56,
          ease,
          stagger: 0.065,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: targets[0], start: "top 87%", once: true },
          ...vars,
        });
      };

      const header = document.querySelector("header");
      if (header) {
        gsap.from(header, {
          autoAlpha: 0,
          y: -10,
          duration: 0.38,
          ease,
          clearProps: "transform,opacity,visibility",
        });
      }

      const hero = gsap.timeline({ defaults: { ease } });
      hero
        .from(".quest-breadcrumb", { autoAlpha: 0, x: -14, duration: 0.28 })
        .from(".detail-kicker", { autoAlpha: 0, y: 10, duration: 0.26 }, "-=0.13")
        .from(".detail-live--brief", { autoAlpha: 0, y: 8, duration: 0.26 }, "<")
        .from(".detail-intro h1", { autoAlpha: 0, y: 26, duration: 0.48 }, "-=0.08")
        .from(".detail-intro > p", { autoAlpha: 0, y: 14, duration: 0.3 }, "-=0.25")
        .from(".detail-meta--brief > div", { autoAlpha: 0, y: 12, duration: 0.28, stagger: 0.05 }, "-=0.14")
        .from(".detail-action-row", { autoAlpha: 0, y: 12, duration: 0.28 }, "<")
        .from(".detail-gallery--campaign", { autoAlpha: 0, scale: 0.985, duration: 0.42 }, "-=0.16")
        .from(".detail-carousel-index", { autoAlpha: 0, y: -6, duration: 0.2 }, "-=0.08");

      media = gsap.matchMedia();
      media.add("(min-width: 901px)", () => {
        appear(".sponsor-strip", { x: -18, y: 0, duration: 0.62 });
        appear(".sponsor-logo", { scale: 0.88, y: 0, duration: 0.45 });
        appear(".sponsor-links a", { y: 8, stagger: 0.05, duration: 0.32 });
        appear(".campaign-dossier__head", { x: -16, y: 0 });
        appear(".campaign-dossier__item", { y: 12, stagger: 0.05, duration: 0.44 });
        appear(".quest-panel--tasks .panel-heading", { y: 14 });
        appear(".quest-panel--tasks .quest-step", { y: 14, stagger: 0.05, duration: 0.44 });
        appear(".leaderboard", { x: 16, y: 0 });
        appear(".leader", { y: 10, stagger: 0.055, duration: 0.36 });
        appear(".progress-panel", { y: 14 });
        appear(".progress-community__signals > div", { y: 9, stagger: 0.05, duration: 0.34 });
        appear(".progress-rail__item", { scale: 0.9, y: 0, stagger: 0.04, duration: 0.3 });
      });

      media.add("(max-width: 900px)", () => {
        appear(".sponsor-strip, .campaign-dossier__head", { y: 12, duration: 0.42 });
        appear(".quest-panel--tasks .panel-heading, .detail-content-sidebar > .quest-panel", {
          y: 12,
          duration: 0.42,
        });
      });

      appear(".related-quests__head", { y: 14 });
      const cards = gsap.utils.toArray<HTMLElement>(".related-quest");
      if (cards.length) {
        gsap.from(cards, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.58,
          stagger: 0.08,
          ease,
          scrollTrigger: { trigger: cards[0], start: "top 87%", once: true },
          clearProps: "clipPath",
        });
      }

      const footer = root.closest("body")?.querySelector("footer");
      if (footer) {
        gsap.from(footer, {
          autoAlpha: 0,
          y: 16,
          duration: 0.5,
          ease,
          scrollTrigger: { trigger: footer, start: "top 96%", once: true },
          clearProps: "transform,opacity,visibility",
        });
      }

    }, root);

    return () => {
      media?.revert();
      context.revert();
    };
  }, []);

  return rootRef;
}
