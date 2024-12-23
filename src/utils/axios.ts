import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/',
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      console.warn('Service token is not available in local storage');
      // If the token is not found, redirect to the login page
      window.location.href = '/';
      // Optionally, you could throw an error or return a rejected promise to halt the request:
      // return Promise.reject(new Error('No service token available'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Uncomment this section to handle response errors like unauthorized access
// axiosServices.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401 && !window.location.href.includes('/login')) {
//       window.location.pathname = '/maintenance/500';
//     }
//     return Promise.reject((error.response && error.response.data) || 'Wrong Services');
//   }
// );

export default axiosServices;

// Fetcher for GET requests
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const res = await axiosServices.get(url, { ...config });
    return res.data;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error; // Optionally throw the error for further handling in the calling function
  }
};

// Fetcher for POST requests
export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const res = await axiosServices.post(url, { ...config });
    return res.data;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error; // Optionally throw the error for further handling in the calling function
  }
};
