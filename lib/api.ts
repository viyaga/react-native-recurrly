import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_PAYLOAD_API_URL;

export const TOKEN_KEY = 'auth_token';

async function getAuthHeader() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    return { Authorization: `JWT ${token}` };
  }
  return {};
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}
