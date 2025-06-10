import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";

type TransactionTypeData = {
  is_income: boolean;
  name: string;
};

const postTransactionType = async (formData: TransactionTypeData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/movement/create", formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

type FormMovementProps = {
  onCancel?: () => void;
};

export const FormMovement = ({ onCancel }: FormMovementProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionTypeData>({
    defaultValues: {
      is_income: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postTransactionType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactionTypes"] });
      if (onCancel) {
        onCancel();
      } else {
        reset();
        alert("Tipo de transacción creado con éxito");
      }
    },
    onError: () => {
      alert("Error contacte al administrador o intente nuevamente más tarde");
    },
  });

  const onSubmit = (data: TransactionTypeData) => mutate(data);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Crear Tipo de Transacción
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Sección Tipo de Transacción */}
        <fieldset className="space-y-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <legend className="text-sm font-medium text-blue-600 px-2">
            Información del Tipo
          </legend>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                {...register("is_income", {
                  setValueAs: (v) => v === "true", // Convierte el valor
                })}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              >
                <option value="true">Ingreso</option>
                <option value="false">Gasto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                {...register("name", { required: "Este campo es requerido" })}
                className={`w-full px-3 py-2 rounded border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                placeholder="Nombre del tipo"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
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
              <span>Guardar Tipo</span>
            </button>
          ) : (
            <Spinner size="md" color="text-blue-600" className="mx-auto" />
          )}
        </div>
      </form>
    </div>
  );
};
