import gemini from "../../config/gemini.js";

const quizSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: { type: "string" },
          },
          correctAnswer: { type: "string" },
        },
        required: ["question", "options", "correctAnswer"],
      },
    },
  },
  required: ["questions"],
};

// Helper function to retry API calls when hit by 429 (rate limits) or 503 (high demand)
const generateContentWithRetry = async (model, prompt, retries = 1, delayMs = 1500) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await gemini.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema,
          temperature: 0.3,
          maxOutputTokens: 5000,
        },
      });
    } catch (error) {
      const isRateLimit = error.status === 429;
      const isUnavailable = error.status === 503;

      if ((isRateLimit || isUnavailable) && attempt < retries) {
        console.warn(
          `[${model}] Hit HTTP ${error.status}. Retrying in ${delayMs}ms (Attempt ${attempt}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2; // Increase delay exponentially
      } else {
        throw error;
      }
    }
  }
};

export const generateQuiz = async (moduleName, signs) => {
  const signData = signs.map((sign) => ({
    signName: sign.signName,
    meaning: sign.meaning,
    usage: sign.usage,
  }));

  const prompt = `
Create a beginner Indian Sign Language quiz.

Module: ${moduleName}

Available signs:
${JSON.stringify(signData)}

Generate exactly 10 questions.

Rules:
- Each question has exactly 4 options.
- Every option must be one of the provided signName values.
- correctAnswer must be one of the options.
- Do not invent sign names.
- Keep questions short.
- Return only JSON matching the schema.
`;

  // Models supported by @google/genai SDK v1beta
  const modelsToTry = [
    "gemini-1.5-flash",
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await generateContentWithRetry(model, prompt);

      if (response && response.text) {
        return JSON.parse(response.text);
      }
    } catch (error) {
      console.warn(`Model ${model} failed (${error.status || error.message}). Trying fallback...`);
      lastError = error;
    }
  }

  throw new Error(`Quiz generation failed: ${lastError?.message || "Unknown error"}`);
};