import api from "@/lib/axios";
import { User } from "@/types";

export const getUserRole = async () => {
  try {
    const response = await api.get('/auth/users/me/');
    return response.data.role; 
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/users/me/');
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export const isProfileComplete = (user: User): boolean => {
  return !!(user.first_name && user.first_name.trim() && 
           user.last_name && user.last_name.trim());
}