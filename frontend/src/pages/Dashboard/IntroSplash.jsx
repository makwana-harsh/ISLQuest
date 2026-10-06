// import { useCallback, useEffect, useRef, useState } from "react";
// import HandMark from "../../components/HandMark";

// const WORD = "ISLQuest".split("");
// const VISIBLE_MS = 3000;
// const EXIT_MS = 750;

// /**
//  * Full-screen welcome animation shown before the dashboard.
//  * The hand builds itself finger by finger, waves, the wordmark pops in,
//  * then the whole screen slides up to reveal the dashboard.
//  */
// function IntroSplash({ onDone }) {
//   const [leaving, setLeaving] = useState(false);
//   const leavingRef = useRef(false);
//   const exitTimer = useRef(null);

//   const leave = useCallback(() => {
//     if (leavingRef.current) return;
//     leavingRef.current = true;
//     setLeaving(true);
//     exitTimer.current = setTimeout(onDone, EXIT_MS);
//   }, [onDone]);

//   useEffect(() => {
//     const autoLeave = setTimeout(leave, VISIBLE_MS);
//     document.body.style.overflow = "hidden";

//     return () => {
//       clearTimeout(autoLeave);
//       clearTimeout(exitTimer.current);
//       document.body.style.overflow = "";
//     };
//   }, [leave]);

//   return (
//     <div
//       className={`ui-scope intro ${leaving ? "is-leaving" : ""}`}
//       role="status"
//       aria-label="Welcome to Sanket"
//       onClick={leave}
//     >
//       <span className="intro-blob intro-blob--sun" />
//       <span className="intro-blob intro-blob--pink" />
//       <span className="intro-blob intro-blob--sky" />

//       <div className="intro-stage">
//         <HandMark size={140} animated />

//         <p className="intro-word" aria-hidden="true">
//           {WORD.map((letter, index) => (
//             <span key={index} style={{ "--d": `${1.25 + index * 0.07}s` }}>
//               {letter}
//             </span>
//           ))}
//         </p>

//         <p className="intro-tag">Learn, translate and share Indian Sign Language.</p>
//       </div>

//       <button type="button" className="ui-btn ui-btn--sm intro-skip" onClick={leave}>
//         Skip intro
//       </button>
//     </div>
//   );
// }

// export default IntroSplash;



import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HandMark from "../../components/HandMark";

import "../../styles/Dashboard/IntroSplash.style.css";

const WORD = "Sanket".split("");
const VISIBLE_MS = 3400;
const EXIT_MS = 850;
const STAR_COUNT = 26;

// Deterministic-looking but varied sparkle field, generated once per mount.
function useSparkles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        size: 3 + Math.round(Math.random() * 5),
        delay: (Math.random() * 3).toFixed(2),
        duration: (2.2 + Math.random() * 2.2).toFixed(2),
      })),
    [count]
  );
}

/**
 * Full-screen magical welcome animation shown before the dashboard.
 * Aurora light drifts behind a glowing halo, the hand builds itself and
 * waves, the wordmark shimmers in with a sparkle trail, then the whole
 * scene dissolves upward into the dashboard.
 */
function IntroSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const exitTimer = useRef(null);
  const stars = useSparkles(STAR_COUNT);

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
      <span className="intro-blob intro-blob--teal" />

      <div className="intro-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="intro-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="intro-stage">
        <span className="intro-halo" aria-hidden="true" />
        <span className="intro-halo intro-halo--inner" aria-hidden="true" />

        <HandMark size={140} animated className="intro-hand" />

        <p className="intro-word" aria-hidden="true">
          {WORD.map((letter, index) => (
            <span key={index} style={{ "--d": `${1.3 + index * 0.08}s` }}>
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