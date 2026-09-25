/**
 * Sanket brand mark: a simple, colourful hand built from rounded shapes.
 * Pass `animated` to play the grow-and-wave animation (used by the intro).
 */
function HandMark({ size = 40, animated = false, className = "" }) {
  const stroke = { stroke: "#1b2f2c", strokeWidth: 3.5, strokeLinejoin: "round" };

  return (
    <svg
      className={`hand-mark ${animated ? "is-animated" : ""} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hm-hand">
        <g transform="rotate(-38 16 96)">
          <rect className="hm-thumb" x="9" y="56" width="17" height="46" rx="8.5" fill="#10a08c" {...stroke} />
        </g>
        <rect className="hm-f hm-f1" x="27" y="46" width="16" height="50" rx="8" fill="#4f8ff0" {...stroke} />
        <rect className="hm-f hm-f2" x="45" y="28" width="16" height="68" rx="8" fill="#f4658a" {...stroke} />
        <rect className="hm-f hm-f3" x="63" y="18" width="16" height="78" rx="8" fill="#10a08c" {...stroke} />
        <rect className="hm-f hm-f4" x="81" y="32" width="16" height="64" rx="8" fill="#ffb62e" {...stroke} />
        <rect x="24" y="66" width="76" height="46" rx="23" fill="#fff0c9" {...stroke} />
      </g>
    </svg>
  );
}

export default HandMark;
