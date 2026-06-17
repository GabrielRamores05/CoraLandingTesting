import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import { useTextReveal } from "../hooks/useTextReveal";
import "../styles/servingCooperatives.css";

gsap.registerPlugin(ScrollTrigger);

const FEATURES_LEFT = [
  "Manual Processes → Automated member and loan records",
  "Reporting Delays → 1-Click CDA-ready reports",
  "Data Inaccuracy → Single source of truth",
];

const FEATURES_RIGHT = [
  "Limited Visibility → Real-time cooperative dashboards",
  "Record Mismanagement → Secure cloud or local backups",
  "Lack of Transparency → Clear, trusted audit trails",
];

function ServingCooperatives() {
  const scopeRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const nameCardRef = useRef(null);
  const shouldAnimate = useShouldAnimate();
  const titleRef = useTextReveal({ start: "top 80%" });

  // Image unmask + zoom-out reveal (Webflow "image reveal" effect)
  useGSAP(() => {
    if (!shouldAnimate || !imageWrapRef.current || !imageRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // The outer wrap acts as the clip mask — scrubbed as you scroll
      gsap.set(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imageRef.current, { scale: 1.15 });

      gsap.to(imageWrapRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: imageWrapRef.current,
          start: "top 95%",
          end: "top 30%",
          scrub: 1.2,
        },
      });
      gsap.to(imageRef.current, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: imageWrapRef.current,
          start: "top 95%",
          end: "top 30%",
          scrub: 1.2,
        },
      });
      gsap.fromTo(nameCardRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    });

    // Mobile: simple fade-up
    mm.add("(max-width: 768px)", () => {
      gsap.from([imageWrapRef.current, nameCardRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imageWrapRef.current,
          start: "top 88%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  // Staggered list items reveal
  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;

    const items = scopeRef.current.querySelectorAll(".serving_list_item");
    const callout = scopeRef.current.querySelector(".serving_callout");

    gsap.fromTo([...items, callout],
      { opacity: 0, x: -30, filter: "blur(3px)" },
      {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        stagger: 0.07,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current.querySelector(".serving_list_grid"),
          start: "top 95%",
          end: "top 40%",
          scrub: 1.1,
        },
      }
    );
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  return (
    <section className="serving" ref={scopeRef}>
      <div className="serving_container">
        <div className="serving_image_wrap" ref={imageWrapRef}>
          <div className="serving_name_card" ref={nameCardRef}>
            <p className="serving_name">Joannah B. Ramores</p>
            <p className="serving_role">Founder of CORA and President of Edgepoint Solutions, Inc.</p>
          </div>
          <img
            src="/assets/images/founder.png"
            alt="CORA Founder"
            className="serving_image"
            ref={imageRef}
          />
        </div>

        <div className="serving_content">
          <h2 className="serving_title" ref={titleRef}>Serving Cooperatives</h2>
          <p className="serving_intro">
            CORA helps cooperatives manage their finances with accuracy and
            transparency — giving officers and members the clarity they need to
            run operations confidently and serve their communities better.
          </p>

          <div className="serving_list_grid">
            <ul className="serving_list">
              {FEATURES_LEFT.map((feature) => (
                <li key={feature} className="serving_list_item">
                  {feature}
                </li>
              ))}
            </ul>
            <ul className="serving_list">
              {FEATURES_RIGHT.map((feature) => (
                <li key={feature} className="serving_list_item">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="serving_callout">
            <h3 className="serving_callout_title">Built for Cooperatives</h3>
            <p className="serving_callout_text">
              In 60 minutes, you'll see exactly how CORA can reduce manual work
              for your cooperative type — with a setup path made for real offices,
              real records, and real compliance deadlines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServingCooperatives;