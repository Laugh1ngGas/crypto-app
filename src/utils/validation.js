const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignIn = (email, password) => {
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  if (!password) {
    return "Please enter your password.";
  }
  return null;
};

export const validateSignUp = (nickname, email, password) => {
  if (!nickname.trim()) {
    return "Please enter a username.";
  }
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
};
