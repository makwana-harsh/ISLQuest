import gemini from "../../config/gemini.js";

const reviewSchema = {
  type: "object",

  properties: {
    approved: {
      type: "boolean",
    },

    issues: {
      type: "array",
      items: {
        type: "string",
      },
    },

    suggestion: {
      type: "string",
    },

    description: {
      type: "string",
    },

    meaning: {
      type: "string",
    },

    usage: {
      type: "string",
    }
  },

  required: [
    "approved",
    "issues",
    "suggestion",
    "description",
    "meaning",
    "usage",
  ],
};

export const reviewContribution = async ({
  signName,
  description,
  meaning,
  usage,
}) => {
  const prompt = `
You are an Indian Sign Language contribution reviewer for an educational
Indian Sign Language platform.

Your job is to review a user's submitted sign information before a human
moderator reviews it.

USER SUBMISSION:

Sign name:
${signName}

Description:
${description || "(not provided)"}

Meaning:
${meaning}

Usage:
${usage}


REVIEW RULES:

1. Check whether the meaning, usage and description are related
   to the given sign name.

2. Check for abusive, hateful, sexual, insulting, discriminatory,
   inappropriate or intentionally harmful content.

3. Check whether the content is nonsensical, spam-like or unrelated
   to Indian Sign Language.

5. The description is important because it explains why the user is
   contributing this sign.
   You may correct grammar, spelling and sentence structure in the
   description, but DO NOT change its actual meaning or invent information.

6. Correct grammar, spelling and clarity in meaning, usage 
   when necessary.

7. Based on the sign name, improve the meaning, usage when
   they are incomplete or poorly written.
   Do not invent highly specific factual information that cannot reasonably
   be inferred from the supplied content.

8. If some optional field is empty, keep it empty unless a useful
   correction can reasonably be generated from the sign name and the
   available information.

9. "approved" means only that the submission appears suitable for human
   moderator review.
   It DOES NOT mean that the contribution is finally approved.

10. If there are serious problems such as abusive content, unrelated
    content, spam, that clearly cannot justify the sign,
    set approved to false and explain the problems in issues.

11. Keep issues concise.

12. suggestion should give a short explanation for the moderator.

IMPORTANT:
- Do not invent a video URL.
- Do not make the final moderator decision.
- Do not remove legitimate user information from the description.
- Do not change the user's actual reason for contributing the sign.
- Return ONLY valid JSON matching the provided schema.
`;

  const response = await gemini.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",
      responseSchema: reviewSchema,
      temperature: 0.2,
      maxOutputTokens: 2500,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }
  console.log("raw response : >>>> ", response);
  console.error("reply : >>> > ",response.text);
  try {
    return JSON.parse(response.text);
  } catch {
    console.error("INVALID CONTRIBUTION REVIEW:");
    console.error(response.text);

    throw new Error("Gemini returned invalid review JSON");
  }
};