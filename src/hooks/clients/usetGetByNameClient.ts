import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";

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

const getClientsByName = async (ctx: QueryFunctionContext): Promise<ApiResponse> => {
    const [_, name] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get(`/client/get_by_name?name=${name}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetClientsByName(name?: string) {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['clientsByName', name],
        queryFn: getClientsByName,
        staleTime: Infinity,
        enabled: Boolean(name),
        retry: 1

    });

    return {
        clients: data?.body || [],
        isLoading
    };
}