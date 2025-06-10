import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave, FaTimes } from "react-icons/fa";
import { ClientSearch } from "../search/ClientSearch";
import { useState, useEffect } from "react";

type VehicleData = {
  brand: string;
  client_id: string;
  color: string;
  domain: string;
  model: string | null;
  year: string;
};

interface FormVehicleProps {
  onCancel?: () => void;
  client?: {
    id: string;
    label: string;
  };
}

const postVehicle = async (formData: VehicleData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/vehicle/create", formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const FormVehicle = ({ onCancel, client }: FormVehicleProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<VehicleData>({ mode: "onChange" });
  const [searchTermTemp, setSearchTermTemp] = useState("");

  useEffect(() => {
    if (client) {
      setValue("client_id", client.id);
      setSearchTermTemp(client.label);
    }
  }, [client, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: postVehicle,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["vehicleByClient"] });
      alert("Vehículo registrado con exito");
      onCancel?.();
      
      reset();
    },
    onError: () => {
      alert("Error al registrar el vehículo. Intente nuevamente.");
    },
  });

  const onSubmit = (data: VehicleData) => {
    console.log("Vehículo enviado:", data);
    mutate(data);
  };

  const inputClasses = (hasError: boolean) =>
    `w-full px-3 py-2 rounded border ${
      hasError ? "border-red-500" : "border-gray-300"
    } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "mt-1 text-xs text-red-600";

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Registrar Vehículo
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Vehicle Information Section */}
        <fieldset className="space-y-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <legend className="text-sm font-medium text-blue-600 px-2">
            Información del Vehículo
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Marca *</label>
              <input
                type="text"
                {...register("brand", { required: "Este campo es requerido" })}
                className={inputClasses(!!errors.brand)}
                placeholder="Toyota, Ford, etc."
              />
              {errors.brand && (
                <p className={errorClasses}>{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Modelo</label>
              <input
                type="text"
                {...register("model")}
                className={inputClasses(false)}
                placeholder="Corolla, Focus, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Color *</label>
              <input
                type="text"
                {...register("color", { required: "Este campo es requerido" })}
                className={inputClasses(!!errors.color)}
                placeholder="Rojo, Azul, Negro..."
              />
              {errors.color && (
                <p className={errorClasses}>{errors.color.message}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Año *</label>
              <input
                type="text"
                {...register("year", {
                  required: "Este campo es requerido",
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: "Ingrese un año válido (ej: 2020)",
                  },
                })}
                className={inputClasses(!!errors.year)}
                placeholder="2020"
              />
              {errors.year && (
                <p className={errorClasses}>{errors.year.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Dominio (Patente) *</label>
            <input
              type="text"
              {...register("domain", { required: "Este campo es requerido" })}
              className={inputClasses(!!errors.domain)}
              placeholder="ABC123 o similar"
            />
            {errors.domain && (
              <p className={errorClasses}>{errors.domain.message}</p>
            )}
          </div>
        </fieldset>

        {/* Client Information Section */}
        <fieldset className="space-y-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <legend className="text-sm font-medium text-purple-600 px-2">
            Información del Cliente
          </legend>

          {client ? (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-800">
                {client.label}
              </span>
            </div>
          ) : searchTermTemp ? (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-800">
                {searchTermTemp}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchTermTemp("");
                  setValue("client_id", "");
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <ClientSearch
              value={""}
              onChange={(id, label) => {
                setSearchTermTemp(label);
                setValue("client_id", id);
              }}
            />
          )}
        </fieldset>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || !isValid}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              isPending || !isValid
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? (
              <Spinner size="sm" color="text-white" />
            ) : (
              <>
                <FaSave className="text-sm" />
                <span>Guardar Vehículo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};