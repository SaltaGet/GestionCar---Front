import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave} from "react-icons/fa";

type ClientData = {
  cuil: string;
  dni: string;
  email: string;
  first_name: string;
  last_name: string;
};


const postClient = async (formData: ClientData) => {
    const token = useAuthStore.getState().token
    const {data} = await apiGestionCar.post("/client/create",formData,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    return data;
}

export const FormClient = ({
    onCancel,
  }: {
    onCancel: () => void;
  }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientData>({
  });

  const {mutate,isPending} = useMutation({
    mutationFn: postClient,
    onSuccess: (data) => {
      console.log(data)
      onCancel();
    },
    onError: () => {
      alert("Error contacte al administrador o intente nuevamente mas tarde") 
    }
  })

  const onSubmit = (data: ClientData) => {
    console.log("Datos enviados:", data);
    mutate(data)
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Crear Cliente</h1>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          {...register("first_name", { required: "Este campo es requerido" })}
          className={`w-full p-2 rounded-md shadow-sm border ${
            errors.first_name ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-indigo-500`}
          placeholder="Ingrese el nombre"
        />
        {errors.first_name && (
          <p className="text-sm text-red-600 mt-1">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
        <input
          type="text"
          {...register("last_name", { required: "Este campo es requerido" })}
          className={`w-full p-2 rounded-md shadow-sm border ${
            errors.last_name ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-indigo-500`}
          placeholder="Ingrese el apellido"
        />
        {errors.last_name && (
          <p className="text-sm text-red-600 mt-1">{errors.last_name.message}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
        <input
          type="text"
          {...register("dni", {
            required: "Este campo es requerido",
            pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" },
          })}
          className={`w-full p-2 rounded-md shadow-sm border ${
            errors.dni ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-indigo-500`}
          placeholder="Ingrese el DNI"
        />
        {errors.dni && (
          <p className="text-sm text-red-600 mt-1">{errors.dni.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CUIL</label>
        <input
          type="text"
          {...register("cuil", {
            pattern: { value: /^[0-9-]+$/, message: "Formato inválido" },
          })}
          className={`w-full p-2 rounded-md shadow-sm border ${
            errors.cuil ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-indigo-500`}
          placeholder="Ingrese el CUIL"
        />
        {errors.cuil && (
          <p className="text-sm text-red-600 mt-1">{errors.cuil.message}</p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        {...register("email", {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email inválido",
          },
        })}
        className={`w-full p-2 rounded-md shadow-sm border ${
          errors.email ? "border-red-500" : "border-gray-300"
        } focus:ring-2 focus:ring-indigo-500`}
        placeholder="Ingrese el email"
      />
      {errors.email && (
        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
      )}
    </div>

    {!isPending ? (
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <FaSave /> Guardar Cliente
        </button>
      </div>
    ) : (
      <Spinner size="md" color="text-blue-500" className="mx-auto" />
    )}
  </form>
</div>

  );
};