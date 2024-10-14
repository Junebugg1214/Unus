import dotenv from 'dotenv';

const loadEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFileName = `.env.${nodeEnv}`;

  const result = dotenv.config({ path: envFileName });

  if (result.error) {
    throw result.error;
  }

  console.log(`Loaded environment variables from ${envFileName}`);
};

loadEnv();

export default loadEnv;