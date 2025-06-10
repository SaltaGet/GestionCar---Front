import apiGestionCar from "@/api/gestionCarApi"
import useAuthStore from "@/store/authStore"
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query"

// interfaz que representa cada vehículo
export interface Vehicle {
  brand: string
  client: string
  client_id: string
  color: string
  created_at: string
  domain: string
  id: string
  model: string
  updated_at: string
  year: string
}

// interfaz para la respuesta de la API, que contiene un body con arreglo de vehículos
interface ApiResponse<T> {
  body: T
}

// función que obtiene vehículos de un cliente según el id
const getVehicleByClient = async (ctx: QueryFunctionContext): Promise<ApiResponse<Vehicle[]>> => {
  const [_, id] = ctx.queryKey
  void _

  const token = useAuthStore.getState().token
  const { data } = await apiGestionCar.get<ApiResponse<Vehicle[]>>(`/vehicle/get_by_client/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data
}

// hook personalizado que usa react-query para obtener vehículos
export function useVehicleSearchById(id: string) {
  const { data, isLoading } = useQuery<ApiResponse<Vehicle[]>>({
    queryKey: ['vehicleByClient', id],
    queryFn: getVehicleByClient,
    staleTime: Infinity,
    enabled: Boolean(id)
  })

  return {
    vehicles: data?.body || [],
    isLoading
  }
}
