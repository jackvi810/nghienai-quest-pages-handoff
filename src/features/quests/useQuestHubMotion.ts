import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = "power3.out";

/** Scroll-only motion for the Quest Hub. It never targets the campaign detail route. */
export function useQuestHubMotion(): RefObject<HTMLElement | null> {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const reveal = (selector: string, vars: gsap.TweenVars = {}) => {
        const targets = gsap.utils.toArray<HTMLElement>(selector);
        if (!targets.length) return;

        gsap.from(targets, {
          autoAlpha: 0,
          y: 18,
          duration: 0.52,
          stagger: 0.07,
          ease,
          immediateRender: false,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: targets[0], start: "top 88%", once: true },
          ...vars,
        });
      };

      const metricValues = gsap.utils.toArray<HTMLElement>(".hub-metrics__number");
      if (metricValues.length) {
        gsap.from(".hub-metric", {
          autoAlpha: 0,
          y: 12,
          duration: 0.42,
          stagger: 0.06,
          ease,
          clearProps: "transform,opacity,visibility",
        });
        metricValues.forEach((element) => {
          const target = Number(element.dataset.hubCount ?? 0);
          const prefix = element.dataset.hubPrefix ?? "";
          const suffix = element.dataset.hubSuffix ?? "";
          const configuredMinimumDigits = Number(element.dataset.hubMinDigits ?? 1);
          const minimumIntegerDigits = Math.min(21, Math.max(1, configuredMinimumDigits || 1));
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 0.9,
            ease,
            onUpdate: () => {
              element.textContent = `${prefix}${Math.round(counter.value).toLocaleString("vi-VN", { minimumIntegerDigits })}${suffix}`;
            },
          });
        });
      }

      reveal(".hub-featured__carousel, .hub-featured__content", { y: 12, duration: 0.5, stagger: 0.06 });
      reveal(".hub-discover .hub-heading, .hub-discover .hub-discover__toolbar", { y: 12, duration: 0.42 });
      reveal(".hub-discover .hub-catalog__motion", { y: 14, duration: 0.46, stagger: 0.07 });
      reveal(".hub-personal__active, .hub-personal__empty", { y: 12, duration: 0.44 });
      reveal(".hub-leaderboard .hub-heading", { y: 12, duration: 0.42 });
      reveal(".hub-leaderboard__tile", { y: 0, duration: 0.34, stagger: 0.008 });
      reveal(".hub-leaderboard__detail", { y: 10, duration: 0.42 });

      reveal(".hub-partner__photo", { clipPath: "inset(0 0 100% 0)", y: 0, duration: 0.72, clearProps: "clipPath" });
      reveal(".hub-partner__content > :not(.hub-partner__logos)", { y: 14, duration: 0.45, stagger: 0.07 });
      reveal(".hub-partner__logos img", { y: 10, duration: 0.3, stagger: 0.045 });
    }, root);

    return () => context.revert();
  }, []);

  return rootRef;
}
