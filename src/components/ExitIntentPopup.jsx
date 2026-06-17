import { useState, useEffect } from "react";
import { GOOGLE_SHEETS_ENDPOINT } from "../lib/constants";
import "../styles/ExitIntentPopup.css";

function ExitIntentPopup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !sessionStorage.getItem("exitIntentShown")) {
        sessionStorage.setItem("exitIntentShown", "true");
        if (!sessionStorage.getItem("demoBooked")) {
          setVisible(true);
          document.documentElement.classList.add("cora_modal_open");
          document.body.classList.add("cora_modal_open");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ FormType: "ExitIntent", Email: email }),
    }).then(() => setSubmitted(true)).catch(() => alert("Unable to submit."));
  };

  const handleClose = () => {
    setVisible(false);
    document.documentElement.classList.remove("cora_modal_open");
    document.body.classList.remove("cora_modal_open");
  };

  if (!visible) return null;

  return (
    <div className="exit_intent_overlay">
      <div className="exit_intent_modal">
        <button className="exit_intent_close" onClick={handleClose}>✕</button>
        {submitted ? (
          <div className="exit_intent_success">
            <h3>Checklist Sent!</h3>
            <p>Check your email for the CDA Compliance Checklist PDF.</p>
          </div>
        ) : (
          <>
            <h3 className="exit_intent_title">Free CDA Compliance Checklist</h3>
            <p className="exit_intent_desc">Get our PDF checklist to audit your records before CDA inspection.</p>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="exit_intent_submit">Send Me the Checklist</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ExitIntentPopup;