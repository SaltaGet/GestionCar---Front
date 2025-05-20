import apiGestionCar from "@/api/gestionCarApi"
import useAuthStore from "@/store/authStore"
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query"
import type { Client } from "../useClient"

// interfaz que representa cada vehículo
export interface Vehicle {
  brand: string
  client: Client
  client_id: string
  color: string
  created_at: string
  domain: string
  id: string
  model: string
  updated_at: string
  year: string
}

interface ApiResponse<T> {
  body: T
}

// función que obtiene vehículos según el dominio
const getVehicleByDomain = async (
  ctx: QueryFunctionContext
): Promise<ApiResponse<Vehicle[]>> => {
  const [, domain] = ctx.queryKey as [string, string]

  const token = useAuthStore.getState().token
  const { data } = await apiGestionCar.get<ApiResponse<Vehicle[]>>(
    `/vehicle/get_by_domain?domain=${domain}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return data
}

// hook personalizado que usa react-query para obtener vehículos por dominio
export function useVehicleSearchByDomain(domain: string) {
  const { data } = useQuery<ApiResponse<Vehicle[]>>({
    queryKey: ["vehicleByDomain", domain],
    queryFn: getVehicleByDomain,
    staleTime: Infinity,
    enabled: Boolean(domain),
  })

  return {
    vehicles: data?.body || [],
  }
}
