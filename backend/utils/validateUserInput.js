// User input validation utility
export function validateSignup({ username, email, password }) {
  if (!username || !email || !password) return false;
  if (password.length < 6) return false;
  // Add more validation as needed
  return true;
}

export function validateLogin({ email, password }) {
  if (!email || !password) return false;
  return true;
}
