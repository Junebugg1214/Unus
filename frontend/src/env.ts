import process from 'process';

const loadEnv = (): void => {
  // Set default to 'development' if NODE_ENV is not set
  const nodeEnv = process.env['NODE_ENV'] || 'development';
  console.log(`Environment: ${nodeEnv}`);

  // Verify essential environment variables
  const requiredEnvVars = [
    'REACT_APP_API_URL', 
    'REACT_APP_API_TIMEOUT', 
    'REACT_APP_TOKEN_EXPIRY_DAYS'
  ] as const;

  // Log an error if a required environment variable is missing
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Warning: Missing required environment variable: ${envVar}`);
    }
  });

  // Optionally, throw an error if critical variables are missing
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Critical Error: Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
};

// Load environment configuration
loadEnv();

export default loadEnv;
