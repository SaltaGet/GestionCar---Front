import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  cuil: string;
  dni: string;
  email: string;
  created_at: string;
  updated_at: string;
  vehicles: null;
}

interface ApiResponse {
  status: boolean;
  body: Client[];
  message: string;
}

const getAllClients = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/client/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetAllClients() {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['clientsAll'],
        queryFn: getAllClients,
        staleTime: Infinity
    });

    return {
        clients: data?.body || [],
        isLoading
    };
}