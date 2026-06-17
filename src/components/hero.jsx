import React, { useState, useRef } from "react";
import "../styles/hero.css";
import BookingModal from "./BookingModal";
import { useTextReveal } from "../hooks/useTextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";

gsap.registerPlugin(ScrollTrigger);

/* ── Static mini-dashboard (Members panel snapshot) ── */
function MiniDashboard() {
  const MEMBERS = [
    { id: "M-001", name: "Juan dela Cruz", type: "Regular", savings: "₱12,500", loans: "₱45,000", status: "Active" },
    { id: "M-002", name: "Maria Santos", type: "Regular", savings: "₱8,200", loans: "₱0", status: "Active" },
    { id: "M-003", name: "Pedro Reyes", type: "Associate", savings: "₱3,600", loans: "₱15,000", status: "Active" },
    { id: "M-004", name: "Ana Villanueva", type: "Regular", savings: "₱21,000", loans: "₱60,000", status: "Pending" },
    { id: "M-005", name: "Rolando Basco", type: "Regular", savings: "₱5,100", loans: "₱0", status: "Active" },
  ];

  return (
    <div className="hero_mini_chrome">
      {/* Browser chrome */}
      <div className="hero_mini_chrome_bar">
        <div className="hero_mini_chrome_dots">
          <span /><span /><span />
        </div>
        <div className="hero_mini_chrome_url">landing.cora-ph.com</div>
      </div>

      {/* App shell */}
      <div className="hero_mini_app">
        {/* Sidebar */}
        <div className="hero_mini_sidebar">
          <div className="hero_mini_sidebar_logo">CORA</div>
          {["Members", "Savings", "Loans", "Reports", "Dividends"].map((item, i) => (
            <div key={item} className={`hero_mini_nav_item${i === 0 ? " hero_mini_nav_item--active" : ""}`}>
              <span className="hero_mini_nav_dot" />
              {item}
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div className="hero_mini_panel">
          {/* Panel header */}
          <div className="hero_mini_panel_header">
            <div>
              <div className="hero_mini_panel_title">Members Management</div>
              <div className="hero_mini_panel_sub">7 members • 5 active</div>
            </div>
            <div className="hero_mini_btn">+ Add Member</div>
          </div>

          {/* Stat cards */}
          <div className="hero_mini_stats">
            {[["Total Members", "7"], ["Active", "5", "green"], ["With Loans", "3", "orange"], ["Total Savings", "₱50,400", "blue"]].map(([label, val, c]) => (
              <div key={label} className={`hero_mini_stat_card${c ? ` hero_mini_stat_card--${c}` : ""}`}>
                <span className="hero_mini_stat_label">{label}</span>
                <span className="hero_mini_stat_value">{val}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="hero_mini_table_wrap">
            <table className="hero_mini_table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Type</th>
                  <th>Savings</th>
                  <th>Loans</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((m) => (
                  <tr key={m.id}>
                    <td className="hero_mini_id">{m.id}</td>
                    <td className="hero_mini_member_name">{m.name}</td>
                    <td>{m.type}</td>
                    <td className="hero_mini_peso">{m.savings}</td>
                    <td className="hero_mini_peso">{m.loans}</td>
                    <td>
                      <span className={`hero_mini_pill hero_mini_pill--${m.status === "Active" ? "green" : "orange"}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nudge */}
          <div className="hero_mini_nudge">
            <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Scroll to explore the full interactive preview
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef(null);
  const visualRef = useRef(null);
  const leftColRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  // Kinetic word-by-word headline reveal
  const titleRef = useTextReveal({ start: "top 90%" });

  // ── Apple-style scroll-trigger on the dashboard ──
  // As you scroll down past the hero, the dashboard:
  //   - Tilts (rotateX) as if falling into the page
  //   - Scales down slightly
  //   - Fades slightly
  // The left copy column drifts upward (parallax)
  useGSAP(() => {
    if (!shouldAnimate || !visualRef.current || !heroRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Dashboard: 3D tilt + scale + fade tied to scroll
      gsap.to(visualRef.current, {
        rotateX: 30,
        scale: 0.8,
        opacity: 0.2,
        y: 140,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Left copy: drifts up slower than scroll (parallax depth)
      gsap.to(leftColRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => mm.revert();
  }, { scope: heroRef, dependencies: [shouldAnimate] });

  return (
    <>
      <div className="hero" ref={heroRef}>
        <div className="hero_body">
          {/* LEFT: Copy */}
          <div className="hero_content" ref={leftColRef}>
            <img src="/assets/logos/cora.png" alt="CORA Logo" className="hero_logo" />
            <p className="hero_eyebrow">BUILT FOR PHILIPPINE COOPERATIVES</p>
            <h1 className="hero_title" ref={titleRef}>
              Save 40+ hours a month — automate your cooperative's records, loans, and CDA reports.
            </h1>
            <p className="hero_description">
              Built for treasurers, bookkeepers, and board chairs who need to manage operations, compute dividends, and stay CDA-compliant — without the manual hassle.
            </p>

            <div className="hero_cta_wrapper">
              <button className="hero_button" onClick={() => setIsModalOpen(true)}>
                <span>Book My Free 1-Hour Demo</span>
              </button>
              <p className="hero_cta_microcopy">
                Limited slots per week • No commitment • No card required.
              </p>
            </div>

            <div className="hero_trust_badges">
              <span className="trust_badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                100% CDA Compliant
              </span>
              <span className="trust_badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Setup in hours, not weeks
              </span>
            </div>
          </div>

          {/* RIGHT: Mini Dashboard — Apple-style scroll product reveal */}
          <div className="hero_visual hero_visual--perspective" ref={visualRef}>
            <MiniDashboard />
          </div>
        </div>

        {/* Stat strip — immediately below the 2-col grid */}
        <div className="hero_stat_strip">
          <div className="hero_stat_strip_inner">
            <div className="hero_stat_item">
              <span className="hero_stat_num">10+</span>
              <span className="hero_stat_label">Cooperatives</span>
            </div>
            <div className="hero_stat_divider" />
            <div className="hero_stat_item">
              <span className="hero_stat_num">1,000+</span>
              <span className="hero_stat_label">Members Managed</span>
            </div>
            <div className="hero_stat_divider" />
            <div className="hero_stat_item">
              <span className="hero_stat_num">5,000+</span>
              <span className="hero_stat_label">Hours Saved</span>
            </div>
            <div className="hero_stat_divider hero_stat_divider--hide-mobile" />
            <p className="hero_stat_tagline">Cooperatives across Bicol already choose CORA.</p>
          </div>
        </div>

        {/* Logo carousel */}
        <div className="hero_carousel">
          <div className="carousel_container">
            <div className="carousel_track">
              {["BIKOLANAS", "CDO", "FACC", "LACO", "MAHARLIKA", "NBAC", "SEMCO",
                "BIKOLANAS", "CDO", "FACC", "LACO", "MAHARLIKA", "NBAC", "SEMCO",
                "BIKOLANAS", "CDO", "FACC", "LACO", "MAHARLIKA", "NBAC", "SEMCO"].map((name, i) => (
                  <div className="carousel_item" key={i}>
                    <img src={`/assets/logos/${name}.png`} alt={name} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Hero;
