import LearnSign from "../../models/LearnSign.model.js";
import User from "../../models/User.model.js";

import { generateQuiz } from "../../integrations/gemini/quizGenerator.js";
import {
  createQuizToken,
  verifyQuizToken,
} from "../../utils/quizToken.js";

import { validateModuleNumber } from "./learnIsl.validation.js";

const MODULES = [
  {
    moduleNumber: 1,
    moduleName: "Greetings & Basic Communication",
  },
  {
    moduleNumber: 2,
    moduleName: "Family & People",
  },
  {
    moduleNumber: 3,
    moduleName: "Home & Everyday Life",
  },
  {
    moduleNumber: 4,
    moduleName: "Food & Drinks",
  },
  {
    moduleNumber: 5,
    moduleName: "Education & Work",
  },
  {
    moduleNumber: 6,
    moduleName: "Numbers, Time & Calendar",
  },
  {
    moduleNumber: 7,
    moduleName: "Travel, Places & Directions",
  },
];

export const getModules = async (userId) => {
  // Fetch user's score records
  const user = await User.findById(userId).select("moduleScores").lean();

  const scoreMap = new Map(
    (user?.moduleScores || []).map((item) => [
      item.moduleNumber,
      item.bestScore,
    ])
  );

  // Return static modules enriched with the user's bestScore
  return MODULES.map((module) => ({
    ...module,
    score: scoreMap.get(module.moduleNumber) || 0,
  }));
};

export const getModuleSigns = async (moduleNumber) => {
  const number = validateModuleNumber(moduleNumber);

  const signs = await LearnSign.find({
    moduleNumber: number,
  })
    .select("_id moduleNumber moduleName signName")
    .sort({ signName: 1 })
    .lean();

  return signs;
};

export const getSignById = async (signId) => {
  const sign = await LearnSign.findById(signId)
    .select(
      "_id moduleNumber moduleName signName meaning usage videoUrl"
    )
    .lean();

  if (!sign) {
    throw new Error("Sign not found");
  }

  return sign;
};

export const createModuleQuiz = async (moduleNumber) => {
  const number = validateModuleNumber(moduleNumber);

  const module = MODULES.find(
    (item) => item.moduleNumber === number
  );

  const signs = await LearnSign.find({
    moduleNumber: number,
  })
    .select(
      "_id signName meaning usage videoUrl moduleNumber"
    )
    .sort({ signName: 1 })
    .lean();

  if (signs.length < 4) {
    throw new Error(
      "At least 4 signs are required to generate a quiz"
    );
  }

  const generatedQuiz = await generateQuiz(
    module.moduleName,
    signs
  );

  if (
    !generatedQuiz?.questions ||
    generatedQuiz.questions.length !== 10
  ) {
    throw new Error(
      "Gemini generated an invalid quiz"
    );
  }

  const signMap = new Map(
    signs.map((sign) => [sign.signName, sign])
  );

  const questions = generatedQuiz.questions.map(
    (question, index) => {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer
      ) {
        throw new Error(
          `Invalid generated question ${index + 1}`
        );
      }

      const uniqueOptions = [
        ...new Set(question.options),
      ];

      if (uniqueOptions.length !== 4) {
        throw new Error(
          `Question ${index + 1} has duplicate options`
        );
      }

      if (!signMap.has(question.correctAnswer)) {
        throw new Error(
          `Invalid correct answer in question ${index + 1}`
        );
      }

      for (const option of uniqueOptions) {
        if (!signMap.has(option)) {
          throw new Error(
            `Invalid option in question ${index + 1}`
          );
        }
      }

      return {
        question: question.question,

        options: uniqueOptions.map((signName) => {
          const sign = signMap.get(signName);

          return {
            signName: sign.signName,
            videoUrl: sign.videoUrl,
          };
        }),

        correctAnswer: question.correctAnswer,
      };
    }
  );

  const tokenPayload = {
    moduleNumber: number,

    answers: questions.map((question) => ({
      correctAnswer: question.correctAnswer,
    })),

    expiresAt: Date.now() + 30 * 60 * 1000,
  };

  const quizToken = createQuizToken(tokenPayload);

  // Never send correctAnswer to frontend.
  const publicQuestions = questions.map(
    ({ correctAnswer, ...question }) => question
  );

  return {
    moduleNumber: number,
    moduleName: module.moduleName,
    questions: publicQuestions,
    quizToken,
  };
};

export const submitModuleQuiz = async (
  userId,
  quizToken,
  answers
) => {
  if (!quizToken) {
    throw new Error("Quiz token is required");
  }

  const quiz = verifyQuizToken(quizToken);

  if (!Array.isArray(answers) || answers.length !== 10) {
    throw new Error("Exactly 10 answers are required");
  }

  let score = 0;

  for (let i = 0; i < quiz.answers.length; i++) {
    const submittedAnswer = answers.find(
      (answer) => answer.questionIndex === i
    );

    if (
      submittedAnswer &&
      submittedAnswer.selectedAnswer ===
        quiz.answers[i].correctAnswer
    ) {
      score += 10;
    }
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const existingScore = user.moduleScores.find(
    (item) => item.moduleNumber === quiz.moduleNumber
  );

  if (existingScore) {
    if (score > existingScore.bestScore) {
      existingScore.bestScore = score;
    }

    existingScore.lastAttemptedAt = new Date();
  } else {
    user.moduleScores.push({
      moduleNumber: quiz.moduleNumber,
      bestScore: score,
      lastAttemptedAt: new Date(),
    });
  }

  await user.save();

  const updatedScore = user.moduleScores.find(
    (item) => item.moduleNumber === quiz.moduleNumber
  );

  return {
    score,
    bestScore: updatedScore.bestScore,
    moduleNumber: quiz.moduleNumber,
  };
};