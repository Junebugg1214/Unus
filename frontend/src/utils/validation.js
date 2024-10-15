export const validateUsername = (username) => {
  if (typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 50) {
    return 'Username must be between 3 and 50 characters.';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return 'Username can only contain letters, numbers, and underscores.';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Invalid email address.';
  }
  return '';
};

export const validatePassword = (password) => {
  if (password.trim().length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one uppercase letter, one number, and one special character (e.g., !@#$%^&*).';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
};

export const validateRepoUrl = (url) => {
  const urlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(\.git)?$/i;
  if (!urlRegex.test(url.trim())) {
    return 'Invalid GitHub repository URL.';
  }
  return '';
};

export const validateInputText = (inputText) => {
  if (inputText.trim().length > 500) {
    return 'Input text must be less than 500 characters.';
  }
  const disallowedCharacters = /[<>$;]/;
  if (disallowedCharacters.test(inputText.trim())) {
    return 'Input text contains disallowed characters.';
  }
  return '';
};

export const validateInferenceText = (text) => {
  if (!text.trim()) {
    return 'Inference text must not be empty.';
  }
  return '';
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [field, validate] of Object.entries(validationRules)) {
    const error = validate(formData[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};
