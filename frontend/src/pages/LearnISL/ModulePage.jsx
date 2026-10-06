import { useState } from "react";

import SignDetail from "./SignDetail";
import QuizPage from "./QuizPage";

function ModulePage({ module, signs, selectedSign, onOpenSign, onClose, onCloseSign }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [collected, setCollected] = useState(() => new Set());

  if (showQuiz) {
    return <QuizPage module={module} onClose={() => setShowQuiz(false)} />;
  }

  const handleOpenSign = (signId) => {
    setCollected((prev) => new Set(prev).add(signId));
    onOpenSign(signId);
  };

  const allCollected = signs.length > 0 && collected.size >= signs.length;

  return (
    <div className="ui-scope ui-overlay">
      <div className="ln-module-wrap">
        <button type="button" onClick={onClose} className="ui-back">
          All modules
        </button>

        <header className="ln-module-head">
          <span className="ln-pill">Module {module.moduleNumber}</span>
          <h1>{module.moduleName}</h1>
          <p>
            Collect all {signs.length} {signs.length === 1 ? "sign" : "signs"}, then take on the boss quiz.
          </p>

          <div className="ln-collect-bar" role="img" aria-label={`${collected.size} of ${signs.length} signs collected`}>
            <span style={{ width: signs.length ? `${(collected.size / signs.length) * 100}%` : "0%" }} />
            <em>
              {collected.size}/{signs.length} collected
            </em>
          </div>
        </header>

        <div className="ln-signs">
          {signs.map((sign, index) => {
            const got = collected.has(sign._id);
            return (
              <button
                type="button"
                key={sign._id}
                className={`ln-sign ${got ? "is-collected" : ""}`}
                onClick={() => handleOpenSign(sign._id)}
              >
                <span className="ln-sign-no">{got ? "✓" : index + 1}</span>
                <strong>{sign.signName}</strong>
              </button>
            );
          })}

          <button
            type="button"
            className={`ln-quiz-card ${allCollected ? "is-ready" : ""}`}
            onClick={() => setShowQuiz(true)}
          >
            <span className="ln-boss-icon">🐉</span>
            <strong>Boss quiz</strong>
            <span>{allCollected ? "You're ready — go earn stars!" : "Ten questions to test yourself."}</span>
          </button>
        </div>
      </div>

      {selectedSign && <SignDetail sign={selectedSign} onClose={onCloseSign} />}
    </div>
  );
}

export default ModulePage;
