import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";

type ServiceData = {
  name: string;
};

const postService = async (formData: ServiceData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/service/create", formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

type FormServiceProps = {
  onCancel?: () => void;
};

export const FormService = ({ onCancel }: FormServiceProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceData>();

  const { mutate, isPending } = useMutation({
    mutationFn: postService,
    onSuccess: () => {
      reset();
      alert("Servicio creado con exito"); // Limpia el formulario después del envío exitoso
      if (onCancel) onCancel(); // Cierra el modal si existe la prop
    },
    onError: () => {
      alert("Error al crear el servicio. Intente nuevamente más tarde.");
    },
  });

  const onSubmit = (data: ServiceData) => mutate(data);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Crear Servicio
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <fieldset className="space-y-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <legend className="text-sm font-medium text-blue-600 px-2">
            Información del Servicio
          </legend>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              {...register("name", { 
                required: "Este campo es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres"
                }
              })}
              className={`w-full px-3 py-2 rounded border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
              placeholder="Ej: Cambio de aceite"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </fieldset>

        <div className="pt-2 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          )}
          
          {!isPending ? (
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
            >
              <FaSave className="text-sm" />
              <span>Guardar Servicio</span>
            </button>
          ) : (
            <Spinner size="md" color="text-blue-600" />
          )}
        </div>
      </form>
    </div>
  );
};