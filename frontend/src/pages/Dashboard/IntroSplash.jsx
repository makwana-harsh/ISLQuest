import { useCallback, useEffect, useRef, useState } from "react";
import HandMark from "../../components/HandMark";

const WORD = "ISLQuest".split("");
const VISIBLE_MS = 3000;
const EXIT_MS = 750;

/**
 * Full-screen welcome animation shown before the dashboard.
 * The hand builds itself finger by finger, waves, the wordmark pops in,
 * then the whole screen slides up to reveal the dashboard.
 */
function IntroSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const exitTimer = useRef(null);

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    exitTimer.current = setTimeout(onDone, EXIT_MS);
  }, [onDone]);

  useEffect(() => {
    const autoLeave = setTimeout(leave, VISIBLE_MS);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(autoLeave);
      clearTimeout(exitTimer.current);
      document.body.style.overflow = "";
    };
  }, [leave]);

  return (
    <div
      className={`ui-scope intro ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-label="Welcome to Sanket"
      onClick={leave}
    >
      <span className="intro-blob intro-blob--sun" />
      <span className="intro-blob intro-blob--pink" />
      <span className="intro-blob intro-blob--sky" />

      <div className="intro-stage">
        <HandMark size={140} animated />

        <p className="intro-word" aria-hidden="true">
          {WORD.map((letter, index) => (
            <span key={index} style={{ "--d": `${1.25 + index * 0.07}s` }}>
              {letter}
            </span>
          ))}
        </p>

        <p className="intro-tag">Learn, translate and share Indian Sign Language.</p>
      </div>

      <button type="button" className="ui-btn ui-btn--sm intro-skip" onClick={leave}>
        Skip intro
      </button>
    </div>
  );
}

export default IntroSplash;
