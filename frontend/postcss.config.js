const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    'postcss-import': {},                // Handles @import rules in CSS
    'postcss-nested': {},                // Enables nested CSS syntax
    tailwindcss: {
      config: './tailwind.config.js',    // Use a custom Tailwind configuration file
    },
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',                          // Target browsers with more than 1% market share
        'last 4 versions',               // The last 4 versions of all browsers
        'not dead',                      // Exclude browsers that are no longer maintained
        'not ie <= 11',                  // Exclude Internet Explorer 11 and below
      ],
      grid: true,                        // Enable Grid translations for older specifications
    },
    'postcss-preset-env': {
      stage: 1,                          // Use stage 1 features for future CSS compatibility
      features: {
        'nesting-rules': true,           // Enable support for CSS nesting
      },
    },
    ...(isProduction ? { cssnano: {} } : {}),  // Minify CSS only in production
    'postcss-reporter': {
      clearReportedMessages: true,       // Report any warnings or errors clearly
    },
  },
};
