import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

interface Movement {
  id: string;
  name: string;
  is_income: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: boolean;
  body: Movement[];
  message: string;
}

const getAllMovements = async (isIncome?: boolean): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/movement/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            isIncome: isIncome
        }
    });
    return data;
};

export function useGetAllMovements(isIncome?: boolean) {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['movementsAll', isIncome],
        queryFn: () => getAllMovements(isIncome),
        staleTime: Infinity
    });

    return {
        movements: data?.body || [],
        isLoading
    };
}