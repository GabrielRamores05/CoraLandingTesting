import React, { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./FAQ.css";

const FAQS = [
  {
    question: "Is CORA built for CDA compliance?",
    answer: "Yes. CORA is designed around cooperative records and reporting workflows so your team can prepare CDA-ready reports with less manual cleanup.",
  },
  {
    question: "Can we use CORA if our internet connection is unreliable?",
    answer: "CORA offers an offline edition for cooperatives that need local access and on-premise control, plus an online edition for teams that need cloud access and real-time collaboration.",
  },
  {
    question: "Do we need technical staff to run the system?",
    answer: "No. CORA is built for cooperative officers, bookkeepers, treasurers, and staff who need practical tools without complex IT setup.",
  },
  {
    question: "Can we migrate our existing records?",
    answer: "Yes. During onboarding, your records can be organized and imported into a cleaner structure so your team can start from a more reliable foundation.",
  },
  {
    question: "How is pricing handled?",
    answer: "Pricing depends on your cooperative size, edition, and setup needs. Book a demo and we'll recommend the most practical option for your budget.",
  },
  {
    question: "Is our data secure?",
    answer: "CORA is built with cooperative data protection in mind. Online access uses secure storage, while the offline edition keeps records on your own hardware.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const scopeRef = React.useRef(null);

  useScrollReveal(scopeRef, {}, 0.08);

  return (
    <section className="faq" id="faq" ref={scopeRef}>
      <div className="faq_container">
        <p className="faq_eyebrow reveal">Questions, answered</p>
        <h2 className="faq_title reveal">Before you book, here's what cooperative teams usually ask.</h2>
        <div className="faq_grid">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article className="faq_item reveal" key={faq.question}>
                <button
                  type="button"
                  className="faq_question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isOpen && <p className="faq_answer">{faq.answer}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
