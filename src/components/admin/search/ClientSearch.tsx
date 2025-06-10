// components/ClientSearch.tsx
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { useGetClientsByName } from "@/hooks/clients/usetGetByNameClient";

interface ClientSearchProps {
  value: string;
  onChange: (id: string, label: string) => void;
  onAddClient?: () => void;
}

export const ClientSearch = ({ value, onChange, onAddClient }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { clients: clientByName, isLoading } = useGetClientsByName(debouncedSearchTerm);

  const filteredClients = clientByName.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm("");
  }, [value]);

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        Buscar Cliente
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
            placeholder="Nombre del cliente..."
            className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200 divide-y divide-gray-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    onMouseDown={() => {
                      const label = `${client.first_name} ${client.last_name}`;
                      onChange(client.id, label);
                      setSearchTerm(label);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">DNI: {client.dni}</p>
                  </div>
                ))
              ) : !isLoading ? (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No se encontraron coincidencias
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  Buscando clientes...
                </div>
              )}
            </div>
          )}
        </div>

        {onAddClient && (
          <button
            type="button"
            onClick={onAddClient}
            className="mt-0.5 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors shadow-sm"
          >
            <FaPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};