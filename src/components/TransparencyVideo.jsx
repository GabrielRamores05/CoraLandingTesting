import { useRef, useState, useEffect } from "react";
import "../styles/TransparencyVideo.css";

function TransparencyVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Attempt unmuted playback when scrolled into view
            videoRef.current.muted = false;
            videoRef.current.play().then(() => {
              setPlaying(true);
              setMuted(false);
            }).catch((e) => {
              console.warn("Browser blocked unmuted autoplay, falling back to muted:", e);
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().then(() => {
                  setPlaying(true);
                  setMuted(true);
                }).catch(err => console.error("Could not play even when muted:", err));
              }
            });
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    // For elderly users: if it's muted, clicking the video should unmute it first, not pause it
    if (muted) {
      videoRef.current.muted = false;
      setMuted(false);
      videoRef.current.play();
      setPlaying(true);
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section className="tv_section">
      <div className="tv_container">
        <div className="tv_text">
          <p className="tv_eyebrow">Our Commitment</p>
          <h2 className="tv_title">Transparency<br />Isn't Optional.</h2>
          <p className="tv_body">
            In online CORA, members have their own portal accessible through the internet. Whether they use a cellphone, laptop, or computer, they can easily access their records anytime, anywhere as long as they can browse the internet.
          </p>
          <div className="tv_divider" />
          <p className="tv_quote">
            "When your members can see exactly where their money goes, confidence follows."
          </p>
        </div>

        <div className="tv_video_wrap" onClick={togglePlay}>
          <video
            ref={videoRef}
            className="tv_video"
            src="/assets/videos/Ads1.mp4"
            playsInline
            loop
            muted={muted}
            preload="auto"
          />

          {/* Play / Pause overlay */}
          <button
            className={`tv_play_btn ${playing ? "tv_play_btn--playing" : ""}`}
            aria-label={playing ? "Pause" : "Play"}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Mute toggle */}
          <button
            className="tv_mute_btn"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          {/* Elderly-friendly Unmute Banner */}
          {muted && playing && (
            <div className="tv_unmute_banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>Tap anywhere to turn on sound</span>
            </div>
          )}

          {/* Not-playing overlay label */}
          {!playing && (
            <div className="tv_overlay_label">
              <span>Watch Our Story</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TransparencyVideo;
