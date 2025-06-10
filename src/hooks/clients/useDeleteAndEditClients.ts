import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditClientData {
  cuil: string;
  dni: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
}

const useDeleteAndEditClients = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar un cliente
  const editClientMutation = useMutation({
    mutationFn: async (clientData: EditClientData) => {
      console.log(clientData);
      const { data } = await apiGestionCar.put(`/client/update`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de clientes para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['clientsAll'] });
      alert("Cliente editado con exito");
    },
    onError: () => {
      alert("Ocurrió un error al editar el cliente. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar un cliente
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { data } = await apiGestionCar.delete(`/client/delete/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de clientes para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['clientsAll'] });
      alert("Cliente eliminado con exito");
    },
    onError: () => {
      alert("Ocurrió un error al eliminar el cliente. Por favor, contacte al administrador.");
    }
  });

  return {
    editClient: editClientMutation.mutate,
    editClientAsync: editClientMutation.mutateAsync,
    isEditing: editClientMutation.isPending,
    deleteClient: deleteClientMutation.mutate,
    deleteClientAsync: deleteClientMutation.mutateAsync,
    isDeleting: deleteClientMutation.isPending,
  };
};

export default useDeleteAndEditClients;