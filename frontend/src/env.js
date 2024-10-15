// Updated env.js without dotenv
import process from 'process';

const loadEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${nodeEnv}`);
};

loadEnv();

export default loadEnv;