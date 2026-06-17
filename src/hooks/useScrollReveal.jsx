import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useShouldAnimate } from "./useShouldAnimate";

export function useScrollReveal(
  scopeRef,
  enter = {},
  stagger = 0.08,
  mobileStagger
) {
  const shouldAnimate = useShouldAnimate();
  const internalRef = useRef(null);

  useGSAP(
    () => {
      if (!shouldAnimate) return;
      const root = scopeRef?.current || internalRef.current;
      if (!root) return;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const effectiveStagger = isMobile ? (mobileStagger ?? 0.05) : stagger;
      const start = isMobile ? "top 82%" : "top 78%";
      const duration = isMobile ? 0.55 : 0.75;

      const nodes = root.querySelectorAll(".reveal");
      if (!nodes || !nodes.length) return;

      gsap.from(nodes, {
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
          scroller: window,
        },
        y: 32,
        opacity: 0,
        duration,
        stagger: effectiveStagger,
        ease: "power3.out",
        ...enter,
      });
    },
    { scope: scopeRef || internalRef }
  );
}
