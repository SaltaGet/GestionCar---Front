import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditMovementData {
  id: string;
  name: string;
  is_income: boolean;
}

const useDeleteAndEditMovements = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar un movimiento
  const editMovementMutation = useMutation({
    mutationFn: async (movementData: EditMovementData) => {
      const { data } = await apiGestionCar.put(`/movement/update`, movementData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movementsAll'] });
      alert("Movimiento editado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al editar el movimiento. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar un movimiento
  const deleteMovementMutation = useMutation({
    mutationFn: async (movementId: string) => {
      const { data } = await apiGestionCar.delete(`/movement/delete/${movementId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movementsAll'] });
      alert("Movimiento eliminado con éxito");
    },
    onError: () => {
      alert("Ocurrió un error al eliminar el movimiento. Por favor, contacte al administrador.");
    }
  });

  return {
    editMovement: editMovementMutation.mutate,
    editMovementAsync: editMovementMutation.mutateAsync,
    isEditing: editMovementMutation.isPending,
    deleteMovement: deleteMovementMutation.mutate,
    deleteMovementAsync: deleteMovementMutation.mutateAsync,
    isDeleting: deleteMovementMutation.isPending,
  };
};

export default useDeleteAndEditMovements;