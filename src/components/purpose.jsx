import { useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import { useTextReveal } from "../hooks/useTextReveal";
import { useParallax } from "../hooks/useParallax";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "../styles/purpose.css";

gsap.registerPlugin(ScrollTrigger);

const PURPOSE_PILLARS = [
  {
    label: "Accuracy",
    title: "Numbers your board can stand behind during audits",
    text: "Every transaction, savings balance, and loan detail connects seamlessly. Walk into your next board meeting or CDA inspection knowing exactly where every peso is.",
  },
  {
    label: "Compliance",
    title: "CDA inspections without the last-minute panic",
    text: "Stop rebuilding reports from scattered spreadsheets. Your records are organized exactly how the CDA expects them, ready to export in one click.",
  },
  {
    label: "Transparency",
    title: "Clear records that build member trust",
    text: "When members ask about their dividends or loan balances, give them instant, accurate answers. Build confidence with records that are always up to date.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "See your workflow",
    text: "Book a free demo and we will map CORA directly to how your cooperative's actual office runs.",
  },
  {
    step: "02",
    title: "Set up your records",
    text: "We organize and migrate your scattered member, savings, and loan data into one clean foundation.",
  },
  {
    step: "03",
    title: "Run with confidence",
    text: "Your team generates CDA-ready reports instantly and manages loans and savings without the stress.",
  },
];

function Purpose() {
  const scopeRef = useRef(null);
  const pillarsRef = useRef(null);
  const shouldAnimate = useShouldAnimate();
  // Kinetic word-by-word reveal on the big headline
  const titleRef = useTextReveal({ start: "top 82%", rotate: true });
  // Gentle parallax on the decorative background layer
  const bgParallaxRef = useParallax(0.25);

  // Staggered 3D card reveals for pillars
  useGSAP(() => {
    if (!shouldAnimate || !pillarsRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const cards = pillarsRef.current.querySelectorAll(".purpose_pillar");
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 100,
          rotateX: 20,
          scale: 0.85,
          filter: "blur(8px)",
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 95%",
            end: "top 30%",
            scrub: 1.2,
          },
        }
      );
    });

    mm.add("(max-width: 768px)", () => {
      const cards = pillarsRef.current.querySelectorAll(".purpose_pillar");
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: "top 90%",
          end: "top 50%",
          scrub: 1,
        },
      });
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  // Steps slide in from the left sequentially
  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const steps = scopeRef.current.querySelectorAll(".purpose_step");
      gsap.fromTo(steps,
        { opacity: 0, x: -60, filter: "blur(4px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          stagger: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current.querySelector(".purpose_steps"),
            start: "top 95%",
            end: "top 40%",
            scrub: 1.2,
          },
        }
      );
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  return (
    <section className="purpose" id="purpose" ref={scopeRef}>
      {/* Decorative parallax background blob */}
      <div className="purpose_bg_blob" ref={bgParallaxRef} aria-hidden="true" />

      <div className="purpose_container">
        <p className="purpose_label reveal">Why CORA Exists</p>
        <h2 className="purpose_title" ref={titleRef}>
          We built CORA for the people who keep cooperatives moving.
        </h2>
        <p className="purpose_text reveal">
          We watched cooperative treasurers, bookkeepers, and board officers spend entire weekends reconciling records that should have been simple. CORA exists to turn that pressure into momentum — giving your team cleaner data, faster reports, and the confidence to serve members better.
        </p>

        <div className="purpose_pillars" ref={pillarsRef}>
          {PURPOSE_PILLARS.map((pillar) => (
            <article className="purpose_pillar" key={pillar.label}>
              <span className="purpose_pillar_label">{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>

        <div className="purpose_steps">
          <div className="purpose_steps_header reveal">
            <p>How it works</p>
            <h3>From manual stress to managed momentum in three clear steps.</h3>
          </div>
          {HOW_IT_WORKS.map((item) => (
            <article className="purpose_step" key={item.step}>
              <span>{item.step}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Purpose;
