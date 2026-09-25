import { useEffect } from "react";

function SignDetail({ sign, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="ui-scope ui-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ui-modal ln-sign-modal" role="dialog" aria-modal="true" aria-label={sign.signName}>
        <button type="button" className="ui-btn ui-btn--sm ln-modal-close" onClick={onClose}>
          Close
        </button>

        <div className="ln-sign-detail">
          {sign.videoUrl ? (
            <video className="ui-video" src={sign.videoUrl} controls playsInline autoPlay muted loop />
          ) : (
            <div className="ln-video-missing">Video not available yet</div>
          )}

          <div className="ln-sign-info">
            <h1>{sign.signName}</h1>

            <section>
              <h3>Meaning</h3>
              <p>{sign.meaning || "Not available."}</p>
            </section>

            <section>
              <h3>Usage</h3>
              <p>{sign.usage || "Not available."}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignDetail;
