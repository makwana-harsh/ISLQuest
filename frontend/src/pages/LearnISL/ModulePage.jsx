import { useState } from "react";

import SignDetail from "./SignDetail";
import QuizPage from "./QuizPage";

function ModulePage({
  module,
  signs,
  selectedSign,
  onOpenSign,
  onClose,
  onCloseSign,
}) {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return (
      <QuizPage
        module={module}
        onClose={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="learn-overlay">

      <div className="learn-overlay-header">

        <button
          onClick={onClose}
          className="back-button"
        >
          ← Back
        </button>

        <div>
          <span>
            Module {module.moduleNumber}
          </span>

          <h1>{module.moduleName}</h1>
        </div>

      </div>

      <div className="sign-grid">

        {signs.map((sign, index) => (
          <button
            key={sign._id}
            className="sign-card"
            onClick={() => onOpenSign(sign._id)}
          >
            <span>Sign {index + 1}</span>

            <strong>{sign.signName}</strong>
          </button>
        ))}

        <button
          className="quiz-card"
          onClick={() => setShowQuiz(true)}
        >
          <strong>🎯 Take Quiz</strong>

          <span>
            Test your knowledge
          </span>
        </button>

      </div>

      {selectedSign && (
        <SignDetail
          sign={selectedSign}
          onClose={onCloseSign}
        />
      )}

    </div>
  );
}

export default ModulePage;