import { useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import "./LiveDemoButton.css";

function LiveDemoButton() {
  const [expanded, setExpanded] = useState(false);
  const magneticRef = useMagnetic({ strength: 20, textStrength: 8 });

  const handleMainClick = () => {
    if (expanded) {
      window.open("https://cora-ph.com", "_blank", "noopener,noreferrer");
    } else {
      setExpanded(true);
    }
  };

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <button
      className={`live_demo_fab ${expanded ? "live_demo_fab--expanded" : "live_demo_fab--collapsed"}`}
      onClick={handleMainClick}
      aria-label="View sample website"
      ref={magneticRef}
    >
      {expanded && <span className="live_demo_fab__pulse" />}
      <svg className="live_demo_fab__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      {expanded && (
        <>
          <span className="live_demo_fab__label">View Sample Website</span>
          <span
            className="live_demo_fab__minimize"
            onClick={handleMinimizeClick}
            aria-label="Minimize"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </>
      )}
    </button>
  );
}

export default LiveDemoButton;
