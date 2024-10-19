// Utility function to concatenate class names conditionally
export function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  // Utility function to format a date object as a string
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  // Utility function to truncate a string
  export function truncateString(str: string, n: number): string {
    return str.length > n ? `${str.substring(0, n)}...` : str;
  }
  
  // Utility function to debounce a function
  export function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }
  
  // Utility function to capitalize the first letter of each word in a string
  export function capitalizeWords(string: string): string {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  }
  
  // Utility function to throttle a function
  export function throttle(func: (...args: any[]) => void, limit: number): (...args: any[]) => void {
    let inThrottle: boolean = false;
    return (...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
  
  // Utility function to get a random number between a min and max value
  export function getRandomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  