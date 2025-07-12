// Utility functions for authentication state management

export const getStoredToken = (): string | null => {
  return localStorage.getItem('userToken');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('userToken', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('userToken');
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Basic token validation - check if it's a valid JWT format
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const initializeAuthState = () => {
  const token = getStoredToken();
  if (token && isTokenValid(token)) {
    return { token };
  } else {
    // Clear invalid token
    removeStoredToken();
    return { token: null };
  }
}; 