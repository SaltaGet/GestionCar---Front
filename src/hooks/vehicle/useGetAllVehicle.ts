import useAuthStore from "@/store/authStore"
import apiGestionCar from "@/api/gestionCarApi"
import { useQuery } from "@tanstack/react-query"


export type Client = {
    created_at: string;
    cuil: string;
    dni: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    updated_at: string;
    vehicles: null;
};

export interface Vehicle {
  id: string
  brand: string
  model: string
  color: string
  year: string
  domain: string
  client_id: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  status: boolean
  body: Vehicle[]
  message: string
}

const getAllVehicles = async (): Promise<ApiResponse> => {
  const token = useAuthStore.getState().token
  const { data } = await apiGestionCar.get<ApiResponse>(
    `/vehicle/get_all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return data
}

export function useGetAllVehicles() {
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["vehicleByDomain"],
    queryFn: getAllVehicles,
    staleTime: Infinity,
  })

  return {
    vehicles: data?.body || [],
    isLoading
  }
}