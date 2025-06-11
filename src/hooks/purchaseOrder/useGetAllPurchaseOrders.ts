import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export interface PurchaseOrder {
  id: string;
  order_number: string;
  order_date: string;
  amount: number;
  supplier_id: string;
  created_at: string;
  updated_at: string;
  supplier: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  purchase_products: null;
}

interface ApiResponse {
  status: boolean;
  body: PurchaseOrder[];
  message: string;
}

const getAllPurchaseOrders = async (): Promise<ApiResponse> => {
    const token = useAuthStore.getState().token;
    const { data } = await apiGestionCar.get('/purchase_order/get_all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export function useGetAllPurchaseOrders() {
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['purchaseOrdersAll'],
        queryFn: getAllPurchaseOrders,
        staleTime: Infinity
    });

    return {
        purchaseOrders: data?.body || [],
        isLoading
    };
}