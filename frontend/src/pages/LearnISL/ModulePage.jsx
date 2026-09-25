import { useState } from "react";

import SignDetail from "./SignDetail";
import QuizPage from "./QuizPage";

function ModulePage({ module, signs, selectedSign, onOpenSign, onClose, onCloseSign }) {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <QuizPage module={module} onClose={() => setShowQuiz(false)} />;
  }

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
            {signs.length} {signs.length === 1 ? "sign" : "signs"} to learn. Open each one, then test yourself.
          </p>
        </header>

        <div className="ln-signs">
          {signs.map((sign, index) => (
            <button type="button" key={sign._id} className="ln-sign" onClick={() => onOpenSign(sign._id)}>
              <span className="ln-sign-no">{index + 1}</span>
              <strong>{sign.signName}</strong>
            </button>
          ))}

          <button type="button" className="ln-quiz-card" onClick={() => setShowQuiz(true)}>
            <strong>Take the quiz</strong>
            <span>Ten questions to check what you have learned.</span>
          </button>
        </div>
      </div>

      {selectedSign && <SignDetail sign={selectedSign} onClose={onCloseSign} />}
    </div>
  );
}

export default ModulePage;
