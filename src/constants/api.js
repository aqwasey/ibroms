export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.OTHER_SERVICE_URL ||
  import.meta.env.VITE_BUSINESS_BASE_API ||
  import.meta.env.VITE_PEOPLE_BASE_API ||
  'https://beeco-api.onrender.com';

export default API_BASE_URL;
