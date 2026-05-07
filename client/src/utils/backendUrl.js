/**
 * Returns the correct backend URL based on the environment:
 * - In dev mode (npm run dev): http://localhost:5000
 * - In production build:       https://attainers.vercel.app (via VITE_BACKEND_URL)
 */
const backendUrl = import.meta.env.DEV
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_BACKEND_URL || 'https://attainers.vercel.app');

export default backendUrl;
