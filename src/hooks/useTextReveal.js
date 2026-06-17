import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "./useShouldAnimate";

gsap.registerPlugin(ScrollTrigger);

/**
 * useTextReveal — Dramatic kinetic word-by-word typography.
 * Each word slides up from a clipped "slot" with blur + rotate.
 * Far more noticeable than a plain fade.
 */
export function useTextReveal(options = {}) {
  const containerRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useEffect(() => {
    if (!shouldAnimate || !containerRef.current) return;

    const element = containerRef.current;
    if (element.classList.contains("is-split")) return;

    const originalHTML = element.innerHTML;

    const childNodes = Array.from(element.childNodes);
    element.innerHTML = "";

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/\s+/).filter(Boolean);
        words.forEach((word, i) => {
          const wordWrap = document.createElement("span");
          wordWrap.style.display = "inline-block";
          wordWrap.style.overflow = "hidden";
          wordWrap.style.paddingBottom = "0.12em";
          wordWrap.style.verticalAlign = "bottom";

          const wordInner = document.createElement("span");
          wordInner.style.display = "inline-block";
          wordInner.className = "reveal-word";
          wordInner.innerText = word;

          wordWrap.appendChild(wordInner);
          element.appendChild(wordWrap);

          // Use a physical space so the browser can collapse it at line ends
          // This ensures text-align: center works perfectly without trailing width offsets
          if (i < words.length - 1 || node.textContent.match(/\s$/)) {
            element.appendChild(document.createTextNode(" "));
          }
        });
      } else if (node.nodeName === "BR") {
        element.appendChild(document.createElement("br"));
      } else {
        element.appendChild(node.cloneNode(true));
      }
    });

    element.classList.add("is-split");

    return () => {
      element.innerHTML = originalHTML;
      element.classList.remove("is-split");
    };
  }, [shouldAnimate]);

  useGSAP(() => {
    if (!shouldAnimate || !containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".reveal-word");
    if (!words.length) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Desktop: dramatic — full 110% rise, rotate, and blur
      gsap.fromTo(
        words,
        {
          yPercent: 110,
          opacity: 0,
          rotateZ: options.rotate !== false ? 4 : 0,
          filter: "blur(4px)",
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
          stagger: 0.055,
          scrollTrigger: {
            trigger: containerRef.current,
            start: options.start || "top 88%",
          },
        }
      );
    });

    // Mobile: still very visible but lighter
    mm.add("(max-width: 768px)", () => {
      gsap.fromTo(
        words,
        { yPercent: 80, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 92%",
          },
        }
      );
    });

    return () => mm.revert();
  }, [shouldAnimate, options]);

  return containerRef;
}
