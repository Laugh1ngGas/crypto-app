export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!re.test(email)) return "Invalid email format.";
  return null;
};

export const validatePassword = (password, checkSpecial = false) => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (checkSpecial && !/[^A-Za-z0-9]/.test(password))
    return "Password must contain a special character.";
  return null;
};

export const validateNickname = (nickname) => {
  if (!nickname) return "Username is required.";
  if (nickname.length < 3) return "Username must be at least 3 characters.";
  return null;
};

export const validateSignUp = (nickname, email, password) => {
  return (
    validateNickname(nickname) ||
    validateEmail(email) ||
    validatePassword(password, true)
  );
};

export const validateSignIn = (email) => {
  return validateEmail(email);
};
