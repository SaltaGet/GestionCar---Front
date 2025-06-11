import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface PurchaseProduct {
  expired_at: string;
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface EditPurchaseOrderData {
  amount: number;
  id: string;
  order_date: string;
  order_number: string;
  purchase_products: PurchaseProduct[];
  supplier_id: string;
}

const useDeleteAndEditPurchaseOrders = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar una orden de compra
  const editPurchaseOrderMutation = useMutation({
    mutationFn: async (orderData: EditPurchaseOrderData) => {
      const { data } = await apiGestionCar.put(`/purchase_order/update`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrdersAll'] });
      alert("Orden de compra editada con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al editar la orden de compra. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar una orden de compra
  const deletePurchaseOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiGestionCar.delete(`/purchase_order/delete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrdersAll'] });
      alert("Orden de compra eliminada con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al eliminar la orden de compra. Por favor, contacte al administrador.");
    }
  });

  return {
    editPurchaseOrder: editPurchaseOrderMutation.mutate,
    editPurchaseOrderAsync: editPurchaseOrderMutation.mutateAsync,
    isEditing: editPurchaseOrderMutation.isPending,
    deletePurchaseOrder: deletePurchaseOrderMutation.mutate,
    deletePurchaseOrderAsync: deletePurchaseOrderMutation.mutateAsync,
    isDeleting: deletePurchaseOrderMutation.isPending,
  };
};

export default useDeleteAndEditPurchaseOrders;