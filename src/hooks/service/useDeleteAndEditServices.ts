import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditServiceData {
  id: string;
  name: string;
}

const useDeleteAndEditServices = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().token;

  // Mutación para editar un servicio
  const editServiceMutation = useMutation({
    mutationFn: async (serviceData: EditServiceData) => {
      const { data } = await apiGestionCar.put(`/service/update`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de servicios para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['servicesAll'] });
    },
    onError: () => {
      alert("Ocurrió un error al editar el servicio. Por favor, contacte al administrador.");
    }
  });

  // Mutación para eliminar un servicio
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { data } = await apiGestionCar.delete(`/service/delete/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalidar la consulta de servicios para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['servicesAll'] });
    },
    onError: () => {
      alert("Ocurrió un error al eliminar el servicio. Por favor, contacte al administrador.");
    }
  });

  return {
    editService: editServiceMutation.mutate,
    editServiceAsync: editServiceMutation.mutateAsync,
    isEditing: editServiceMutation.isPending,
    deleteService: deleteServiceMutation.mutate,
    deleteServiceAsync: deleteServiceMutation.mutateAsync,
    isDeleting: deleteServiceMutation.isPending,
  };
};

export default useDeleteAndEditServices;