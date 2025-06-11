import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

interface IncomeData {
  amount: number;
  client_id: string;
  details: string;
  employee_id?: string;
  movement_type_id: string;
  services_id: string[];
  ticket: string;
  vehicle_id: string;
}

interface ApiResponse {
  // Define aquí la estructura de la respuesta de tu API si es conocida
  // Por ejemplo:
  status: boolean;
  message: string;
  body: string;
}

const postIncome = async (form: IncomeData): Promise<ApiResponse> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/income/create", form, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  return data;
};

export function usePostIncome() {
  const { mutate, isPending } = useMutation<ApiResponse, Error, IncomeData>({
    mutationFn: postIncome,
    onSuccess: () => {
      alert("Ingreso creado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al crear el ingreso");
    },
  });

  return {
    postIncome: mutate,
    isPostingIncome: isPending, // Puedes llamarlo isPostingIncome o isPending, como prefieras
  };
}