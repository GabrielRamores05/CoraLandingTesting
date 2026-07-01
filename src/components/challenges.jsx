import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import { useTextReveal } from "../hooks/useTextReveal";
import "../styles/challenges.css";
import BookingModal from "./BookingModal";

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
  {
    id: "operations",
    title: "Slow and Messy Operations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    content: {
      heading: "Turn scattered daily work into one smooth flow",
      description: "When member requests, approvals, payments, and reports live in different notebooks or spreadsheets, every task takes longer than it should. CORA keeps the work visible, ordered, and easy to finish without chasing papers across the office.",
      relief: "One shared workspace. Approvals, requests, and updates visible to the right person at the right time — no chasing.",
    }
  },
  {
    id: "records",
    title: "Outdated Systems and Records",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v14H4V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    content: {
      heading: "Replace stale records with one trusted source of truth",
      description: "Old files and manually updated sheets make it hard to know which number is correct. CORA centralizes member, savings, loan, and accounting data so officers can make decisions from records that stay current and consistent.",
      relief: "A single source of truth. Every savings balance, loan detail, and member record stays connected and current.",
    }
  },
  {
    id: "communications",
    title: "Slow Communications & Connectivity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12a4 4 0 1 1 8 0v1.5c0 .83.67 1.5 1.5 1.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10V8a6 6 0 0 1 12 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    content: {
      heading: "Keep your cooperative moving even when connection is slow",
      description: "Delayed announcements and missed follow-ups slow down service. CORA helps your team stay aligned with clear records, quick updates, and an offline-ready workflow that keeps operations moving when internet access is unreliable.",
      relief: "Offline-ready workflows. Your team stays aligned with or without strong connectivity — data syncs when you're back online.",
    }
  },
  {
    id: "compliance",
    title: "CDA Compliance Hassle",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 4h10v16H7V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8h4M10 11h4M10 14h4M10 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    content: {
      heading: "Make compliance reporting feel organized, not overwhelming",
      description: "Preparing reports at inspection time can turn into late nights and last-minute corrections. CORA structures your records around cooperative workflows so CDA-ready reports are easier to review, export, and explain.",
      relief: "CDA-ready reports in one click. Organized, exportable, and easy to explain — even under inspection pressure.",
    }
  },
];

function Challenges() {
  const [activeId, setActiveId] = useState(CHALLENGES[0].id);
  const [expandedId, setExpandedId] = useState(CHALLENGES[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldAnimate = useShouldAnimate();
  const scopeRef = useRef(null);
  const rightRef = useRef(null);
  const ambientRef = useRef(null);
  const headingRef = useTextReveal({ start: "top 88%" });

  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      // Challenge cards stagger up from below — scrubbed
      gsap.fromTo(
        scopeRef.current.querySelectorAll(".challenge_card"),
        { opacity: 0, y: 60, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current.querySelector(".challenges_layout"),
            start: "top 95%",
            end: "top 40%",
            scrub: 1.1,
          },
        }
      );
      // Right panel slides in from right — scrubbed
      gsap.fromTo(
        scopeRef.current.querySelector(".challenges_right"),
        { opacity: 0, x: 60, filter: "blur(6px)" },
        {
          opacity: 1, x: 0, filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current.querySelector(".challenges_layout"),
            start: "top 90%",
            end: "top 35%",
            scrub: 1.2,
          },
        }
      );
    });
    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  // Scrubbed parallax on the ambient ghost text
  useGSAP(() => {
    if (!shouldAnimate || !ambientRef.current || !scopeRef.current) return;
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      gsap.fromTo(ambientRef.current,
        { y: 60 },
        {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current.closest(".challenges"),
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        }
      );
    });
    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  useGSAP(() => {
    if (!shouldAnimate || !rightRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    gsap.fromTo(rightRef.current,
      { opacity: 0.4, y: isMobile ? 4 : 8 },
      { opacity: 1, y: 0, duration: isMobile ? 0.18 : 0.35, ease: "power2.out" }
    );
  }, { scope: rightRef, dependencies: [activeId] });

  const activeChallenge = CHALLENGES.find((challenge) => challenge.id === activeId);

  const handleChallengeSelect = (challenge) => {
    setActiveId(challenge.id);
    setExpandedId(challenge.id);
  };

  return (
    <>
      <section className="challenges">
        {/* Ambient ghost text — parallax scrub layer */}
        <div className="challenges_ambient" ref={ambientRef} aria-hidden="true">CORA</div>

        <div className="challenges_container" ref={scopeRef}>
          <p className="challenges_eyebrow">Does this sound familiar?</p>
          <h2 className="challenges_heading" ref={headingRef}>
            Cooperative work should not feel this heavy.
          </h2>
          <p className="challenges_intro">
            Tap a challenge and see how CORA turns the daily friction of cooperative management into clearer, faster, more confident operations.
          </p>

          <div className="challenges_layout">
            <div className="challenges_left" aria-label="Cooperative challenges">
              {CHALLENGES.map((challenge) => {
                const isActive = activeId === challenge.id;
                const isExpanded = expandedId === challenge.id;

                return (
                  <div key={challenge.id} className="challenge_item_wrapper">
                    <button
                      type="button"
                      className={`challenge_card${isActive ? " challenge_card--active" : ""}`}
                      onClick={() => handleChallengeSelect(challenge)}
                      aria-pressed={isActive}
                      aria-expanded={isExpanded}
                    >
                      <span className={`challenge_icon${isActive ? " challenge_icon--active" : ""}`}>
                        {challenge.icon}
                      </span>
                      <span className="challenge_title">{challenge.title}</span>
                    </button>
                    {isExpanded && (
                      <div className="challenges_right_mobile" id={`challenge-${challenge.id}`}>
                        <h3 className="challenges_subheading_mobile">
                          {challenge.content.heading}
                        </h3>
                        <p className="challenges_description_mobile">
                          {challenge.content.description}
                        </p>
                        {challenge.content.relief && (
                          <p className="challenges_relief_mobile">
                            <span className="challenges_relief_prefix">With CORA →</span> {challenge.content.relief}
                          </p>
                        )}
                        <button
                          type="button"
                          className="challenges_button_mobile"
                          onClick={() => setIsModalOpen(true)}
                        >
                          Register for next DEMO →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="challenges_right reveal" ref={rightRef}>
              <p className="challenges_right_label">Selected Challenge</p>
              <h3 className="challenges_subheading">
                {activeChallenge.content.heading}
              </h3>
              <p className="challenges_description">
                {activeChallenge.content.description}
              </p>
              {activeChallenge.content.relief && (
                <div className="challenges_relief">
                  <span className="challenges_relief_prefix">With CORA →</span>
                  <span>{activeChallenge.content.relief}</span>
                </div>
              )}
              <button
                type="button"
                className="challenges_button"
                onClick={() => setIsModalOpen(true)}
              >
                Register for next DEMO →
              </button>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Challenges;
