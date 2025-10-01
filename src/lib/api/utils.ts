export interface ApiError {
  code: string;
  message: string;
  data?: { status: number };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any): ApiError => ({
  code: error.response?.data?.code || "unknown",
  message: error.response?.data?.message || "Request failed",
  data: error.response?.data?.data,
});
