import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";

interface Product {
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

const getProductsByName = async (ctx: QueryFunctionContext): Promise<ApiResponse> => {
    const [_, name] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get(`/product/get_by_name?name=${name}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetByNameProducts(name?: string) {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['productsByName', name],
        queryFn: getProductsByName,
        staleTime: Infinity,
        enabled: Boolean(name),
        retry: 1
    });

    return {
        products: data?.body || [],
        isLoading
    };
}