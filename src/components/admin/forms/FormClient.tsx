import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";

type ClientData = {
  cuil: string;
  dni: string;
  email: string;
  first_name: string;
  last_name: string;
};

const postClient = async (formData: ClientData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/client/create", formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

type FormClientProps = {
  onCancel?: () => void; // Haciendo onCancel opcional
};

export const FormClient = ({ onCancel }: FormClientProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientData>();

  const { mutate, isPending } = useMutation({
    mutationFn: postClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsAll"] });
      if (onCancel){
        onCancel();
      }else{
        reset()
        alert("Cliente creado con exito");
      }; // Solo llama a onCancel si existe
    },
    onError: () => {
      alert("Error contacte al administrador o intente nuevamente mas tarde");
    },
  });

  const onSubmit = (data: ClientData) => mutate(data);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Crear Cliente
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Sección Información Personal */}
        <fieldset className="space-y-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <legend className="text-sm font-medium text-blue-600 px-2">
            Información Personal
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                {...register("first_name", { required: "Este campo es requerido" })}
                className={`w-full px-3 py-2 rounded border ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                placeholder="Nombre"
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                {...register("last_name", { required: "Este campo es requerido" })}
                className={`w-full px-3 py-2 rounded border ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                placeholder="Apellido"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Sección Documentación */}
        <fieldset className="space-y-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <legend className="text-sm font-medium text-green-600 px-2">
            Documentación
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI *
              </label>
              <input
                type="text"
                {...register("dni", {
                  required: "Este campo es requerido",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                })}
                className={`w-full px-3 py-2 rounded border ${
                  errors.dni ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-200 focus:border-green-400`}
                placeholder="DNI"
              />
              {errors.dni && (
                <p className="mt-1 text-xs text-red-600">{errors.dni.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CUIL
              </label>
              <input
                type="text"
                {...register("cuil", {
                  pattern: { value: /^[0-9-]+$/, message: "Formato inválido" },
                })}
                className={`w-full px-3 py-2 rounded border ${
                  errors.cuil ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-200 focus:border-green-400`}
                placeholder="CUIL"
              />
              {errors.cuil && (
                <p className="mt-1 text-xs text-red-600">{errors.cuil.message}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Sección Contacto */}
        <fieldset className="space-y-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <legend className="text-sm font-medium text-purple-600 px-2">
            Contacto
          </legend>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className={`w-full px-3 py-2 rounded border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-purple-200 focus:border-purple-400`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </fieldset>

        {/* Acciones */}
        <div className="pt-2">
          {!isPending ? (
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
            >
              <FaSave className="text-sm" />
              <span>Guardar Cliente</span>
            </button>
          ) : (
            <Spinner size="md" color="text-blue-600" className="mx-auto" />
          )}
        </div>
      </form>
    </div>
  );
};