import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import "./Footer.css";

function Footer({ onPrivacyClick }) {
  const scopeRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    gsap.from(scopeRef.current, {
      scrollTrigger: { trigger: scopeRef.current, start: "top 78%", once: true },
      opacity: 0, y: 20, duration: isMobile ? 0.55 : 0.7, ease: "power3.out",
    });

    gsap.from(scopeRef.current.querySelectorAll(".footer_col"), {
      scrollTrigger: { trigger: scopeRef.current, start: "top 78%", once: true },
      opacity: 0, y: 14, stagger: 0.08, duration: isMobile ? 0.5 : 0.65, ease: "power3.out",
    });

    gsap.from(scopeRef.current.querySelector(".footer_bottom"), {
      scrollTrigger: { trigger: scopeRef.current, start: "top 78%", once: true },
      opacity: 0, duration: isMobile ? 0.45 : 0.55, delay: 0.3, ease: "power2.out",
    });
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  return (
    <>
      <footer className="footer" id="footer" ref={scopeRef}>
        <div className="footer_inner">

          <div className="footer_top">
            <div className="footer_brand">
              <img src="/assets/logos/cora.png" alt="CORA Logo" className="footer_logo" />
              <p className="footer_tagline">All-in-one cooperative management system built for the Philippines.</p>
              <button type="button" className="footer_cta" onClick={() => document.getElementById("hero-book-demo")?.click()}>
                Register for next DEMO
              </button>
              <div className="footer_socials">
                <a href="https://www.facebook.com/Cora.ph.2026" className="footer_social" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

            <div className="footer_col">
              <h4 className="footer_col_title">Product</h4>
              <ul className="footer_links">
                <li><a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>Features</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("booking-trigger")?.click(); }}>Online Edition</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("booking-trigger")?.click(); }}>Offline Edition</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("booking-trigger")?.click(); }}>Register for next DEMO</a></li>
              </ul>
            </div>

            <div className="footer_col">
              <h4 className="footer_col_title">Company</h4>
              <ul className="footer_links">
                <li><a href="#purpose" onClick={(e) => { e.preventDefault(); document.getElementById("purpose")?.scrollIntoView({ behavior: "smooth" }); }}>About CORA</a></li>
                <li><a href="#partners" onClick={(e) => { e.preventDefault(); document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }); }}>Partners</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); }}>Careers</a></li>
              </ul>
            </div>

            <div className="footer_col">
              <h4 className="footer_col_title">Contact</h4>
              <ul className="footer_links footer_links--contact">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
                  <span>0962 807 3120</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>edgepoint.solutions.inc@gmail.com</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>4th Level Nagaland Emall building, Elias Angeles St., Naga City, Philippines, 4400</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9c-1.5 0-2.94-.33-4.22-1.04l-3.53 1.06 1.06-3.53C3.33 16.94 2 15.5 2 12a9 9 0 0 1 16-7.46"/><path d="M12 2v6l2 2"/></svg>
                  <span>Cooperative Operations and Records Applications</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer_bottom">
            <p className="footer_copy">© {new Date().getFullYear()} CORA by Edgepoint. All rights reserved.</p>
            <div className="footer_bottom_links">
              <a href="#" onClick={(e) => { e.preventDefault(); onPrivacyClick && onPrivacyClick(); }}>Data Privacy</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); }}>Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;