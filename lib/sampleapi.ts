import axiosInstance from './axios';

// Example API functions demonstrating usage of the axios interceptor

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await axiosInstance.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },
};

export const assessmentAPI = {
  getAssessments: async () => {
    const response = await axiosInstance.get('/assessments');
    return response.data;
  },

  getAssessment: async (id: string) => {
    const response = await axiosInstance.get(`/assessments/${id}`);
    return response.data;
  },

  createAssessment: async (data: any) => {
    const response = await axiosInstance.post('/assessments', data);
    return response.data;
  },

  updateAssessment: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id: string) => {
    const response = await axiosInstance.delete(`/assessments/${id}`);
    return response.data;
  },
};
