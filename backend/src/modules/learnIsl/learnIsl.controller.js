import {
  getModules,
  getModuleSigns,
  getSignById,
  createModuleQuiz,
  submitModuleQuiz,
} from "./learnIsl.service.js";

import {
  validateModuleNumber,
  validateQuizAnswers,
} from "./learnIsl.validation.js";

export const getModulesController = async (req, res, next) => {
  try {
    const modules = await getModules(req.user.id);
    

    res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    next(error);
  }
};

export const getModuleSignsController = async (
  req,
  res,
  next
) => {
  try {
    const moduleNumber = validateModuleNumber(
      req.params.moduleNumber
    );

    const signs = await getModuleSigns(moduleNumber);

    res.status(200).json({
      moduleNumber,
      signs,
    });
  } catch (error) {
    next(error);
  }
};

export const getSignController = async (
  req,
  res,
  next
) => {
  try {
    const sign = await getSignById(req.params.signId);

    res.status(200).json({
      sign,
    });
  } catch (error) {
    next(error);
  }
};

export const createQuizController = async (req, res, next) => {
  try {
    const result = await createModuleQuiz(
      req.params.moduleNumber
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("CREATE QUIZ ERROR:", error);
    next(error);
  }
};

export const submitQuizController = async (
  req,
  res,
  next
) => {
  try {
    const answers = validateQuizAnswers(req.body.answers);

    const result = await submitModuleQuiz(
      req.user.id,
      req.body.quizToken,
      answers
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};