export const validateContribution = ({
  signName,
  meaning,
  usage,
}) => {
  if (!signName?.trim()) {
    throw new Error("Sign name is required");
  }

  if (!meaning?.trim()) {
    throw new Error("Meaning is required");
  }

  if (!usage?.trim()) {
    throw new Error("Usage is required");
  }
};