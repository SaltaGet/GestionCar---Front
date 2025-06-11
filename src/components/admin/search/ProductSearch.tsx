// components/ProductSearch.tsx
import { useGetByNameProducts } from "@/hooks/products/useGetByNameProducts";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface Product {
  id: string;
  identifier: string;
  name: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseProduct {
  product_id: string;
  quantity: number;
  unit_price: number;
  expired_at: string;
  product?: Product; // Producto completo para referencia
}

interface ProductSearchProps {
  onSelectProduct: (product: PurchaseProduct) => void;
  onAddProduct?: () => void;
  existingProducts?: PurchaseProduct[]; // Para evitar duplicados
}

export const ProductSearch = ({ 
  onSelectProduct, 
  onAddProduct,
  existingProducts = [] 
}: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { products, isLoading } = useGetByNameProducts(debouncedSearchTerm);

  // Filtrar productos que ya están en la lista y que coincidan con la búsqueda
  const filteredProducts = products.filter(product => {
    const isNotInList = !existingProducts.some(p => p.product_id === product.id);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotInList && matchesSearch;
  });

  const handleSelectProduct = (product: Product) => {
    const newPurchaseProduct: PurchaseProduct = {
      product_id: product.id,
      quantity: 1, // Valor por defecto
      unit_price: 0, // Inicializar en 0 (puedes ajustar según necesidad)
      expired_at: "", // Fecha vacía por defecto
      product // Guardamos el objeto completo para mostrar detalles
    };
    
    onSelectProduct(newPurchaseProduct);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        Buscar Producto
      </label>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder="Nombre o código del producto..."
            className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200 divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    onMouseDown={() => handleSelectProduct(product)}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.identifier}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))
              ) : !isLoading ? (
                <div className="px-3 py-2 text-xs text-gray-500">
                  {searchTerm.trim() === "" 
                    ? "Escribe para buscar productos" 
                    : "No se encontraron productos"}
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  Buscando productos...
                </div>
              )}
            </div>
          )}
        </div>

        {onAddProduct && (
          <button
            type="button"
            onClick={onAddProduct}
            className="mt-0.5 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors shadow-sm"
          >
            <FaPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};