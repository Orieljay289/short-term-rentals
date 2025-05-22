// config.ts

// Helper function to get environment variables from either client or server side
export const getEnv = (key: string, defaultValue: string = ''): string => {
  // For client-side (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  // For server-side (Node.js)
  else if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const HOSPITABLE_CONFIG = {
  API_BASE_URL: getEnv('VITE_HOSPITABLE_API_URL', "https://connect.hospitable.com/api/v1" ),
  API_VERSION: '2024-01',
  DEFAULT_CACHE_DURATION: 60, // seconds
};
console.log("Using Hospitable API base URL:", HOSPITABLE_CONFIG.API_BASE_URL);

export function getServerConfig() {
  // Try to get from either client or server environment
  const platformToken = getEnv('HOSPITABLE_PLATFORM_TOKEN');
  
  if (!platformToken) {
    throw new Error('HOSPITABLE_PLATFORM_TOKEN is not set. Please add it to your environment variables.');
  }
  
  return {
    PLATFORM_TOKEN: platformToken,
  };
}