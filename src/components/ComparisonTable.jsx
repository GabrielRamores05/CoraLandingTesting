import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import "../styles/ComparisonTable.css";

gsap.registerPlugin(ScrollTrigger);

const COMPARISONS = [
  {
    title: "Manual & Spreadsheets",
    subtitle: "The old way",
    theme: "manual",
    points: [
      { text: "Prone to record errors", positive: false },
      { text: "Weeks to prepare CDA reports", positive: false },
      { text: "No real-time visibility of funds", positive: false },
    ],
  },
  {
    title: "Generic Software",
    subtitle: "Off-the-shelf systems",
    theme: "generic",
    points: [
      { text: "Not built for Philippine cooperatives", positive: false },
      { text: "Requires heavy customization", positive: false },
      { text: "Offshore, slow customer support", positive: false },
    ],
  },
  {
    title: "CORA",
    subtitle: "The better way",
    theme: "cora",
    points: [
      { text: "1-Click CDA-ready reports", positive: true },
      { text: "Automated member & loan tracking", positive: true },
      { text: "Dedicated local support team", positive: true },
    ],
  },
];

function CheckIcon() {
  return (
    <div className="ct_icon ct_icon_check">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function CrossIcon() {
  return (
    <div className="ct_icon ct_icon_cross">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  );
}

function ComparisonTable() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useGSAP(() => {
    if (!shouldAnimate || !cardsRef.current) return;
    
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const cards = cardsRef.current.querySelectorAll(".ct_card");
      
      // Apple-style product reveal: Cards tilt up and scale from a 3D perspective as you scroll
      gsap.fromTo(cards, 
        { 
          y: 80, 
          rotateX: 15, 
          scale: 0.9, 
          opacity: 0,
          filter: "blur(6px)"
        },
        {
          y: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 95%",
            end: "top 35%",
            scrub: 1.2,
          }
        }
      );
    });

    mm.add("(max-width: 768px)", () => {
      const cards = cardsRef.current.querySelectorAll(".ct_card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [shouldAnimate] });

  return (
    <section className="ct_section" ref={sectionRef}>
      <div className="ct_container">
        <div className="ct_header">
          <p className="ct_eyebrow">Why Choose CORA</p>
          <h2 className="ct_title">A Friendlier Way to Manage.</h2>
          <p className="ct_sub">
            Skip the headaches of missing records and complex systems. We built CORA specifically to make cooperative management simple, clear, and painless.
          </p>
        </div>

        <div className="ct_cards" ref={cardsRef}>
          {COMPARISONS.map((col, i) => (
            <div key={i} className={`ct_card ct_card--${col.theme}`}>
              <div className="ct_card_header">
                <p className="ct_card_subtitle">{col.subtitle}</p>
                <h3 className="ct_card_title">{col.title}</h3>
              </div>
              <ul className="ct_card_list">
                {col.points.map((pt, j) => (
                  <li key={j} className="ct_card_item">
                    {pt.positive ? <CheckIcon /> : <CrossIcon />}
                    <span>{pt.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ComparisonTable;
