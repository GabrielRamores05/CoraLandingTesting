import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import "./Onboarding.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "Send Us Your Records",
    body: "Already have Excel files, printed ledgers, or data from another system? Send them to us. We will handle all the importing, sorting, and clean-up — you don't have to touch a single spreadsheet.",
    badge: "Data Migration",
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "We Train Your Team",
    body: "Our team personally guides your staff on how to use CORA — from posting transactions to generating reports. We configure the system to match your cooperative's specific rules and workflows.",
    badge: "Training & Setup",
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: "Go Live — We Stay With You",
    body: "After your first month of full onboarding, you go live with confidence. And we don't leave — our team stays available throughout your entire 13-month subscription to support, update, and assist you.",
    badge: "Full Support",
  },
];

function Onboarding() {
  const sectionRef = useRef(null);
  const tlDotsRef = useRef(null);
  const brDotsRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useGSAP(() => {
    if (!shouldAnimate || !sectionRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Parallax on decorative dots
      if (tlDotsRef.current && brDotsRef.current) {
        gsap.to(tlDotsRef.current, {
          y: -80,
          x: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
        gsap.to(brDotsRef.current, {
          y: 80,
          x: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Apple-style product reveal for steps (3D tilt in — scrubbed)
      gsap.fromTo(sectionRef.current.querySelectorAll(".ob_step"),
        { opacity: 0, y: 100, rotateX: 18, scale: 0.9, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current.querySelector(".ob_steps"),
            start: "top 95%",
            end: "top 30%",
            scrub: 1.2,
          }
        }
      );

      // Header slides up — scrubbed
      gsap.fromTo(sectionRef.current.querySelector(".ob_header"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "top 55%",
            scrub: 1,
          },
        }
      );

      // Badges fade in — scrubbed
      gsap.fromTo(sectionRef.current.querySelector(".ob_badge_strip"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current.querySelector(".ob_badge_strip"),
            start: "top 95%",
            end: "top 70%",
            scrub: 1,
          },
        }
      );
    });

    // Mobile fallback (no heavy 3D or scrubbed parallax)
    mm.add("(max-width: 768px)", () => {
      gsap.from(sectionRef.current.querySelectorAll(".ob_step"), {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(sectionRef.current.querySelector(".ob_header"), {
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(sectionRef.current.querySelector(".ob_badge_strip"), {
        scrollTrigger: { trigger: sectionRef.current.querySelector(".ob_badge_strip"), start: "top 90%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [shouldAnimate] });

  return (
    <section className="ob_section" id="onboarding" ref={sectionRef}>
      {/* Decorative dots with parallax refs */}
      <div className="ob_dots ob_dots--tl" ref={tlDotsRef} aria-hidden="true" />
      <div className="ob_dots ob_dots--br" ref={brDotsRef} aria-hidden="true" />

      <div className="ob_container">
        <div className="ob_header">
          <p className="ob_eyebrow">Getting Started</p>
          <h2 className="ob_title">Your first month is all about <span>getting you ready.</span></h2>
          <p className="ob_sub">
            When you subscribe to CORA, you don't just get software — you get a dedicated team.
            Your 13-month subscription includes a full first month just for onboarding:
            data migration, system setup, and hands-on training.
          </p>
        </div>

        <div className="ob_steps">
          {STEPS.map((step) => (
            <div className="ob_step" key={step.num}>
              <div className="ob_step_num">{step.num}</div>
              <div className="ob_step_icon">{step.icon}</div>
              <div className="ob_step_badge">{step.badge}</div>
              <h3 className="ob_step_title">{step.title}</h3>
              <p className="ob_step_body">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="ob_badge_strip">
          <div className="ob_badge_item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>13-Month Subscription</span>
          </div>
          <div className="ob_badge_divider" />
          <div className="ob_badge_item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>1 Month Dedicated Onboarding</span>
          </div>
          <div className="ob_badge_divider" />
          <div className="ob_badge_item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
            </svg>
            <span>Full Assistance Throughout</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Onboarding;
