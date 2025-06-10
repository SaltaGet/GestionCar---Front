import { useForm } from "react-hook-form";
import { useState, useRef, useCallback, useEffect } from "react";
import { Save, X, Edit2, Trash2, MoreVertical, Plus, Search } from "lucide-react";
import { useGetAllProducts, type Product } from "@/hooks/products/useGetAllProducts";
import { useGetByNameProducts } from "@/hooks/products/useGetByNameProducts";
import useDeleteAndEditProducts from "@/hooks/products/useDeleteAndEditProducts";
import { StockModal } from "./StockModal";
import { useDebounce } from "use-debounce";

type EditProductForm = {
  identifier: string;
  name: string;
};

export const TableProducts = () => {
  // Formulario para edición
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<EditProductForm>();

  const { editProduct, deleteProduct } =
    useDeleteAndEditProducts();

  // Estados
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms de debounce
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Hooks
  const { products: allProducts, isLoading: isLoadingAll } = useGetAllProducts();
  const { products: searchedProducts, isLoading: isLoadingSearch } = useGetByNameProducts(
    debouncedSearchTerm
  );

  // Determinar qué productos mostrar
  const productsToShow = debouncedSearchTerm ? searchedProducts : allProducts;
  const isLoading = isLoadingAll || (debouncedSearchTerm && isLoadingSearch);

  // Cerrar popup al hacer clic fuera
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        activePopupId &&
        popupRefs.current[activePopupId] &&
        !popupRefs.current[activePopupId]?.contains(event.target as Node)
      ) {
        setActivePopupId(null);
      }
    },
    [activePopupId]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Handlers
  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setActivePopupId(null);
    resetEditForm({
      identifier: product.identifier,
      name: product.name,
    });
  };

  const handleCancelEdit = () => setEditingProductId(null);

  const onSubmitEdit = (data: EditProductForm) => {
    if (!editingProductId) return;
    editProduct({ id: editingProductId, ...data });
    setEditingProductId(null);
  };

  const handleDelete = (product: Product) => {
    setActivePopupId(null);
    if (confirm(`¿Eliminar el producto "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
    setActivePopupId(null);
  };

  const handleStockUpdateSubmit = (newStock: number) => {
    // Aquí iría la lógica para actualizar el stock
    console.log("Actualizando stock para:", selectedProduct?.id, "nuevo stock:", newStock);
    setShowStockModal(false);
  };

  const setPopupRef = (id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  };

  const togglePopup = (
    productId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX,
    });
    setActivePopupId((prev) => (prev === productId ? null : productId));
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar pro nombre"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Modal para actualizar stock */}
      {showStockModal && selectedProduct && (
        <StockModal
          product={selectedProduct}
          onClose={() => setShowStockModal(false)}
          onUpdateStock={handleStockUpdateSubmit}
        />
      )}

      {/* Tabla */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : productsToShow.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            {debouncedSearchTerm
              ? "No se encontraron productos con ese nombre"
              : "No hay productos registrados"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Identificador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actualizado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsToShow.map((product) => (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      editingProductId === product.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Identificador */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          {...registerEdit("identifier", { required: true })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {product.identifier}
                        </span>
                      )}
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          {...registerEdit("name", { required: true })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {product.name}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {product.stock}
                      </span>
                    </td>

                    {/* Fechas */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {editingProductId === product.id ? (
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={handleEditSubmit(onSubmitEdit)}
                            className="flex items-center text-green-600 hover:text-green-800"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => togglePopup(product.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>

                          {activePopupId === product.id && (
                            <div
                              ref={setPopupRef(product.id)}
                              className="fixed z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left - 180}px`,
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleUpdateStock(product)}
                                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Actualizar Stock
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};