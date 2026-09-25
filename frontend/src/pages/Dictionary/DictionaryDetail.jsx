import { useEffect, useState } from "react";

import { getDictionarySignById } from "../../api/dictionary.api";

function DictionaryDetail({ signId, onClose }) {
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSign = async () => {
      try {
        setLoading(true);
        setMessage("");
        setSign(null);

        const data = await getDictionarySignById(signId);
        if (!cancelled) setSign(data.sign);
      } catch (error) {
        if (!cancelled) setMessage(error.response?.data?.message || "Failed to load sign");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSign();

    return () => {
      cancelled = true;
    };
  }, [signId]);

  // Close with Escape and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="ui-scope ui-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ui-modal dc-modal" role="dialog" aria-modal="true" aria-label={sign?.signName || "Sign details"}>
        <button type="button" className="ui-btn ui-btn--sm dc-close" onClick={onClose}>
          Close
        </button>

        {loading && (
          <div className="dc-detail">
            <div className="ui-skel dc-skel-video" />
            <div className="dc-skel-lines">
              <div className="ui-skel" style={{ height: 40, width: "60%" }} />
              <div className="ui-skel" style={{ height: 18 }} />
              <div className="ui-skel" style={{ height: 18, width: "80%" }} />
            </div>
          </div>
        )}

        {message && <p className="ui-alert">{message}</p>}

        {sign && (
          <div className="dc-detail">
            <video className="ui-video" src={sign.videoUrl} controls playsInline autoPlay muted loop />

            <div className="dc-info">
              <h1>{sign.signName}</h1>

              <section>
                <h3>Meaning</h3>
                <p>{sign.meaning}</p>
              </section>

              <section>
                <h3>Usage</h3>
                <p>{sign.usage}</p>
              </section>

              {(sign.sourceType || sign.sourceName) && (
                <section className="dc-source">
                  <h3>Source</h3>
                  <p>
                    {sign.sourceName}
                    {sign.sourceType && <span className="dc-source-type">{sign.sourceType}</span>}
                  </p>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DictionaryDetail;
