import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FormClient } from "./FormClient";
import { FormVehicle } from "./FormVehicle";
import { ClientSearch } from "../search/ClientSearch";
import { useVehicleSearchById } from "@/hooks/vehicle/useVehicleSearchById";
import { VehicleSearch } from "../search/VehicleSearch";
import Modal from "./formIncome/Modal";
import { ServiceSelector } from "./formIncome/ServiceSelector";
import { useGetAllService } from "@/hooks/service/useGetAllService";
import { MovementSearch } from "../search/MovementSearch";
import { useMutation } from "@tanstack/react-query";
import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";

type FormData = {
  amount: number;
  client_id: string;
  details: string;
  movement_type_id: string;
  services_id: string[];
  ticket: string;
  vehicle_id: string;
  employee_id?: string;
};


interface ApiResponse {
  // Define aquí la estructura de la respuesta de tu API si es conocida
  // Por ejemplo:
  status: boolean;
  message: string;
  body: string;
}

// Lista ficticia de servicios (solo con id y nombre)

const postIncome = async (form: FormData): Promise<ApiResponse> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/income/create", form, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  return data;
};

export const FormIncome = () => {
  const { services } = useGetAllService();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [openModal, setOpenModal] = useState<
    "client" | "movement" | "services" | "vehicle" | null
  >(null);

  const { mutate } = useMutation<ApiResponse, Error, FormData>({
    mutationFn: postIncome,
    onSuccess: () => {
      alert("Ingreso creado con éxito");
      reset();
    },
    onError: () => {
      alert("Ocurrió un error al crear el ingreso");
    },
  });




  const { vehicles } = useVehicleSearchById(watch("client_id"));

  const [searchTermTemp, setSearchTermTemp] = useState("");
  const [searchTermVehicleTemp, setSearchTermVehicleTemp] = useState("");

  const onSubmit = (data: FormData) => {
    mutate(data); // Envías el objeto con amount como número
  };

  const client_id = watch("client_id");

  useEffect(() => {
  }, [client_id, setValue]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección de Monto - Destacado */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <label className="block text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">
            Monto
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-bold text-blue-900">
              $
            </span>
            <input
              type="number"
              {...register("amount", {
                valueAsNumber: true,
                required: "Este campo es requerido", // Mensaje de error cuando está vacío
                validate: (value) =>
                  value > 0 || "El monto debe ser mayor que cero", // Validación adicional
              })}
              className="block w-full border border-blue-200 rounded-md p-3 pl-8 text-xl font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="any"
              onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                e.currentTarget.blur()
              }
              style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Sección de Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          {!searchTermTemp ? (
            <Controller
              name="client_id"
              control={control}
              rules={{
                required: "Seleccione un cliente",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div>
                  <ClientSearch
                    value={value || ""}
                    onChange={(id, label) => {
                      onChange(id); // Actualiza el valor en react-hook-form
                      setSearchTermTemp(label);
                      setValue("client_id", id); // Sincronización adicional si es necesaria
                    }}
                    onAddClient={() => setOpenModal("client")}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          ) : (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-base font-semibold text-gray-800">
                {searchTermTemp}
              </span>
              {!searchTermVehicleTemp && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTermTemp("");
                    setValue("client_id", "");
                    setValue("vehicle_id", "");
                  }}
                  className="text-gray-600 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Tipo de Movimiento */}
          <Controller
            name="movement_type_id"
            control={control}
            rules={{
              required: "Seleccione un tipo de movimiento",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <MovementSearch
                  value={value}
                  onChange={(id) => {
                    onChange(id);
                    // Si necesitas hacer algo adicional con el id
                    setValue("movement_type_id", id);
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Sección de Servicios y Vehículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Servicios - Usando el nuevo componente */}
          <Controller
            name="services_id"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.length > 0) ||
                "Seleccione al menos un servicio", // Valida que haya al menos 1 servicio
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <ServiceSelector
                  services={services} // Lista de servicios disponibles
                  selectedServices={value || []} // Servicios seleccionados (usa [] si es null/undefined)
                  onServiceToggle={(serviceId) => {
                    const newSelected = value?.includes(serviceId)
                      ? value.filter((id) => id !== serviceId) // Si ya está, lo quita
                      : [...(value || []), serviceId]; // Si no está, lo añade
                    onChange(newSelected); // Actualiza react-hook-form
                    setValue("services_id", newSelected); // Sincronización adicional si es necesaria
                  }}
                  onRemoveService={(serviceId) => {
                    const newSelected =
                      value?.filter((id) => id !== serviceId) || [];
                    onChange(newSelected);
                    setValue("services_id", newSelected);
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
          {/* Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehículo
            </label>

            {searchTermVehicleTemp ? (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-800">
                  {searchTermVehicleTemp}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTermVehicleTemp("");
                    setSearchTermTemp("");
                    setValue("client_id", "");
                    setValue("vehicle_id", "");
                  }}
                  className="text-gray-500 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              </div>
            ) : !client_id ? (
              
              <VehicleSearch
                value={""}
                onChange={(idVehicle, labelVehicle, idClient, labelClient) => {
                  setSearchTermVehicleTemp(labelVehicle);
                  setSearchTermTemp(labelClient);
                  setValue("client_id", idClient);
                  setValue("vehicle_id", idVehicle);
                }}
              />
            ) : (
              <div className="flex gap-2">
  <Controller
    name="vehicle_id"
    control={control}
    rules={{
      required: "Seleccione un vehículo",
      validate: (value) => 
        (vehicles && vehicles.length > 0 && value !== "") || 
        "Debe agregar al menos un vehículo"
    }}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <>
        {vehicles && vehicles.length > 0 ? (
          <div className="flex gap-2 w-full">
            <select
              onChange={onChange}
              value={value || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Seleccionar vehículo
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.domain || vehicle.id}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOpenModal("vehicle")}
              className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FaPlus className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpenModal("vehicle")}
            className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FaPlus className="h-5 w-5" />
          </button>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </>
    )}
  />
</div>
            )
            
            }
          </div>
        </div>

        {/* Detalles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detalles
          </label>
          <textarea
            {...register("details")}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese detalles adicionales..."
          />
        </div>

        {/* Ticket */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Ticket
          </label>
          <input
            type="text"
            {...register("ticket")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese número de ticket"
          />
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-colors duration-200"
          >
            Registrar Ingreso
          </button>
        </div>
      </form>

      {/* Modal de Cliente */}
      <Modal
        isOpen={openModal === "client"}
        onClose={() => setOpenModal(null)}
        title="Nuevo Cliente"
        showConfirm={false}
      >
        <FormClient onCancel={() => setOpenModal(null)} />
      </Modal>

      {/* Modal de Tipo de Movimiento */}
      <Modal
        isOpen={openModal === "movement"}
        onClose={() => setOpenModal(null)}
        title="Seleccionar Tipo de Movimiento"
        onConfirm={() => {
          setValue("movement_type_id", "mov_456");
          setOpenModal(null);
        }}
      >
        <p className="text-gray-600">
          Aquí iría la lista de tipos de movimiento...
        </p>
      </Modal>

      {/* Modal de Vehículo */}
      <Modal
        isOpen={openModal === "vehicle"}
        onClose={() => setOpenModal(null)}
        title="Seleccionar Vehículo"
        onConfirm={() => {
          setValue("vehicle_id", "veh_012");
          setOpenModal(null);
        }}
      >
        <FormVehicle
          onCancel={() => setOpenModal(null)}
          client={
            watch("client_id")
              ? { id: watch("client_id"), label: "Cliente Seleccionado" }
              : undefined
          }
        />
      </Modal>
    </div>
  );
};

export default FormIncome;
