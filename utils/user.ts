import api from "@/lib/axios";

export const getUserRole = async () => {
  try {
    const response = await api.get('/auth/users/me/');
    return response.data.role; 
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}