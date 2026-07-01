import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTextReveal } from "../hooks/useTextReveal";
import { useShouldAnimate } from "../hooks/useShouldAnimate";

import "../styles/partners.css";

const COOPERATIVES = [
  {
    logo: "/assets/logos/FACC.png",
    name: "Federation of Agricultural Cooperatives in Camarines Sur",
    abbr: "FACCS",
  },
  {
    logo: "/assets/logos/LACO.png",
    name: "La Consolacion College Multi-Purpose Cooperative",
    abbr: "LACO MPC",
  },
  {
    logo: "/assets/logos/NBAC.png",
    name: "Natures Bounty Agriculture Cooperative",
    abbr: "NBAC",
  },
  {
    logo: "/assets/logos/BIKOLANAS.png",
    name: "Bikolanas Agriculture Cooperative",
    abbr: "BAC",
  },
  {
    logo: "/assets/logos/CDO.png",
    name: "CDO-Treatment and Rehabilitation Center Employees Credit Cooperative",
    abbr: "CDO-TRECCO",
  },
  {
    logo: "/assets/logos/MAHARLIKA.png",
    name: "Royal Maharlika United Family Savings Credit Cooperative",
    abbr: "MAHARLIKA",
  },
  {
    logo: "/assets/logos/SEMCO.png",
    name: "State Employees Multi-Purpose Cooperative",
    abbr: "SEMCO",
  },
];

gsap.registerPlugin(ScrollTrigger);

function Partners() {
  const scopeRef = useRef(null);
  const shouldAnimate = useShouldAnimate();
  const headlineRef = useTextReveal({ start: "top 85%" });

  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const cards = gsap.utils.toArray(".partners_card");
      
      gsap.fromTo(cards, 
        {
          y: 120,
          scale: 0.85,
          rotateX: -25,
          opacity: 0,
          filter: "blur(6px)",
        },
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".partners_grid_wrap",
            start: "top 95%",
            end: "top 30%",
            scrub: 1.2,
          }
        }
      );
    });

    mm.add("(max-width: 768px)", () => {
      gsap.from(".partners_card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".partners_grid_wrap",
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        }
      });
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  return (
    <section className="partners" id="partners" ref={scopeRef}>
      <div className="partners_header">
        <p className="partners_eyebrow">Trusted By</p>
        <h2 className="partners_headline" ref={headlineRef}>
          Cooperatives across Bicol already choose CORA.
        </h2>
        <p className="partners_subtext">
          Trusted by agricultural federations and multi-purpose cooperatives that need accurate records, faster reporting, and calmer compliance.
        </p>
      </div>

      <div className="partners_grid_wrap">
        <div className="partners_row">
          {COOPERATIVES.map((c) => (
            <div key={c.abbr} className="partners_chip" title={c.name}>
              <img src={c.logo} alt={c.name} className="partners_chip_logo" />
              <span className="partners_chip_name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
