import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import "../styles/cooperativeChoice.css";
import FeatureModal from "./FeatureModal";
import BookingModal from "./BookingModal";

gsap.registerPlugin(ScrollTrigger);

const OPTIONS = [
  {
    id: "offline",
    label: "OFFLINE",
    image: "/assets/images/offlinelaptop.png",
    alt: "CORA offline desktop application",
    variant: "outline",
    headline: "Built for areas where internet is not guaranteed.",
    description: "Keep your cooperative running on a local system with on-premise control, no monthly dependency, and CDA-ready reports when connectivity is limited.",
    features: ["No internet required for daily operations", "Complete physical control of your data", "One-time installation", "Direct offline CDA exports"],
    cta: "Get Offline CORA",
  },
  {
    id: "online",
    label: "ONLINE",
    image: "/assets/images/onlinelaptop.png",
    alt: "CORA online web application",
    variant: "filled",
    headline: "Access your cooperative records from anywhere.",
    description: "Use CORA through the browser with real-time updates, cloud backups, and multi-user collaboration for teams that need flexibility.",
    features: ["Work from home or any branch", "Instant updates across all users", "Secure, automated cloud backups", "No local server maintenance"],
    cta: "Try Online CORA",
  },
];

function CooperativeChoice() {
  const [activeModal, setActiveModal] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const shouldAnimate = useShouldAnimate();
  const scopeRef = useRef(null);
  const laptop0Ref = useRef(null); // offline laptop
  const laptop1Ref = useRef(null); // online laptop
  const sectionBgRef = useRef(null);

  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      gsap.fromTo(
        [scopeRef.current.querySelector(".choice_eyebrow"),
         scopeRef.current.querySelector(".choice_title"),
         scopeRef.current.querySelector(".choice_intro")],
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current,
            start: "top 90%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });
    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  // ── Apple product reveal: laptops scale up & tilt in as section enters viewport ──
  useGSAP(() => {
    if (!shouldAnimate) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Offline laptop: swoops in from left-bottom with heavy 3D tilt + blur
      if (laptop0Ref.current) {
        gsap.fromTo(
          laptop0Ref.current,
          { rotateY: -40, rotateX: 15, scale: 0.72, opacity: 0, x: -100, filter: "blur(12px)" },
          {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: ".choice_grid",
              start: "top 95%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      }

      // Online laptop: swoops in from right-bottom
      if (laptop1Ref.current) {
        gsap.fromTo(
          laptop1Ref.current,
          { rotateY: 40, rotateX: 15, scale: 0.72, opacity: 0, x: 100, filter: "blur(12px)" },
          {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: ".choice_grid",
              start: "top 90%", // slight stagger
              end: "top 25%",
              scrub: 1.2,
            },
          }
        );
      }

      // Scrubbed parallax — stronger drift
      if (sectionBgRef.current) {
        gsap.to(sectionBgRef.current, {
          yPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // Hover 3D tilt on each laptop card — more dramatic range
      [laptop0Ref.current, laptop1Ref.current].forEach((el, i) => {
        if (!el) return;
        const dir = i === 0 ? -1 : 1;
        el.addEventListener("mouseenter", () => {
          gsap.to(el, { rotateY: dir * 10, rotateX: -6, scale: 1.05, duration: 0.4, ease: "power3.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        });
      });
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  const handleBookDemo = () => {
    setActiveModal(null);
    setIsBookingOpen(true);
  };

  const laptopRefs = [laptop0Ref, laptop1Ref];

  return (
    <>
      <section className="choice" ref={scopeRef}>
        {/* Parallax background layer */}
        <div className="choice_parallax_bg" ref={sectionBgRef} aria-hidden="true" />

        <div className="choice_container">
          <p className="choice_eyebrow">Your Cooperative · Your Choice</p>
          <h2 className="choice_title">
            <span>Choose the setup that fits</span>
            <span>your cooperative today.</span>
          </h2>
          <p className="choice_intro">
            Whether your office needs offline reliability or cloud flexibility, CORA adapts to the way your cooperative actually works.
          </p>

          <div className="choice_options">
            {OPTIONS.map((option, idx) => (
              <article key={option.id} className="choice_option">
                <button
                  type="button"
                  className={`choice_tab choice_tab--${option.variant}`}
                  onClick={() => setActiveModal(option.id)}
                >
                  {option.label}
                </button>
                {/* Apple product reveal wrapper with 3D perspective */}
                <div className="choice_laptop_perspective">
                  <div
                    className="choice_laptop_wrap"
                    ref={laptopRefs[idx]}
                    onClick={() => setActiveModal(option.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${option.label} features`}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveModal(option.id); }}
                  >
                    <img
                      src={option.image}
                      alt={option.alt}
                      className="choice_laptop"
                    />
                    <div className="choice_laptop_hint">
                      <span>View Features</span>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="choice_copy">
                  <h3>{option.headline}</h3>
                  <p>{option.description}</p>
                  <ul>
                    {option.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <div className="choice_cta_wrapper">
                    <button type="button" className="choice_cta choice_cta--outlined" onClick={() => setActiveModal(option.id)}>
                      {option.cta}
                    </button>
                    <p style={{ fontSize: "12px", color: "#6e6e73", marginTop: "8px", fontWeight: "500", textAlign: "center" }}>No commitment. Free demo included.</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="choice_description">
            <strong>Not sure which one you need?</strong> Check our <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); }} style={{ color: "#e07b00", textDecoration: "underline" }}>FAQ below</a>, or book a free demo and we'll recommend the setup based on your internet reliability, team size, and reporting needs.
          </p>
        </div>
      </section>

      {activeModal && (
        <FeatureModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onBookDemo={handleBookDemo}
        />
      )}

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}

export default CooperativeChoice;
