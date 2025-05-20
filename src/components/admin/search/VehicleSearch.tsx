import { useVehicleSearchByDomain } from "@/hooks/vehicle/useVehicleSearchByDomain";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

interface VehicleSearchProps {
  value: string;
  onChange: (idVehicle: string, labelVehicle: string, idClient: string, labelClient: string) => void;
  onAddVehicle?: () => void;
}

export const VehicleSearch = ({ value, onChange, onAddVehicle }: VehicleSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { vehicles } = useVehicleSearchByDomain(searchTerm);

  // Opcional: sincronizar cuando cambia value desde fuera
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">

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
            placeholder="Buscar vehículo por dominio..."
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      const label = `${vehicle.domain} (${vehicle.brand} ${vehicle.model})`;
                      onChange(vehicle.id, label, vehicle.client_id, `${vehicle.client.first_name} ${vehicle.client.last_name}`);
                      setSearchTerm(label);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <p className="font-medium">{vehicle.domain}</p>
                    <p className="text-xs text-gray-500">
                      {vehicle.brand} {vehicle.model} - {vehicle.color}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No se encontraron vehículos
                </div>
              )}
            </div>
          )}
        </div>

        {onAddVehicle && (
          <button
            type="button"
            onClick={onAddVehicle}
            className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FaPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
