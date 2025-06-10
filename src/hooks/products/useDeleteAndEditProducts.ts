import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface EditProductData {
  id: string;
  identifier: string;
  name: string;
}

interface UpdateStockData {
  id: string;
  method: 'add' | 'subtract' | 'update';
  stock: number;
}

const useDeleteAndEditProducts = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar un producto
  const editProductMutation = useMutation({
    mutationFn: async (productData: EditProductData) => {
      const { data } = await apiGestionCar.put(`/product/update`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsAll'] });
      alert("Producto editado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al editar el producto. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar un producto
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await apiGestionCar.delete(`/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsAll'] });
      alert("Producto eliminado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al eliminar el producto. Por favor, contacte al administrador.");
    }
  });

  // Mutación para actualizar el stock de un producto
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, method, stock }: UpdateStockData) => {
      const { data } = await apiGestionCar.put(
        `/product/update-stock/`,
        { id, method, stock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsAll'] });
      alert("Stock actualizado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al actualizar el stock. Por favor, contacte al administrador.");
    }
  });

  return {
    editProduct: editProductMutation.mutate,
    editProductAsync: editProductMutation.mutateAsync,
    isEditing: editProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutate,
    deleteProductAsync: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isPending,
    updateStock: updateStockMutation.mutate,
    updateStockAsync: updateStockMutation.mutateAsync,
    isUpdatingStock: updateStockMutation.isPending,
  };
};

export default useDeleteAndEditProducts;