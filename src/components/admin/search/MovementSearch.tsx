// components/MovementSearch.tsx
import { useState, useEffect } from "react";
import { useGetAllMovements } from "@/hooks/movements/useGetAllMovements";
import { FaTimes } from "react-icons/fa";

interface MovementSearchProps {
  value: string;
  onChange: (id: string, name: string) => void;
  disabled?: boolean;
}

export const MovementSearch = ({ value, onChange, disabled }: MovementSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<{id: string, name: string} | null>(null);
  
  const { movements, isLoading } = useGetAllMovements(true);

  const filteredMovements = movements.filter(movement =>
    movement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (value && movements.length > 0) {
      const movement = movements.find(m => m.id === value);
      if (movement) {
        setSelectedMovement({ id: movement.id, name: movement.name });
      }
    } else {
      setSelectedMovement(null);
    }
  }, [value, movements]);

  const handleSelect = (movement: {id: string, name: string}) => {
    onChange(movement.id, movement.name);
    setSelectedMovement(movement);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("", "");
    setSelectedMovement(null);
    setSearchTerm("");
    setIsDropdownOpen(true);
  };

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        Seleccionar Movimiento
      </label>
      
      {selectedMovement ? (
        <div className="flex items-center justify-between bg-gray-50 rounded-md p-2.5 border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-800 truncate">{selectedMovement.name}</span>
          <button 
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder="Buscar movimiento..."
            disabled={disabled}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          />

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200 divide-y divide-gray-100">
              {isLoading ? (
                <div className="px-3 py-2 text-xs text-gray-500">Cargando...</div>
              ) : filteredMovements.length > 0 ? (
                filteredMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    onMouseDown={() => handleSelect(movement)}
                  >
                    <p className="text-sm font-medium text-gray-700">{movement.name}</p>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No hay resultados
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};