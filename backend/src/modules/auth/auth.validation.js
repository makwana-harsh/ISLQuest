export const validateRegister = (data) => {
  const fields = [
    "fullName",
    "mobileNo",
    "emailId",
    "username",
    "password",
  ];

  for (const field of fields) {
    if (!data[field]?.trim()) {
      throw new Error(`${field} is required`);
    }
  }

  if (data.username.trim().length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return {
    fullName: data.fullName.trim(),
    mobileNo: data.mobileNo.trim(),
    emailId: data.emailId.trim().toLowerCase(),
    username: data.username.trim(),
    password: data.password,
  };
};

export const validateLogin = (data) => {
  if (!data.username?.trim() || !data.password) {
    throw new Error("Username and password are required");
  }

  return {
    username: data.username.trim(),
    password: data.password,
  };
};