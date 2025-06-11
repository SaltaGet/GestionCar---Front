import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Modal from "./formIncome/Modal";
import { SupplierSearch } from "../search/SupplierSearch";
import { ProductSearch, type PurchaseProduct } from "../search/ProductSearch";
import { FaTrash } from "react-icons/fa";
import { FormSupplier } from "./FormSupplier";
import { FormProduct } from "./FormProduct";
import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";



type FormData = {
  amount: number;
  order_date: string;
  order_number: string;
  supplier_id: string;
  purchase_products: PurchaseProduct[];
};

const postPurchaseOrder = async (form: FormData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.post("/purchase_order/create", form, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const FormPurchaseOrder = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      order_date: new Date().toISOString().split("T")[0],
      purchase_products: [],
    },
  });

  const { mutate } = useMutation({
    mutationFn: postPurchaseOrder,
    onSuccess: () => {
      alert("Orden de compra creada con éxito");
      reset();
    },
    onError: () => {
      alert("Ocurrió un error al crear la orden de compra");
    },
  });

  const [openModal, setOpenModal] = useState<"supplier" | "product" | null>(
    null
  );
  const [searchTermTemp, setSearchTermTemp] = useState("");
  const purchaseProducts = watch("purchase_products");

  const onSubmit = (data: FormData) => {
    console.log("Datos del formulario:", data);
    mutate(data);
    // Aquí iría la lógica para enviar los datos al backend
  };

  const handleAddProduct = (newProduct: PurchaseProduct) => {
    setValue("purchase_products", [...purchaseProducts, newProduct]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...purchaseProducts];
    updatedProducts.splice(index, 1);
    setValue("purchase_products", updatedProducts);
  };

const handleProductChange = <K extends keyof PurchaseProduct>(
  index: number,
  field: K,
  value: PurchaseProduct[K]
) => {
  const updatedProducts = [...purchaseProducts];
  updatedProducts[index] = { ...updatedProducts[index], [field]: value };
  setValue("purchase_products", updatedProducts);
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección de Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número de Orden */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Orden*
            </label>
            <input
              type="text"
              {...register("order_number", {
                required: "Este campo es requerido",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: OC-2023-001"
            />
            {errors.order_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.order_number.message}
              </p>
            )}
          </div>

          {/* Fecha de Orden */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Orden*
            </label>
            <input
              type="date"
              {...register("order_date", {
                required: "Este campo es requerido",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.order_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.order_date.message}
              </p>
            )}
          </div>
        </div>

        {/* Sección de Proveedor */}
        <div>
          {!searchTermTemp ? (
            <Controller
              name="supplier_id"
              control={control}
              rules={{ required: "Seleccione un proveedor" }}
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
        </div>

        {/* Sección de Productos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Productos*</h3>
          <Controller
            name="purchase_products"
            control={control}
            rules={{ required: "Seleccione un proveedor" }}
            render={({ fieldState: { error } }) => (
              <div>
                <ProductSearch
                  onSelectProduct={handleAddProduct}
                  existingProducts={purchaseProducts}
                  onAddProduct={() => setOpenModal("product")}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />

          {purchaseProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Unitario
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha Venc.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {product.product?.name || "Producto"}
                        <br />
                        <span className="text-xs text-gray-500">
                          {product.product?.identifier}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 border border-gray-300 rounded-md p-1 appearance-none"
                          pattern="[0-9]*"
                          onInput={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center border border-gray-300 rounded-md p-1 w-28">
                          <span className="text-gray-500 mr-1">$</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={product.unit_price}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "unit_price",
                                parseFloat(e.target.value || "0")
                              )
                            }
                            className="w-full outline-none appearance-none"
                            pattern="[0-9.]*"
                            onInput={(e) => {
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/[^0-9.]/g, "");
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="date"
                          value={product.expired_at}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "expired_at",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-md p-1"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Monto Total */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <label className="block text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">
            Monto Total
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-bold text-blue-900">
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
              className="block w-full border border-blue-200 rounded-md p-3 pl-8 text-xl font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="any"
              onWheel={(e) => e.currentTarget.blur()}
              style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors duration-200"
          >
            Registrar Orden de Compra
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
      {/* Modal de Producto */}
      <Modal
        isOpen={openModal === "product"}
        onClose={() => setOpenModal(null)}
        title="Nuevo Proveedor"
        showConfirm={false}
      >
        <FormProduct onCancel={() => setOpenModal(null)} />
      </Modal>
    </div>
  );
};

export default FormPurchaseOrder;
