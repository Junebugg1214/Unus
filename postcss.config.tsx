import type { Config } from 'postcss-load-config';

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

const isProduction = process.env.NODE_ENV === 'production';

const config: Config = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    tailwindcss: {
      config: './tailwind.config.js',
    },
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 4 versions',
        'not dead',
        'not ie <= 11',
      ],
      grid: true,
    },
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
      },
    },
    ...(isProduction ? { cssnano: {} } : {}),
    'postcss-reporter': {
      clearReportedMessages: true,
    },
  },
};

export default config;