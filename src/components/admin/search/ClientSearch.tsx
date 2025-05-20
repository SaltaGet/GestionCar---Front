// components/ClientSearch.tsx
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useClient } from "@/hooks/useClient";

interface ClientSearchProps {
  value: string;
  onChange: (id: string, label: string) => void;
  onAddClient?: () => void; // ahora es opcional
}

export const ClientSearch = ({ value, onChange, onAddClient }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clientByName } = useClient(searchTerm);

  const filteredClients = clientByName.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cliente
      </label>
      <div className="flex gap-2">
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
            placeholder="Buscar cliente por nombre..."
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      const label = `${client.first_name} ${client.last_name}`;
                      onChange(client.id, label);
                      setSearchTerm(label);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <p className="font-medium">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-gray-500">DNI: {client.dni}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No se encontraron clientes
                </div>
              )}
            </div>
          )}
        </div>

        {onAddClient && (
          <button
            type="button"
            onClick={onAddClient}
            className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FaPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
