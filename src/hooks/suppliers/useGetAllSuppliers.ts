import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: boolean;
  body: Supplier[];
  message: string;
}

const getAllSuppliers = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/supplier/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetAllSuppliers() {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['suppliersAll'],
        queryFn: getAllSuppliers,
        staleTime: Infinity
    });

    return {
        suppliers: data?.body || [],
        isLoading
    };
}