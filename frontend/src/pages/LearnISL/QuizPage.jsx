import { useEffect, useState } from "react";

import {
  generateModuleQuiz,
  submitModuleQuiz,
} from "../../api/learnIsl.api";

function QuizPage({ module, onClose }) {
  const [questions, setQuestions] = useState([]);

  const [quizToken, setQuizToken] =
    useState(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);

        const data = await generateModuleQuiz(
          module.moduleNumber
        );

        setQuestions(data.questions);
        setQuizToken(data.quizToken);

        setAnswers(
          Array.from(
            { length: data.questions.length },
            (_, index) => ({
              questionIndex: index,
              selectedAnswer: "",
            })
          )
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to generate quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [module.moduleNumber]);

  const current = questions[currentQuestion];

  const selectAnswer = (signName) => {
    setAnswers((previous) =>
      previous.map((answer) =>
        answer.questionIndex === currentQuestion
          ? {
              ...answer,
              selectedAnswer: signName,
            }
          : answer
      )
    );
  };

  const selectedAnswer =
    answers[currentQuestion]?.selectedAnswer;

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  const finishQuiz = async () => {
    if (
      answers.some(
        (answer) => !answer.selectedAnswer
      )
    ) {
      setError(
        "Please answer all questions before submitting."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await submitModuleQuiz(
        quizToken,
        answers
      );

      setResult(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="learn-overlay">
        <div className="quiz-container">
          <p>Generating quiz...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="learn-overlay">

        <div className="quiz-result">

          <h1>Quiz Complete 🎉</h1>

          <div className="score">
            {result.score}/100
          </div>

          <p>
            Best Score: {result.bestScore}/100
          </p>

          <p>
            {result.score === 100
              ? "⭐⭐⭐ Mastery"
              : result.score >= 80
              ? "⭐⭐☆ Proficient"
              : result.score >= 60
              ? "⭐☆☆ Good Start"
              : "☆☆☆ Needs Practice"}
          </p>

          <button
            className="primary-button"
            onClick={onClose}
          >
            Back to Module
          </button>

        </div>

      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="learn-overlay">

      <div className="quiz-container">

        <div className="quiz-header">

          <button
            className="back-button"
            onClick={onClose}
          >
            ← Exit Quiz
          </button>

          <span>
            Question {currentQuestion + 1}/10
          </span>

        </div>

        <h1>{current.question}</h1>

        {error && (
          <p className="learn-error">
            {error}
          </p>
        )}

        <div className="quiz-options">

          {current.options.map((option) => (
            <button
              key={option.signName}
              className={`quiz-option ${
                selectedAnswer === option.signName
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                selectAnswer(option.signName)
              }
            >

              {option.videoUrl ? (
                <video
                  src={option.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="video-placeholder">
                  Video unavailable
                </div>
              )}

              <strong>
                {option.signName}
              </strong>

            </button>
          ))}

        </div>

        <div className="quiz-navigation">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion <
          questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              disabled={!selectedAnswer}
            >
              Next
            </button>
          ) : (
            <button
              onClick={finishQuiz}
              disabled={
                submitting || !selectedAnswer
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default QuizPage;