// components/SupplierSearch.tsx
import { useGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";
import { useGetSuppliersByName } from "@/hooks/suppliers/useGetByNameSuppliers";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface SupplierSearchProps {
  value: string;
  onChange: (id: string, label: string) => void;
  onAddSupplier?: () => void;
}

export const SupplierSearch = ({ value, onChange, onAddSupplier }: SupplierSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { suppliers: searchedSuppliers, isLoading: isSearching } = useGetSuppliersByName(debouncedSearchTerm);
  const { suppliers: allSuppliers, isLoading: isLoadingAll } = useGetAllSuppliers();

  // Determinar qué lista de proveedores mostrar
  const suppliersToShow = searchTerm ? searchedSuppliers : allSuppliers;

  // Filtrar proveedores basado en el término de búsqueda (para búsqueda en cliente cuando allSuppliers está cargado)
  const filteredSuppliers = searchTerm 
    ? suppliersToShow.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suppliersToShow;

  useEffect(() => {
    setSearchTerm("");
  }, [value]);

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        Buscar Proveedor
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
            onFocus={() => {
              setIsDropdownOpen(true);
              if (!searchTerm) setSearchTerm(""); // Asegurar que se muestren todos al hacer focus
            }}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder="Nombre del proveedor..."
            className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200 divide-y divide-gray-100">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    onMouseDown={() => {
                      onChange(supplier.id, supplier.name);
                      setSearchTerm(supplier.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {supplier.name}
                    </p>
                    <div className="flex gap-2 mt-0.5">
                      {supplier.email && (
                        <p className="text-xs text-gray-500">Email: {supplier.email}</p>
                      )}
                      {supplier.phone && (
                        <p className="text-xs text-gray-500">Tel: {supplier.phone}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (isSearching || isLoadingAll) ? (
                <div className="px-3 py-2 text-xs text-gray-500">
                  Cargando proveedores...
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No se encontraron proveedores
                </div>
              )}
            </div>
          )}
        </div>

        {onAddSupplier && (
          <button
            type="button"
            onClick={onAddSupplier}
            className="mt-0.5 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors shadow-sm"
          >
            <FaPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};