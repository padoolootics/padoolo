import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WP_API_URL,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Function to set the Authorization token
export const setToken = (token: string | null): void => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

// Function to set the Authorization token
export const setAuthToken = (token: string | null): void => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

// Response body extraction
const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

// Requests object to handle HTTP requests
const requests = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: <T>(url: string, params?: Record<string, any>): Promise<T> =>
    instance.get(url, { params }).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, body: any, headers?: AxiosRequestConfig['headers']): Promise<T> =>
    instance.post(url, body, { headers }).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, body: any): Promise<T> =>
    instance.put(url, body).then(responseBody),
  delete: <T>(url: string): Promise<T> =>
    instance.delete(url).then(responseBody),
};

export default requests;