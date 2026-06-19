import { useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import "./LiveDemoButton.css";

function LiveDemoButton() {
  const [minimized, setMinimized] = useState(false);
  const magneticRef = useMagnetic({ strength: 20, textStrength: 8 });

  return (
    <div className={`live_demo_fab ${minimized ? "live_demo_fab--minimized" : ""}`}>
      {minimized ? (
        <button
          className="live_demo_pill live_demo_pill--collapsed"
          onClick={() => setMinimized(false)}
          aria-label="Expand demo button"
          ref={magneticRef}
        >
          <span className="live_demo_pulse" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      ) : (
        <a
          href="https://cora-ph.com"
          className="live_demo_pill"
          target="_blank"
          rel="noopener noreferrer"
          ref={magneticRef}
        >
          <span className="live_demo_pulse" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span className="live_demo_label magnetic_text">Live Demo</span>
          <button
            className="live_demo_minimize"
            onClick={(e) => { e.stopPropagation(); setMinimized(true); }}
            aria-label="Minimize"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </a>
      )}
    </div>
  );
}

export default LiveDemoButton;
