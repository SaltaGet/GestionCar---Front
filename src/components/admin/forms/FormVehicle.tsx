import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { ClientSearch } from "../search/ClientSearch";
import { useState } from "react";

type VehicleData = {
  brand: string;
  client_id: string;
  color: string;
  domain: string;
  model: string | null;
  year: string;
};

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

export const FormVehicle = ({ onCancel }: { onCancel: () => void }) => {
    const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VehicleData>();
  const [searchTermTemp, setSearchTermTemp] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: postVehicle,
    onSuccess: (data) => {
      console.log(data);
        queryClient.invalidateQueries({ queryKey: ["vehicleByClient"] });

      onCancel();
    },
    onError: () => {
      alert("Error al registrar el vehículo. Intente nuevamente.");
    },
  });

  const onSubmit = (data: VehicleData) => {
    console.log("Vehículo enviado:", data);
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Registrar Vehículo
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca *
            </label>
            <input
              type="text"
              {...register("brand", { required: "Este campo es requerido" })}
              className={`w-full p-2 rounded-md shadow-sm border ${
                errors.brand ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="Toyota, Ford, etc."
            />
            {errors.brand && (
              <p className="text-sm text-red-600 mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              type="text"
              {...register("model")}
              className="w-full p-2 rounded-md shadow-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Corolla, Focus, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color *
            </label>
            <input
              type="text"
              {...register("color", { required: "Este campo es requerido" })}
              className={`w-full p-2 rounded-md shadow-sm border ${
                errors.color ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="Rojo, Azul, Negro..."
            />
            {errors.color && (
              <p className="text-sm text-red-600 mt-1">
                {errors.color.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dominio (Patente) *
            </label>
            <input
              type="text"
              {...register("domain", { required: "Este campo es requerido" })}
              className={`w-full p-2 rounded-md shadow-sm border ${
                errors.domain ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="ABC123 o similar"
            />
            {errors.domain && (
              <p className="text-sm text-red-600 mt-1">
                {errors.domain.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año *
            </label>
            <input
              type="text"
              {...register("year", {
                required: "Este campo es requerido",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Ingrese un año válido (ej: 2020)",
                },
              })}
              className={`w-full p-2 rounded-md shadow-sm border ${
                errors.year ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="2020"
            />
            {errors.year && (
              <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
            )}
          </div>

          {!searchTermTemp ? (
            <ClientSearch
              value={""}
              onChange={(id, label) => {
                setSearchTermTemp(label);
                setValue("client_id", id);
              }}
            />
          ) : (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-base font-semibold text-gray-800">
                {searchTermTemp}
              </span>
              
                <button
                  type="button"
                  onClick={() => {
                    setSearchTermTemp("");
                    setValue("client_id", "");
                  }}
                  className="text-gray-600 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              
            </div>
          )}
        </div>

        {!isPending ? (
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <FaSave /> Guardar Vehículo
            </button>
          </div>
        ) : (
          <Spinner size="md" color="text-blue-500" className="mx-auto" />
        )}
      </form>
    </div>
  );
};
