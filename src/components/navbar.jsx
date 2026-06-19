import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import { GOOGLE_SHEETS_ENDPOINT } from "../lib/constants";
import "../styles/navbar.css";

gsap.registerPlugin(ScrollTrigger);

const COOP_TYPES = [
  "Credit",
  "Consumer",
  "Producer",
  "Marketing",
  "Service",
  "Multipurpose",
  "Agrarian Reform",
  "Bank",
  "Dairy",
  "Electric",
  "Fishermen",
  "Housing",
  "Transport",
  "Water Service",
  "Other",
];



const INQUIRY_TYPES = [
  "Product Demo Request",
  "Pricing & Plans",
  "Technical Support",
  "Partnership Inquiry",
  "CDA Compliance Question",
  "General Question",
  "Other",
];

function ContactModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    cooperativeType: "",
    inquiryType: "",
  });
  const [subscribed, setSubscribed] = useState("No");

  useEffect(() => {
    document.documentElement.classList.add("cora_modal_open");
    document.body.classList.add("cora_modal_open");
    return () => {
      document.documentElement.classList.remove("cora_modal_open");
      document.body.classList.remove("cora_modal_open");
    };
  }, []);

  const handleOptionChange = (name, value) => {
    setSelectedOptions({ ...selectedOptions, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = new URLSearchParams({
      FormType: "Inquiry",
      FirstName: formData.get("FirstName") || "",
      LastName: formData.get("LastName") || "",
      Email: formData.get("Email") || "",
      CooperativeName: formData.get("CooperativeName") || "",
      CooperativeType: formData.get("CooperativeType") || "",
      OtherCooperativeType: selectedOptions.cooperativeType === "Other" ? formData.get("OtherCooperativeType") || "" : "",
      Mobile: formData.get("Mobile") || "",
      InquiryType: selectedOptions.inquiryType === "Other" ? formData.get("OtherInquiryType") || "Other" : formData.get("InquiryType") || "",
      Facebook: formData.get("Facebook") || "",
      Subscribed: subscribed,
      Message: formData.get("Message") || "",
    });

    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        alert("Unable to submit the form right now.");
      });
  };

  return (
    <div className="contact_modal_overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="contact_modal">
        <button className="contact_modal_close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {!submitted ? (
          <>
            <div className="contact_modal_header">
              <div className="contact_modal_badge">Get in Touch</div>
              <h2 className="contact_modal_title">Send us an inquiry</h2>
              <p className="contact_modal_sub">Tell us what your cooperative needs and we'll get back to you within 24 hours.</p>
            </div>

            <form className="contact_modal_form" onSubmit={handleSubmit}>
              <div className="contact_form_row">
                <div className="contact_form_field">
                  <label>First Name <span>*</span></label>
                  <input type="text" name="FirstName" placeholder="Juan" required />
                </div>
                <div className="contact_form_field">
                  <label>Last Name <span>*</span></label>
                  <input type="text" name="LastName" placeholder="Dela Cruz" required />
                </div>
              </div>

              <div className="contact_form_field">
                <label>Email Address <span>*</span></label>
                <input type="email" name="Email" placeholder="juan@yourcooperative.com" required />
              </div>

              <div className="contact_form_field">
                <label>Cooperative Name</label>
                <input type="text" name="CooperativeName" placeholder="San Isidro Multi-Purpose Cooperative" />
              </div>

              <div className="contact_form_row">
                <div className="contact_form_field">
                  <label>Contact Number</label>
                  <input type="tel" name="Mobile" placeholder="09XX XXX XXXX" />
                </div>
                <div className="contact_form_field">
                  <label>Inquiry Type <span>*</span></label>
                  <select name="InquiryType" value={selectedOptions.inquiryType} onChange={(e) => handleOptionChange("inquiryType", e.target.value)} required>
                    <option value="">Select a topic…</option>
                    {INQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              {selectedOptions.inquiryType === "Other" && (
                <div className="contact_form_field">
                  <label>Specify Inquiry Type</label>
                  <input type="text" name="OtherInquiryType" placeholder="Briefly describe your topic" />
                </div>
              )}

              <div className="contact_form_field">
                <label>Cooperative Type</label>
                <select name="CooperativeType" value={selectedOptions.cooperativeType} onChange={(e) => handleOptionChange("cooperativeType", e.target.value)}>
                  <option value="">Select cooperative type</option>
                  {COOP_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {selectedOptions.cooperativeType === "Other" && (
                <div className="contact_form_field">
                  <label>Specify Cooperative Type</label>
                  <input type="text" name="OtherCooperativeType" placeholder="e.g. Transport cooperative" />
                </div>
              )}

              <div className="contact_form_field">
                <label>Facebook (Optional)</label>
                <input type="text" name="Facebook" placeholder="facebook.com/yourcooperative" />
              </div>

              <div className="contact_form_field checkbox_group">
                <label className="checkbox_label">
                  <input type="checkbox" checked={subscribed === "Yes"} onChange={(e) => setSubscribed(e.target.checked ? "Yes" : "No")} />
                  Subscribe to CORA updates
                </label>
              </div>

              <div className="contact_form_field">
                <label>Message <span>*</span></label>
                <textarea name="Message" placeholder="Tell us more about your cooperative and what you need…" rows={4} required />
              </div>

              <button type="submit" className="contact_submit_btn" disabled={loading}>
                {loading ? (
                  <><span className="contact_spinner" /> Sending…</>
                ) : (
                  <>Send Inquiry <span className="contact_btn_arrow">→</span></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="contact_success">
            <div className="contact_success_icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <h3>Inquiry Sent!</h3>
            <p>Thank you for reaching out. Our team will contact you within <strong>24 hours</strong>.</p>
            <button className="contact_submit_btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const shouldAnimate = useShouldAnimate();
  const navRef = useRef(null);

  useGSAP(() => {
    if (!shouldAnimate || !navRef.current) return;
    const root = navRef.current;
    gsap.from(root, {
      y: -64,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      delay: 0.05,
    });
    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      once: true,
      onEnter: () => root.classList.add("navbar--scrolled"),
      onLeaveBack: () => root.classList.remove("navbar--scrolled"),
    });
  }, { dependencies: [shouldAnimate] });

  const openContact = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setContactOpen(true);
  };

  return (
    <>
      <div className="topbar">
        <img className="topbar_logo" src="/assets/logos/edgepoint.png" alt="Edgepoint Logo" />
        <div className="topbar_contact">
            <div className="topbar_contact_item">
              <img src="/assets/icons/mobile.png" alt="" />
              <p>0962 807 3120</p>
            </div>
            <div className="topbar_contact_item">
              <img src="/assets/icons/email.png" alt="" />
              <p>edgepoint.solutions.inc@gmail.com</p>
            </div>
          <div className="topbar_contact_item">
            <img src="/assets/icons/location.png" alt="" />
            <p>Nagaland 4th level Emall, Naga City, Region V.</p>
          </div>
        </div>
        <div className="topbar_socials">
          <a href="https://www.facebook.com/Cora.ph.2026" className="topbar_social_link" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/facebook.png" alt="Facebook" /></a>
        </div>
      </div>

      <nav className="navbar" ref={navRef}>
        <div className="navbar_inner">
          <div className="navbar_logo">
            <img src="/assets/logos/cora.png" alt="CORA Logo" />
          </div>
          <div className="navbar_links">
            <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>Services</a>
            <a href="#" onClick={openContact} className="navbar_cta">Contact Us</a>
          </div>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile_menu ${menuOpen ? "active" : ""}`}>
        <a href="#services" onClick={() => { setMenuOpen(false); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>Services</a>
        <a href="#" onClick={openContact}>Contact Us</a>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

    </>
  );
}

export default Navbar;
