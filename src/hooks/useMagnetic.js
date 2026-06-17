import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useShouldAnimate } from "./useShouldAnimate";

export function useMagnetic(options = {}) {
  const ref = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useEffect(() => {
    const element = ref.current;
    if (!element || !shouldAnimate) return;

    // Disable magnetic effect on mobile/touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const strength = options.strength || 30;
    const textStrength = options.textStrength || 15;
    
    // Check if there is an inner text span to animate separately for depth
    const textElement = element.querySelector(".magnetic_text");

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      // Calculate mouse position relative to the center of the element
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(element, {
        x: (x / rect.width) * strength,
        y: (y / rect.height) * strength,
        ease: "power2.out",
        duration: 0.3,
      });

      if (textElement) {
        gsap.to(textElement, {
          x: (x / rect.width) * textStrength,
          y: (y / rect.height) * textStrength,
          ease: "power2.out",
          duration: 0.3,
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)",
        duration: 0.8,
      });

      if (textElement) {
        gsap.to(textElement, {
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.3)",
          duration: 0.8,
        });
      }
    };

    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseleave", onMouseLeave);

    return () => {
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [shouldAnimate, options.strength, options.textStrength]);

  return ref;
}
