// File: src/utils/validation.js

export const validateUsername = (username) => {
  if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
    return 'Username must be between 3 and 50 characters.';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores.';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address.';
  }
  return '';
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one uppercase letter and one number.';
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
  const urlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(\.git)?$/;
  if (!urlRegex.test(url)) {
    return 'Invalid GitHub repository URL.';
  }
  return '';
};

export const validateInputText = (inputText) => {
  if (inputText.length > 500) {
    return 'Input text must be less than 500 characters.';
  }
  const disallowedCharacters = /[<>$;]/;
  if (disallowedCharacters.test(inputText)) {
    return 'Input text contains disallowed characters.';
  }
  return '';
};

export const validateInferenceText = (text) => {
  if (!text.trim()) {
    return "Inference text cannot be empty";
  }
  return "";
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
