import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export interface Product {
  id: string;
  identifier: string;
  name: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: boolean;
  body: Product[];
  message: string;
}

const getAllProducts = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/product/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetAllProducts() {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['productsAll'],
        queryFn: getAllProducts,
        staleTime: Infinity
    });

    return {
        products: data?.body || [],
        isLoading
    };
}