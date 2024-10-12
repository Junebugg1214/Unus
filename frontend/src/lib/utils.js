// File: src/lib/utils.js

/**
 * Combines multiple class names into a single string
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  /**
   * Formats a date to a readable string
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  /**
   * Truncates a string to a specified length
   * @param {string} str - String to truncate
   * @param {number} n - Maximum length
   * @returns {string} Truncated string
   */
  export function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }
  
  /**
   * Debounces a function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Capitalizes the first letter of a string
   * @param {string} string - String to capitalize
   * @returns {string} Capitalized string
   */
  export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Add any other utility functions you might need here