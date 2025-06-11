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

const getProductsByIdentifier = async (ctx: QueryFunctionContext): Promise<ApiResponse> => {
    const [_, identifier] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get(`/product/get_by_identifier?identifier=${identifier}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetByIdentifierProducts(identifier?: string) {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['productsByIdentifier', identifier],
        queryFn: getProductsByIdentifier,
        staleTime: Infinity,
        enabled: Boolean(identifier),
        retry: 1
    });

    return {
        products: data?.body || [],
        isLoading
    };
}