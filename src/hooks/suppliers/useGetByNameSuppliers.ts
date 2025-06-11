import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";

interface Supplier {
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

const getSuppliersByName = async (ctx: QueryFunctionContext): Promise<ApiResponse> => {
    const [_, name] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get(`/supplier/get_by_name?name=${name}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetSuppliersByName(name?: string) {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['suppliersByName', name],
        queryFn: getSuppliersByName,
        staleTime: Infinity,
        enabled: Boolean(name),
        retry: 1
    });

    return {
        suppliers: data?.body || [],
        isLoading
    };
}