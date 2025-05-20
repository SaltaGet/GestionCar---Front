import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";

// Definición de tipos TypeScript
type Vehicle = {
    brand: string;
    client: string;
    client_id: string;
    color: string;
    created_at: string;
    domain: string;
    id: string;
    model: string;
    updated_at: string;
    year: string;
};

export type Client = {
    created_at: string;
    cuil: string;
    dni: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    updated_at: string;
    vehicles: Vehicle[];
};

type ApiResponse = {
    body: Client[];
    message: string;
    status: boolean;
};

const getAllClients = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get<ApiResponse>("/client/get_all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

const getClientByName = async (ctx: QueryFunctionContext) => {
    const [_, name] = ctx.queryKey;
    void _;
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get<ApiResponse>(`client/get_by_name?name=${name}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    )
    return data
}

export function useClient(name?: string) {
    const { data, isLoading } = useQuery<ApiResponse, Error>({
        queryKey: ['clientsAll'],
        queryFn: getAllClients,
        staleTime: Infinity,
        retry: 2,
        enabled: Boolean(!name),
    });

    const { data: clientByName } = useQuery<ApiResponse, Error>({
        queryKey: ['clientByName', name],
        queryFn: getClientByName,
        staleTime: Infinity,
        enabled: Boolean(name),
    });

    return {
        clients: data?.body || [],
        isLoading,
        clientByName: clientByName?.body || [],
    };
}