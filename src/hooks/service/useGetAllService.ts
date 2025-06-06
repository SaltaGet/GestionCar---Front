import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export interface Service {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  incomes: null;
}

interface ApiResponse {
  status: boolean;
  body: Service[];
  message: string;
}

const getAllServices = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/service/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetAllService() {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['servicesAll'],
        queryFn: getAllServices,
        staleTime: Infinity
    });

    return {
        services: data?.body || [],
        isLoading
    };
}