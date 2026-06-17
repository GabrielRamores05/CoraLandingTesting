import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "./useShouldAnimate";

gsap.registerPlugin(ScrollTrigger);

export function useParallax(speed = 1, options = {}) {
  const ref = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useGSAP(() => {
    if (!shouldAnimate || !ref.current) return;

    // Use GSAP matchMedia to only apply parallax on non-mobile devices
    // Parallax on touch devices often causes jitter due to mobile browser scroll handling
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const yValue = 100 * speed;

      gsap.fromTo(
        ref.current,
        {
          y: -yValue,
        },
        {
          y: yValue,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || "top bottom", // when top of element hits bottom of viewport
            end: options.end || "bottom top",     // when bottom of element hits top of viewport
            scrub: options.scrub || true,
          },
        }
      );
    });

    return () => mm.revert();
  }, [shouldAnimate, speed]);

  return ref;
}
