import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import "../styles/Testimonials.css";

const TESTIMONIALS = [
  {
    name: "Maria Santos",
    role: "General Manager",
    coop: "San Isidro Multi-Purpose Cooperative",
    quote: "CORA cut our monthly reporting time from 3 days to 2 hours. The CDA compliance reports are ready with one click.",
  },
  {
    name: "Carlos Reyes",
    role: "Treasurer",
    coop: "Naga Consumer Cooperative",
    quote: "No more manual errors in our savings tracking. Our members trust our numbers now because they're always accurate.",
  },
  {
    name: "Elena Cruz",
    role: "Board Chairman",
    coop: "Bicol Teachers Credit Cooperative",
    quote: "We finally have real-time visibility into our loans portfolio. Approval workflows run smoothly without chasing papers.",
  },
  {
    name: "Mark Bautista",
    role: "Accountant",
    coop: "Bicol Agri-Coop",
    quote: "We finally stopped spending weekends reconciling spreadsheets. The automated ledgers make month-end closing stress-free.",
  },
];

function Testimonials() {
  const scopeRef = useRef(null);
  const shouldAnimate = useShouldAnimate();

  useGSAP(() => {
    if (!shouldAnimate || !scopeRef.current) return;

    gsap.from(scopeRef.current.querySelector(".testimonials_header"), {
      scrollTrigger: { trigger: scopeRef.current, start: "top 80%", once: true },
      opacity: 0, y: 20, duration: 0.6, ease: "power3.out"
    });

    gsap.from(scopeRef.current.querySelectorAll(".testimonial_card"), {
      scrollTrigger: { trigger: scopeRef.current, start: "top 75%", once: true },
      opacity: 0, y: 24, stagger: 0.12, duration: 0.65, ease: "power3.out"
    });
  }, { scope: scopeRef, dependencies: [shouldAnimate] });

  return (
    <section className="testimonials" ref={scopeRef}>
      <div className="testimonials_container">
        <div className="testimonials_header">
          <h2>What Cooperatives Say</h2>
          <p>Real results from real officers</p>
        </div>
        <div className="testimonials_grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial_card" key={i}>
              <div className="testimonial_quote">"{t.quote}"</div>
              <div className="testimonial_author">
                <div className="testimonial_avatar" />
                <div className="testimonial_info">
                  <p className="testimonial_name">{t.name}</p>
                  <p className="testimonial_role">{t.role}</p>
                  <p className="testimonial_coop">{t.coop}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;