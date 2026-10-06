export function TranslationControls({ isActive, isModelLoading, onToggle, onReset }) {
  return (
    <div className="tr-controls">
      <button
        type="button"
        onClick={onToggle}
        disabled={isModelLoading}
        className={`ui-btn ${isActive ? "ui-btn--danger" : "ui-btn--primary"} tr-main-btn`}
      >
        {isModelLoading ? "Loading model..." : isActive ? "Stop translating" : "Start translating"}
      </button>

      <button type="button" onClick={onReset} disabled={!isActive} className="ui-btn">
        Clear and retry
      </button>
    </div>
  );
}
