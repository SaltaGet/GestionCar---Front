import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaPlus, FaCheck, FaTimes, FaTimesCircle } from "react-icons/fa";
import { FormClient } from "./FormClient";
import { FormVehicle } from "./FormVehicle";
import { ClientSearch } from "../search/ClientSearch";
import { useVehicleSearchById } from "@/hooks/vehicle/useVehicleSearchById";
import { VehicleSearch } from "../search/VehicleSearch";

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
const mockServices = [{ id: "serv_1", name: "Lavado básico" }];

// Componente Modal genérico
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirmar",
  showConfirm = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showConfirm?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes />
        </button>

        <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {title}
        </h1>

        <div className="space-y-4">
          {children}
          {showConfirm && onConfirm && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <FaCheck /> {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FormIncome = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const [openModal, setOpenModal] = useState<
    "client" | "movement" | "services" | "vehicle" | null
  >(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    watch("services_id") || []
  );

  const { vehicles } = useVehicleSearchById(watch("client_id"));

  const [searchTermTemp, setSearchTermTemp] = useState("");
  const [searchTermVehicleTemp, setSearchTermVehicleTemp] = useState("");

  const onSubmit = (data: FormData) => console.log(data);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
    setValue(
      "services_id",
      selectedServices.filter((id) => id !== serviceId)
    );
  };

  const client_id = watch("client_id");

  const confirmServicesSelection = () => {
    setValue("services_id", selectedServices);
    setOpenModal(null);
  };

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
          <input
            type="number"
            {...register("amount")}
            className="mt-1 block w-full border border-blue-200 rounded-md p-3 text-xl font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
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
                    setValue("vehicle_id", ""); // opcional: reinicia también el vehículo si está vinculado al cliente
                  }}
                  className="text-gray-600 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                {...register("movement_type_id")}
                placeholder="Seleccionar tipo"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setOpenModal("movement")}
                className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FaPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Servicios y Vehículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Servicios - Ahora con chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servicios
            </label>
            <div className="flex flex-wrap gap-2 items-center min-h-12 mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
              {selectedServices.length === 0 ? (
                <span className="text-gray-400">
                  No hay servicios seleccionados
                </span>
              ) : (
                selectedServices.map((serviceId) => {
                  const service = mockServices.find((s) => s.id === serviceId);
                  return (
                    <div
                      key={serviceId}
                      className="flex items-center bg-indigo-100 text-indigo-800 rounded-full py-1 px-3 text-sm"
                    >
                      {service?.name}
                      <button
                        type="button"
                        onClick={() => removeService(serviceId)}
                        className="ml-1 text-indigo-600 hover:text-indigo-900"
                      >
                        <FaTimesCircle className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
              <button
                type="button"
                onClick={() => setOpenModal("services")}
                className="ml-auto bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FaPlus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehículo
            </label>

            {searchTermVehicleTemp ? (
              // Si se buscó un vehículo, mostrar el dominio con botón para limpiar
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
              // Si NO hay client_id, mostrar input para buscar por dominio
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
              // Si HAY client_id, mostrar select y botón +
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

      {/* Modal de Servicios */}
      <Modal
        isOpen={openModal === "services"}
        onClose={() => setOpenModal(null)}
        title="Servicios"
        onConfirm={confirmServicesSelection}
        confirmText={`Confirmar (${selectedServices.length})`}
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {mockServices.map((service) => (
            <div key={service.id} className="flex items-center">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`service-${service.id}`}
                className="ml-2 text-sm text-gray-700"
              >
                {service.name}
              </label>
            </div>
          ))}
        </div>
      </Modal>

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
        <FormVehicle onCancel={() => setOpenModal(null)} />
      </Modal>
    </div>
  );
};
