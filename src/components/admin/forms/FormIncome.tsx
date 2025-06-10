import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FormClient } from "./FormClient";
import { FormVehicle } from "./FormVehicle";
import { ClientSearch } from "../search/ClientSearch";
import { useVehicleSearchById } from "@/hooks/vehicle/useVehicleSearchById";
import { VehicleSearch } from "../search/VehicleSearch";
import Modal from "./formIncome/Modal";
import { ServiceSelector } from "./formIncome/ServiceSelector";
import { useServiceSelection } from "@/hooks/utils/useServiceSelection";
import { useGetAllService } from "@/hooks/service/useGetAllService";
import { MovementSearch } from "../search/MovementSearch";
//import { usePostIncome } from "@/pages/tenant/income/usePostIncome";

type FormData = {
  amount: number;
  client_id: string;
  details: string;
  movement_type_id: string;
  services_id: string[];
  ticket: string;
  vehicle_id: string;
};

// Lista ficticia de servicios (solo con id y nombre)

export const FormIncome = () => {
  const { services } = useGetAllService();
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const [openModal, setOpenModal] = useState<
    "client" | "movement" | "services" | "vehicle" | null
  >(null);

  //const {postIncome, isPostingIncome} = usePostIncome();

  // Usar el hook personalizado para manejar la selección de servicios
  const { selectedServices, handleServiceToggle, removeService } =
    useServiceSelection(watch("services_id") || []);

  const { vehicles } = useVehicleSearchById(watch("client_id"));

  const [searchTermTemp, setSearchTermTemp] = useState("");
  const [searchTermVehicleTemp, setSearchTermVehicleTemp] = useState("");

  const onSubmit = (data: FormData) => {
    console.log(data);
    //*postIncome(data);

  }

  const client_id = watch("client_id");

  useEffect(() => {
    setValue("vehicle_id", "");
  }, [client_id, setValue]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Registro de Ingreso
      </h1>

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
              {...register("amount")}
              className="block w-full border border-blue-200 rounded-md p-3 pl-8 text-xl font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="any"
              onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                e.currentTarget.blur()
              }
              style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
            />
          </div>
        </div>

        {/* Sección de Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          {!searchTermTemp ? (
            <ClientSearch
              value={""}
              onChange={(id, label) => {
                setSearchTermTemp(label);
                setValue("client_id", id);
              }}
              onAddClient={() => setOpenModal("client")}
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
          <MovementSearch
            value={""}
            onChange={(id) => {
              setValue("movement_type_id", id);
            }}
          />
        </div>

        {/* Sección de Servicios y Vehículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Servicios - Usando el nuevo componente */}
          <ServiceSelector
            services={services}
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
            onRemoveService={(serviceId) => {
              removeService(serviceId);
              setValue(
                "services_id",
                selectedServices.filter((id) => id !== serviceId)
              );
            }}
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
                {vehicles && vehicles.length > 0 ? (
                  <>
                    <select
                      {...register("vehicle_id")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue=""
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
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpenModal("vehicle")}
                    className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <FaPlus className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
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
