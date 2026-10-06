const MODULE_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

export const validateModuleNumber = (moduleNumber) => {
  const number = Number(moduleNumber);

  if (!MODULE_NUMBERS.includes(number)) {
    throw new Error("Invalid module number");
  }

  return number;
};

export const validateQuizAnswers = (answers) => {
  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array");
  }

  if (answers.length !== 10) {
    throw new Error("Exactly 10 answers are required");
  }

  for (const answer of answers) {
    if (
      !answer ||
      typeof answer.questionIndex !== "number" ||
      typeof answer.selectedAnswer !== "string"
    ) {
      throw new Error("Invalid answer format");
    }

    if (
      answer.questionIndex < 0 ||
      answer.questionIndex > 9
    ) {
      throw new Error("Invalid question index");
    }
  }

  return answers;
};