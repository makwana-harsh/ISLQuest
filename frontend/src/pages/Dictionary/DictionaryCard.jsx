function DictionaryCard({ sign, onClick }) {
  const name = sign.signName || "";
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const tone = name ? name.charCodeAt(0) % 4 : 0;

  return (
    <button type="button" className="dc-card" onClick={() => onClick(sign._id)}>
      <span className={`dc-initial tone-${tone}`} aria-hidden="true">
        {initial}
      </span>
      <span className="dc-name">{name}</span>
    </button>
  );
}

export default DictionaryCard;
