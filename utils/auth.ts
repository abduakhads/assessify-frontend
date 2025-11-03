export const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
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
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // If we have a refresh token, we can consider the user authenticated
  // even if the access token is expired (it will be refreshed by axios interceptor)
  if (refreshToken) {
    return true;
  }
  
  // Otherwise, check if we have a valid access token
  return accessToken !== null && !isTokenExpired(accessToken);
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

// Refresh the access token using the refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, refreshToken);
      return data.access;
    } else {
      // Refresh token is invalid, clear tokens and redirect to login
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Get a valid access token, refreshing if necessary
export const getValidAccessToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken();
  
  if (!accessToken) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    // Try to refresh
    accessToken = await refreshAccessToken();
  }

  return accessToken;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  
  if (refreshToken) {
    try {
      // Send blacklist request to the server using fetch directly
      // to avoid circular dependency with axios
      const accessToken = getAccessToken();
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/blacklist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
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


