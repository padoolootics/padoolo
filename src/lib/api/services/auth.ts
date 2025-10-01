'use server';

import axiosClient from '../clients/axiosClient';
import { LoginResponse, UserResponse } from '../types';

export async function login(credentials: { email: string; password: string }): Promise<{ data: LoginResponse | null; error: string | null }> {
  try {
    const response = await axiosClient.post<LoginResponse>('/jwt-auth/v1/token', {
      username: credentials.email,
      password: credentials.password,
    });
    return { data: response.data, error: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || 'Login failed' };
  }
}

export async function getUser(token: string): Promise<{ data: UserResponse | null; error: string | null }> {
  try {
    const response = await axiosClient.post('/wp/v2/users/me', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User response:', response.data);
    return { data: response.data, error: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.status === 404
        ? 'User endpoint not found or user does not exist'
        : error.response?.data?.message || 'Failed to fetch user';
    return { data: null, error: message };
  }
}