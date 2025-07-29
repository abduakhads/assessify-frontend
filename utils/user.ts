import { getAccessToken } from "./auth";

export const getUserRole = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user role");
    }

    const data = await response.json();
    return data.role; 
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}