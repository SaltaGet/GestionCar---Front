import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditSupplierData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const useDeleteAndEditSuppliers = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar un proveedor
  const editSupplierMutation = useMutation({
    mutationFn: async (supplierData: EditSupplierData) => {
      const { data } = await apiGestionCar.put(`/supplier/update`, supplierData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de proveedores para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['suppliersAll'] });
    },
    onError: () => {
      alert("Ocurrió un error al editar el proveedor. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar un proveedor
  const deleteSupplierMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const { data } = await apiGestionCar.delete(`/supplier/delete/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de proveedores para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['suppliersAll'] });
    },
    onError: () => {
      alert("Ocurrió un error al eliminar el proveedor. Por favor, contacte al administrador.");
    }
  });

  return {
    editSupplier: editSupplierMutation.mutate,
    editSupplierAsync: editSupplierMutation.mutateAsync,
    isEditing: editSupplierMutation.isPending,
    deleteSupplier: deleteSupplierMutation.mutate,
    deleteSupplierAsync: deleteSupplierMutation.mutateAsync,
    isDeleting: deleteSupplierMutation.isPending,
  };
};

export default useDeleteAndEditSuppliers;