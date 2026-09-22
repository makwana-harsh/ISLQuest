import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const getKey = () => {
  return crypto
    .createHash("sha256")
    .update(process.env.QUIZ_TOKEN_SECRET)
    .digest();
};

export const createQuizToken = (payload) => {
  const iv = crypto.randomBytes(12);
  const key = getKey();

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
};

export const verifyQuizToken = (token) => {
  try {
    const [ivPart, authTagPart, encryptedPart] = token.split(".");

    if (!ivPart || !authTagPart || !encryptedPart) {
      throw new Error("Invalid quiz token");
    }

    const key = getKey();

    const iv = Buffer.from(ivPart, "base64url");
    const authTag = Buffer.from(authTagPart, "base64url");
    const encrypted = Buffer.from(encryptedPart, "base64url");

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      iv
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    const payload = JSON.parse(decrypted.toString("utf8"));

    if (payload.expiresAt < Date.now()) {
      throw new Error("Quiz expired");
    }

    return payload;
  } catch {
    throw new Error("Invalid or expired quiz token");
  }
};