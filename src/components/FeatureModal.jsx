import { useEffect } from "react";
import "../styles/featureModal.css";

const CONTENT = {
  offline: {
    variant: "offline",
    badge: "Offline Edition",
    title: "Work Without Limits",
    subtitle:
      "Installed directly on your device — no internet required, ever. Your data stays on-premise, fully in your control.",
    features: [
      {
        name: "No Internet Required",
        desc: "Run the full system anywhere, even in areas with no connectivity.",
      },
      {
        name: "On-Premise Data Storage",
        desc: "All records stay on your local machine — no third-party cloud involved.",
      },
      {
        name: "Full Privacy & Control",
        desc: "You own your data. Nothing leaves your cooperative's hardware.",
      },
      {
        name: "One-Time Installation",
        desc: "Set it up once and it's always available, regardless of outages.",
      },
      {
        name: "CDA Report Generation",
        desc: "Generate compliance reports directly, no upload needed.",
      },
      {
        name: "Dividend & Ledger Management",
        desc: "Complete accounting tools built for cooperative finance.",
      },
    ],
    cta: "Register for next DEMO — Offline",
  },
  online: {
    variant: "online",
    badge: "Online Edition",
    title: "Access From Anywhere",
    subtitle:
      "Cloud-powered and always in sync. Manage your cooperative from any device, at any time.",
    features: [
      {
        name: "Access From Any Device",
        desc: "Use any browser on any device — phone, tablet, or desktop.",
      },
      {
        name: "Real-Time Synchronization",
        desc: "All changes sync instantly across every user in your cooperative.",
      },
      {
        name: "Automatic Cloud Backups",
        desc: "Your data is automatically backed up, so nothing is ever lost.",
      },
      {
        name: "Multi-User Collaboration",
        desc: "Multiple staff members can work simultaneously with role-based access.",
      },
      {
        name: "Always Up-To-Date",
        desc: "New features and compliance updates roll out automatically.",
      },
      {
        name: "Secure Encrypted Storage",
        desc: "Bank-grade encryption protects every record in the cloud.",
      },
    ],
    cta: "Register for next DEMO — Online",
  },
};

function FeatureModal({ type, onClose, onBookDemo }) {
  const content = CONTENT[type];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.documentElement.classList.add("cora_modal_open");
    document.body.classList.add("cora_modal_open");
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.classList.remove("cora_modal_open");
      document.body.classList.remove("cora_modal_open");
    };
  }, [onClose]);

  if (!content) return null;

  return (
    <div
      className="cora_modal_overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`${content.badge} features`}
    >
      <div className="cora_modal fmodal" onClick={(e) => e.stopPropagation()}>
        <button
          className="fmodal_close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <span className={`fmodal_badge fmodal_badge--${content.variant}`}>
          <span className="fmodal_badge_dot" />
          {content.badge}
        </span>

        <h2 className="fmodal_title">{content.title}</h2>
        <p className="fmodal_subtitle">{content.subtitle}</p>

        <div className="fmodal_divider" />

        <ul className="fmodal_features">
          {content.features.map((f) => (
            <li key={f.name} className="fmodal_feature">
              <span className={`fmodal_check fmodal_check--${content.variant}`}>
                <svg viewBox="0 0 12 12">
                  <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                </svg>
              </span>
              <span className="fmodal_feature_text">
                <span className="fmodal_feature_name">{f.name}</span>
                <span className="fmodal_feature_desc">{f.desc}</span>
              </span>
            </li>
          ))}
        </ul>

        <button
          className={`fmodal_cta fmodal_cta--${content.variant}`}
          onClick={onBookDemo}
        >
          {content.cta}
        </button>
      </div>
    </div>
  );
}

export default FeatureModal;
