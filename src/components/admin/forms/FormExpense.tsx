import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { MovementSearch } from "../search/MovementSearch";
import { useMutation } from "@tanstack/react-query";
import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { SupplierSearch } from "../search/SupplierSearch";
import { FormSupplier } from "./FormSupplier";
import Modal from "./formIncome/Modal";

type FormData = {
  amount: number;
  details: string;
  movement_type_id: string;
  supplier_id: string;
};

interface ApiResponse {
  status: boolean;
  message: string;
  body: string;
}

const postExpense = async (form: FormData): Promise<ApiResponse> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/expense/create", form, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const FormExpense = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [openModal, setOpenModal] = useState<"supplier" | "movement" | null>(
    null
  );

  const { mutate } = useMutation<ApiResponse, Error, FormData>({
    mutationFn: postExpense,
    onSuccess: () => {
      alert("Gasto registrado con éxito");
      reset();
    },
    onError: () => {
      alert("Ocurrió un error al registrar el gasto");
    },
  });

  const [searchTermTemp, setSearchTermTemp] = useState("");

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección de Monto - Destacado en rojo */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <label className="block text-sm font-semibold text-red-800 uppercase tracking-wider mb-1">
            Monto
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-bold text-red-900">
              $
            </span>
            <input
              type="number"
              {...register("amount", {
                valueAsNumber: true,
                required: "Este campo es requerido",
                validate: (value) =>
                  value > 0 || "El monto debe ser mayor que cero",
              })}
              className="block w-full border border-red-200 rounded-md p-3 pl-8 text-xl font-bold text-red-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
          {/* Proveedor */}
          {!searchTermTemp ? (
            <Controller
              name="supplier_id"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div>
                  <SupplierSearch
                    value={value || ""}
                    onChange={(id, label) => {
                      onChange(id);
                      setSearchTermTemp(label);
                      setValue("supplier_id", id);
                    }}
                    onAddSupplier={() => setOpenModal("supplier")}
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
              <button
                type="button"
                onClick={() => {
                  setSearchTermTemp("");
                  setValue("supplier_id", "");
                }}
                className="text-gray-600 hover:text-red-600 ml-2"
              >
                ✕
              </button>
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
                    setValue("movement_type_id", id);
                  }}
                  isIncome={false}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
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
            placeholder="Ingrese detalles del gasto..."
          />
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-colors duration-200"
          >
            Registrar Gasto
          </button>
        </div>
      </form>

      {/* Modal de Proveedor */}
      <Modal
        isOpen={openModal === "supplier"}
        onClose={() => setOpenModal(null)}
        title="Nuevo Proveedor"
        showConfirm={false}
      >
        <FormSupplier onCancel={() => setOpenModal(null)} />
      </Modal>

      {/* Modal de Tipo de Movimiento */}
      <Modal
        isOpen={openModal === "movement"}
        onClose={() => setOpenModal(null)}
        title="Seleccionar Tipo de Movimiento"
        onConfirm={() => {
          setValue("movement_type_id", "mov_789");
          setOpenModal(null);
        }}
      >
        <p className="text-gray-600">
          Aquí iría la lista de tipos de movimiento para gastos...
        </p>
      </Modal>
    </div>
  );
};

export default FormExpense;