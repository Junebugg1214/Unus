/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Adjust this to your primary color
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444', // Adjust this to your destructive color
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6b7280', // Adjust this to your secondary color
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f3f4f6', // Adjust this to your accent color
          foreground: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}
