export function getStarCount(score) {
  const value = Number(score) || 0;
  if (value >= 100) return 3;
  if (value >= 80) return 2;
  if (value >= 60) return 1;
  return 0;
}

export function getRank(score) {
  const stars = getStarCount(score);
  if (stars === 3) return "Mastery";
  if (stars === 2) return "Proficient";
  if (stars === 1) return "Good start";
  return "Needs practice";
}

const STAR_PATH = "M12 2.8l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.7l-5.8 3.1 1.1-6.5L2.6 9.7l6.5-.9z";

function Stars({ score, size = 22 }) {
  const filled = getStarCount(score);

  return (
    <span className="ln-stars" role="img" aria-label={`${filled} out of 3 stars`}>
      {[0, 1, 2].map((index) => (
        <svg key={index} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={STAR_PATH}
            fill={index < filled ? "#ffb62e" : "#ffffff"}
            stroke="#1b2f2c"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export default Stars;
