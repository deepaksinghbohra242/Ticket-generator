import {apiClient , API_ENDPOINTS } from "./config";

export const authAPI = {
    login : async (email, password) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error
        }
    }

    
}