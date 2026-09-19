function DictionaryCard({ sign, onClick }) {
  return (
    <button
      type="button"
      className="dictionary-card"
      onClick={() => onClick(sign._id)}
    >
      {sign.signName}
    </button>
  );
}

export default DictionaryCard;