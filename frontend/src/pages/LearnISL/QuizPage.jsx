import { useEffect, useState } from "react";

import { generateModuleQuiz, submitModuleQuiz } from "../../api/learnIsl.api";
import Stars, { getRank } from "./Stars";

function QuizPage({ module, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [quizToken, setQuizToken] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await generateModuleQuiz(module.moduleNumber);
        if (cancelled) return;

        setQuestions(data.questions);
        setQuizToken(data.quizToken);
        setAnswers(
          Array.from({ length: data.questions.length }, (_, index) => ({
            questionIndex: index,
            selectedAnswer: "",
          }))
        );
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to generate quiz");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [module.moduleNumber]);

  const current = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion]?.selectedAnswer;
  const answeredCount = answers.filter((answer) => answer.selectedAnswer).length;

  const selectAnswer = (signName) => {
    setAnswers((previous) =>
      previous.map((answer) =>
        answer.questionIndex === currentQuestion ? { ...answer, selectedAnswer: signName } : answer
      )
    );
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion((previous) => previous + 1);
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion((previous) => previous - 1);
  };

  const finishQuiz = async () => {
    if (answers.some((answer) => !answer.selectedAnswer)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await submitModuleQuiz(quizToken, answers);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ui-scope ui-overlay ln-center">
        <div className="ln-stack">
          <div className="ui-spinner" role="status" aria-label="Loading" />
          <p>Getting your questions ready...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="ui-scope ui-overlay ln-center">
        <div className="ln-stack">
          <p className="ui-alert">{error}</p>
          <button type="button" className="ui-btn" onClick={onClose}>
            Back to module
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="ui-scope ui-overlay ln-center">
        <div className="ln-result">
          <h1>Quiz complete</h1>

          <div className="ln-score" style={{ "--pct": Math.max(0, Math.min(100, Number(result.score) || 0)) }}>
            <div>
              <strong>{result.score}</strong>
              <span>out of 100</span>
            </div>
          </div>

          <Stars score={result.score} size={34} />
          <p className="ln-rank">{getRank(result.score)}</p>
          <p className="ln-muted">Your best score in this module is {result.bestScore}/100.</p>

          <button type="button" className="ui-btn ui-btn--primary" onClick={onClose}>
            Back to module
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const isLast = currentQuestion === questions.length - 1;

  return (
    <div className="ui-scope ui-overlay">
      <div className="ln-quiz">
        <div className="ln-quiz-top">
          <button type="button" className="ui-back" onClick={onClose}>
            Exit quiz
          </button>
          <span className="ln-count">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div
          className="ln-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answeredCount}
          aria-label="Questions answered"
        >
          <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>

        <h1 className="ln-question">{current.question}</h1>

        {error && (
          <p className="ui-alert" role="alert">
            {error}
          </p>
        )}

        <div className="ln-options">
          {current.options.map((option) => {
            const selected = selectedAnswer === option.signName;

            return (
              <button
                type="button"
                key={option.signName}
                className={`ln-option ${selected ? "is-selected" : ""}`}
                onClick={() => selectAnswer(option.signName)}
                aria-pressed={selected}
              >
                {option.videoUrl ? (
                  <video src={option.videoUrl} autoPlay loop muted playsInline preload="auto" />
                ) : (
                  <div className="ln-video-missing">Video unavailable</div>
                )}
                <strong>{option.signName}</strong>
              </button>
            );
          })}
        </div>

        <div className="ln-nav">
          <button type="button" className="ui-btn" onClick={previousQuestion} disabled={currentQuestion === 0}>
            Previous
          </button>

          {!isLast ? (
            <button type="button" className="ui-btn ui-btn--primary" onClick={nextQuestion} disabled={!selectedAnswer}>
              Next question
            </button>
          ) : (
            <button
              type="button"
              className="ui-btn ui-btn--primary"
              onClick={finishQuiz}
              disabled={submitting || !selectedAnswer}
            >
              {submitting ? "Submitting..." : "Submit quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
