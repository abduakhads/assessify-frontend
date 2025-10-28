export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && !isTokenExpired(token);
};

export const getTokenExpirationTime = (token: string): number | null => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  
  if (refreshToken) {
    try {
      // Import axios here to avoid circular dependency
      const { default: api } = await import('@/lib/axios');
      
      // Send blacklist request to the server
      await api.post('/token/blacklist/', {
        refresh: refreshToken
      });
    } catch (error) {
      console.error('Error blacklisting token:', error);
      // Continue with logout even if blacklist fails
    }
  }
  
  // Clear tokens from localStorage
  clearTokens();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};


