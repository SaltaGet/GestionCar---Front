// components/ServiceSelector.tsx
import type { Service } from "@/hooks/service/useGetAllService";
import { FaTimesCircle, FaSearch } from "react-icons/fa";
import { useState } from "react";

type ServiceSelectorProps = {
  services: Service[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
  onRemoveService: (serviceId: string) => void;
};

export const ServiceSelector = ({
  services,
  selectedServices,
  onServiceToggle,
  onRemoveService,
}: ServiceSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchResults = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableServices = searchResults.filter(
    service => !selectedServices.includes(service.id)
  );

  const alreadySelected = searchResults.filter(
    service => selectedServices.includes(service.id)
  );

  // Función para obtener servicios seleccionados con type safety
  const getSelectedServices = () => {
    return selectedServices
      .map(id => services.find(s => s.id === id))
      .filter((service): service is Service => service !== undefined);
  };

  

  const handleServiceSelect = (serviceId: string) => {
    onServiceToggle(serviceId);
    setSearchTerm("");
  };

  // Mostrar todos los servicios cuando el input está enfocado y no hay término de búsqueda
  const showAllServices = isInputFocused && !searchTerm;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Servicios
      </label>
      
      {/* Barra de búsqueda - Estilo mejorado */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar servicios..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
        />
      </div>

      {/* Servicios seleccionados - Estilo mejorado */}
      <div className="flex flex-wrap gap-2 items-center min-h-12 p-3 border border-gray-200 rounded-lg bg-gray-50">
        {selectedServices.length === 0 ? (
          <span className="text-gray-400 text-sm">No hay servicios seleccionados</span>
        ) : (
          selectedServices.map((serviceId) => {
            const service = services.find((s) => s.id === serviceId);
            return service ? (
              <div
                key={serviceId}
                className="flex items-center bg-blue-100 text-blue-800 rounded-full py-1.5 px-3 text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
              >
                {service.name}
                <button
                  type="button"
                  onClick={() => onRemoveService(serviceId)}
                  className="ml-1.5 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaTimesCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null;
          })
        )}
      </div>

      {/* Lista de servicios - Mostrar cuando hay foco o término de búsqueda */}
      {(showAllServices || searchTerm) && (
        <div className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50">
              {searchTerm ? "Resultados de búsqueda" : "Todos los servicios disponibles"}
            </h4>
            
            {showAllServices && services.filter(s => !selectedServices.includes(s.id)).length === 0 && getSelectedServices().length === 0 ? (
              <p className="text-sm text-gray-500 px-4 py-3">No hay servicios disponibles</p>
            ) : searchTerm && availableServices.length === 0 && alreadySelected.length === 0 ? (
              <p className="text-sm text-gray-500 px-4 py-3">No se encontraron servicios</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {(showAllServices ? services.filter(s => !selectedServices.includes(s.id)) : availableServices).length > 0 && (
                  <ul className="py-1">
                    {(showAllServices ? services.filter(s => !selectedServices.includes(s.id)) : availableServices).map((service) => (
                      <li 
                        key={service.id} 
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <div className="flex items-center">
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {service.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {(showAllServices ? getSelectedServices() : alreadySelected).length > 0 && (
                  <div className="py-1 bg-gray-50">
                    <p className="text-xs text-gray-500 px-4 py-2">Ya seleccionados</p>
                    <ul className="pb-1">
                      {(showAllServices ? getSelectedServices() : alreadySelected).map((service) => (
                        <li 
                          key={service.id} 
                          className="px-4 py-2 opacity-70"
                        >
                          <div className="flex items-center">
                            <span className="ml-2 text-sm text-gray-500">
                              {service.name}
                            </span>
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Seleccionado
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};