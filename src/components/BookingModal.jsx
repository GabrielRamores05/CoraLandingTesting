import { useState, useEffect, useRef } from "react";
import { GOOGLE_SHEETS_ENDPOINT } from "../lib/constants";
import "../styles/BookingModal.css";

function formatBookingDate(date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return formatted.replace(", ", ",");
}

function getMondayStart(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

function getAvailableDemoSchedules(now) {
  const startOfWeek = getMondayStart(now);
  const fridayCutoff = new Date(startOfWeek);
  fridayCutoff.setDate(fridayCutoff.getDate() + 4);
  fridayCutoff.setHours(16, 0, 0, 0);
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const useNextWeek = now >= fridayCutoff || isWeekend;
  const scheduleWeekStart = new Date(startOfWeek);
  if (useNextWeek) {
    scheduleWeekStart.setDate(scheduleWeekStart.getDate() + 7);
  }
  const wednesday = new Date(scheduleWeekStart);
  wednesday.setDate(wednesday.getDate() + 2);
  const friday = new Date(scheduleWeekStart);
  friday.setDate(friday.getDate() + 4);
  return [
    { value: formatBookingDate(wednesday), label: `Wednesday, ${formatBookingDate(wednesday)}` },
    { value: formatBookingDate(friday), label: `Friday, ${formatBookingDate(friday)}` },
  ];
}

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

const ROLES = [
  "Board Chairman",
  "General Manager",
  "Accountant",
  "Treasurer",
  "Bookkeeper",
  "Other",
];

function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cooperativeType: "",
    otherCooperativeType: "",
    cooperativeName: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    demoDate: "",
    facebook: "",
    subscribed: "No",
    role: "",
    otherRole: "",
  });
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      document.documentElement.classList.add("cora_modal_open");
      document.body.classList.add("cora_modal_open");
      setStep(1);
    } else if (!isOpen) {
      document.documentElement.classList.remove("cora_modal_open");
      document.body.classList.remove("cora_modal_open");
    }
    prevIsOpenRef.current = isOpen;
    return () => {
      document.documentElement.classList.remove("cora_modal_open");
      document.body.classList.remove("cora_modal_open");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.cooperativeType) {
        alert("Please select a cooperative type first.");
        return;
      }
      if (formData.cooperativeType === "Other" && !formData.otherCooperativeType) {
        alert("Please specify your cooperative type.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.role) {
        alert("Please fill in all required fields.");
        return;
      }
      if (formData.role === "Other" && !formData.otherRole) {
        alert("Please specify your role.");
        return;
      }
    }
    if (step === 3 && !formData.cooperativeName) {
      alert("Cooperative name is required.");
      return;
    }
    if (step === 4) {
      if (!formData.email || !formData.mobile) {
        alert("Please fill in email and mobile number.");
        return;
      }
    }
    if (step === 5 && !formData.demoDate) {
      alert("Please select a demo date.");
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitBooking = () => {
    const resolvedCoopType = formData.cooperativeType === "Other" ? formData.otherCooperativeType : formData.cooperativeType;
    const resolvedRole = formData.role === "Other" ? formData.otherRole : formData.role;
    const payload = new URLSearchParams({
      FormType: "Booking",
      CooperativeType: resolvedCoopType,
      CooperativeName: formData.cooperativeName,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      Mobile: formData.mobile,
      DemoDate: formData.demoDate,
      Facebook: formData.facebook,
      Subscribed: formData.subscribed,
      YourRole: resolvedRole,
    });
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    }).then(() => setStep(6)).catch(() => alert("Unable to submit the form right now."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitBooking();
  };

  if (!isOpen) return null;

  return (
    <div className="booking_modal_overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cora_modal booking_modal">
        <div className="modal_progress">
          <div className="progress_bar">
            <div className="progress_fill" style={{ width: `${(step <= 5 ? step : 5) / 5 * 100}%` }} />
          </div>
          <span className="progress_text">Step {step} of 5</span>
        </div>
        <button className="cora_modal_close" onClick={onClose}>✕</button>

        {step === 1 && (
          <div className="step_content">
            <h4 className="step_title">Select Your Cooperative Type</h4>
            <p className="step_intro">Choose the type that best describes your cooperative.</p>
            <div className="coop_type_grid">
              {COOP_TYPES.map((type) => (
                <button key={type} className={`coop_type_tile ${formData.cooperativeType === type ? "selected" : ""}`} onClick={() => setFormData({ ...formData, cooperativeType: type })}>
                  {type}
                </button>
              ))}
            </div>
            {formData.cooperativeType === "Other" && (
              <div className="form_group" style={{ marginTop: 20 }}>
                <label>Specify Cooperative Type</label>
                <input type="text" name="otherCooperativeType" placeholder="Enter cooperative type" value={formData.otherCooperativeType} onChange={handleInputChange} required />
              </div>
            )}
            <div className="step_buttons">
              <button type="button" className="btn_submit" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step_content">
            <h4 className="step_title">Personal Information</h4>
            <p className="step_intro">Tell us about yourself.</p>
            <div className="form_row">
              <div className="form_group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Juan" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form_group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Dela Cruz" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form_group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} required>
                <option value="">Select your role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {formData.role === "Other" && (
              <div className="form_group">
                <label>Specify Your Role</label>
                <input type="text" name="otherRole" placeholder="Enter your role" value={formData.otherRole} onChange={handleInputChange} required />
              </div>
            )}
            <div className="step_buttons">
              <button type="button" className="btn_secondary" onClick={handleBack}>Back</button>
              <button type="button" className="btn_submit" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && formData.cooperativeType && (
          <div className="step_content">
            <h4 className="step_title">Cooperative Information</h4>
            <p className="step_intro">Share details about your cooperative.</p>
            <div className="form_group">
              <label>Cooperative Name</label>
              <input type="text" name="cooperativeName" placeholder="San Isidro Multi-Purpose Cooperative" value={formData.cooperativeName} onChange={handleInputChange} required />
            </div>
            <div className="step_buttons">
              <button type="button" className="btn_secondary" onClick={handleBack}>Back</button>
              <button type="button" className="btn_submit" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step_content">
            <h4 className="step_title">Contact Information</h4>
            <p className="step_intro">How can we reach you?</p>
            <div className="form_group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="juan@yourcooperative.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form_group">
              <label>Mobile Number</label>
              <input type="tel" name="mobile" placeholder="09XX XXX XXXX" value={formData.mobile} onChange={handleInputChange} required />
            </div>
            <div className="form_group">
              <label>Facebook (Optional)</label>
              <input type="text" name="facebook" placeholder="facebook.com/yourcooperative" value={formData.facebook} onChange={handleInputChange} />
            </div>
            <div className="step_buttons">
              <button type="button" className="btn_secondary" onClick={handleBack}>Back</button>
              <button type="button" className="btn_submit" onClick={handleNext}>Continue</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <form onSubmit={handleSubmit} className="step_content">
            <h4 className="step_title">Schedule Your Demo</h4>
            <p className="step_intro">Choose a convenient time for your free demo.</p>
            <div className="form_group">
              <label>Demo Date</label>
              <select name="demoDate" value={formData.demoDate} onChange={handleInputChange} required>
                <option value="">Select Schedule</option>
                {getAvailableDemoSchedules(new Date()).map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="form_group checkbox_group">
              <label className="checkbox_label">
                <input type="checkbox" name="subscribed" checked={formData.subscribed === "Yes"} onChange={(e) => setFormData({ ...formData, subscribed: e.target.checked ? "Yes" : "No" })} />
                Subscribe to CORA updates
              </label>
            </div>
            <div className="step_buttons">
              <button type="button" className="btn_secondary" onClick={handleBack}>Back</button>
              <button type="submit" className="btn_submit">Finish</button>
            </div>
          </form>
        )}

        {step === 6 && (
          <div className="step_content thank_you_screen">
            <div className="thank_you_icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <h3 className="thank_you_title">Thank You!</h3>
            <p className="thank_you_text">
              Your booking has been submitted! Check your email for the Google Meet link. We've sent the demo schedule to {formData.email}. See you soon!
            </p>
            <button className="btn_submit" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;