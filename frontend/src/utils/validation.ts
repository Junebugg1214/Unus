// Validate a username
export function validateUsername(username: string): string | null {
  const regex = /^[a-zA-Z0-9_]{3,16}$/;
  return regex.test(username)
    ? null
    : "Username must be 3-16 characters long and contain only letters, numbers, and underscores.";
}

// Validate an email
export function validateEmail(email: string): string | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Please enter a valid email address.";
}

// Validate a password
export function validatePassword(password: string): string | null {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password)
    ? null
    : "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
}

// Validate that passwords match
export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  return password === confirmPassword ? null : "Passwords do not match.";
}

// Validate a URL
export function validateURL(url: string): string | null {
  const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return regex.test(url) ? null : "Please enter a valid URL.";
}

// Validate that input text is not empty
export function validateNotEmpty(inputText: string): string | null {
  return inputText.trim().length > 0 ? null : "This field cannot be empty.";
}

// Validate that text matches a specific pattern
export function validatePattern(text: string, regex: RegExp): string | null {
  return regex.test(text) ? null : "Input does not match the required pattern.";
}

// Validate form data based on validation rules
export function validateFormData(
  formData: Record<string, any>,
  validationRules: Record<string, (value: any) => string | null>
): Record<string, string | null> {
  const errors: Record<string, string | null> = {};
  for (const field in validationRules) {
    const validate = validationRules[field];
    if (validate) {
      const error = validate(formData[field]);
      if (error) {
        errors[field] = error;
      }
    }
  }
  return errors;
}

// Validate inference input
export function validateInference(text: string, file: File | null): string | null {
  if (!text.trim() && !file) {
    return "Please provide either text input or a file for inference.";
  }
  if (text.trim().length > 10000) {
    return "Inference text must be 10000 characters or less.";
  }
  if (file && file.size > 10 * 1024 * 1024) { // 10MB
    return "File size must be 10MB or less.";
  }
  return null;
}
