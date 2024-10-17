// Validation functions

// Validate a username
export function validateUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{3,16}$/; // Example: alphanumeric with underscores, between 3 to 16 characters
  return regex.test(username);
}

// Validate an email
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Example email regex
  return regex.test(email);
}

// Validate a password
export function validatePassword(password: string): boolean {
  // Password example rule: At least 8 characters, one uppercase, one lowercase, one number, and one special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Validate that passwords match
export function validateConfirmPassword(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

// Validate a URL
export function validateURL(url: string): boolean {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i; // Example URL regex
  return regex.test(url);
}

// Validate that input text is not empty
export function validateNotEmpty(inputText: string): boolean {
  return inputText.trim().length > 0;
}

// Validate that text matches a specific pattern
export function validatePattern(text: string, regex: RegExp): boolean {
  return regex.test(text);
}

// Validate form data based on validation rules
export function validateFormData(formData: Record<string, any>, validationRules: Record<string, (value: any) => boolean>): boolean {
  for (const field in validationRules) {
      const validate = validationRules[field];
      if (validate && !validate(formData[field])) {
          return false;
      }
  }
  return true;
}

