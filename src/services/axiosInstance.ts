import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const skipRefresh =
    originalRequest.url?.includes("/login") ||
    originalRequest.url?.includes("/register") ||
    originalRequest.url?.includes("/refresh-token");

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh endpoint
        const res = await axios.post(
          `${API_BASE}/auth-service/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              'x-internal-service': 'true'
            }
          }
        );
        const { authToken } = res.data;

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        processQueue(null, authToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${authToken}`;
        return axiosInstance(originalRequest);
      }  catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // If refresh fails, clear tokens and let Redux handle logout
        if (
          refreshError?.response?.status === 401 ||
          refreshError?.response?.status === 403
        ) {
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          // Optionally: dispatch a logout action if you have access to the store here
          // import store from '../../app/store';
          // store.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;