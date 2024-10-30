const loadEnv = (): void => {
  // Set default to 'development' if NODE_ENV is not set
  const nodeEnv = import.meta.env.MODE || 'development';
  console.log(`Environment: ${nodeEnv}`);

  // Define required environment variables with VITE_ prefix
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_API_TIMEOUT',
    'VITE_TOKEN_EXPIRY_DAYS'
  ] as const;

  // Log an error if a required environment variable is missing
  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      console.error(`Warning: Missing required environment variable: ${envVar}`);
    }
  });

  // Optionally, throw an error if critical variables are missing
  const missingEnvVars = requiredEnvVars.filter((envVar) => !import.meta.env[envVar]);
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Critical Error: Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
};

// Load environment configuration
loadEnv();

export default loadEnv;
