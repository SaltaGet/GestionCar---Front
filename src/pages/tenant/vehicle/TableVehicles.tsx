import { useState, useRef, useCallback, useEffect } from 'react';
import { MoreVertical, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useGetAllVehicles, type Vehicle } from '@/hooks/vehicle/useGetAllVehicle';
import { useVehicleSearchByDomain } from '@/hooks/vehicle/useVehicleSearchByDomain';
import { ClientSearch } from '@/components/admin/search/ClientSearch';
import { useVehicleSearchById } from '@/hooks/vehicle/useVehicleSearchById';

export const TableVehicles = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermById, setSearchTermById] = useState('');
  const [searchTermByIdLabel, setSearchTermByIdLabel] = useState('');
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Debounce para ambas búsquedas
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [debouncedSearchTermById] = useDebounce(searchTermById, 500);

  // Hooks de búsqueda
  const { vehicles: searchedVehicles } = useVehicleSearchByDomain(debouncedSearchTerm);
  const { vehicles: allVehicles, isLoading } = useGetAllVehicles();
  const { vehicles: searchedVehiclesById, isLoading: isLoadingById } = useVehicleSearchById(debouncedSearchTermById);

  // Determinar qué datos mostrar
  const showDomainSearchResults = debouncedSearchTerm.length > 0;
  const showIdSearchResults = debouncedSearchTermById.length > 0;
  
  // Solo permitir una búsqueda activa a la vez
  const vehiclesToShow = showDomainSearchResults 
    ? searchedVehicles 
    : showIdSearchResults 
      ? searchedVehiclesById 
      : allVehicles;

  // Manejar cambios en los inputs de búsqueda para mantener exclusividad
  const handleDomainSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) setSearchTermById(''); // Limpiar búsqueda por ID si se empieza a buscar por dominio
  };

  const handleIdSearchChange = (id: string, label: string) => {
    setSearchTermByIdLabel(label);
    setSearchTermById(id);
    if (id) {
        setSearchTerm('')}; // Limpiar búsqueda por dominio si se empieza a buscar por ID
  };

  // Cerrar popup al hacer clic fuera
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (activePopupId && popupRefs.current[activePopupId] && 
        !popupRefs.current[activePopupId]?.contains(event.target as Node)) {
      setActivePopupId(null);
    }
  }, [activePopupId]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Bloquear scroll cuando hay popup abierto
  useEffect(() => {
    if (activePopupId || selectedVehicle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activePopupId, selectedVehicle]);

  const openModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActivePopupId(null);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };

  const setPopupRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  }, []);

  const togglePopup = useCallback((vehicleId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setActivePopupId(prev => prev === vehicleId ? null : vehicleId);
  }, []);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="space-y-4">
        {/* Búsqueda por dominio */}
        {searchTermById === '' && <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por dominio..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => handleDomainSearchChange(e.target.value)}
            disabled={showIdSearchResults}
          />
          {showDomainSearchResults && (
            <span className="absolute right-3 inset-y-0 flex items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${
                searchedVehicles.length > 0
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {searchedVehicles.length > 0
                  ? `${searchedVehicles.length} resultado(s)` 
                  : 'Sin resultados'}
              </span>
            </span>
          )}
        </div>}

        {/* Búsqueda por ID de cliente */}
        {searchTerm === '' && <div className="max-w-md">
          <ClientSearch 
            value={searchTermById}
            onChange={handleIdSearchChange}
          />
          {showIdSearchResults && (
            <div className="mt-1 text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                searchedVehiclesById.length > 0
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {searchedVehiclesById.length > 0
                  ? `${searchedVehiclesById.length} resultado(s)` 
                  : 'Sin resultados'}
              </span>
            </div>
          )}
        </div>}
      </div>

      {/* Modal para detalles/edición */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {activePopupId === 'view' ? 'Detalles del Vehículo' : 'Editar Vehículo'} {selectedVehicle.domain}
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Marca/Modelo:</p>
                <p>{selectedVehicle.brand} {selectedVehicle.model}</p>
              </div>
              <div>
                <p className="font-medium">Año/Color:</p>
                <p>{selectedVehicle.year} - {selectedVehicle.color}</p>
              </div>
              <div>
                <p className="font-medium">Dominio:</p>
                <p>{selectedVehicle.domain}</p>
              </div>
              <div>
                <p className="font-medium">ID Cliente:</p>
                <p>{selectedVehicle.client_id || 'No asignado'}</p>
              </div>
              <div>
                <p className="font-medium">Fecha de creación:</p>
                <p>{new Date(selectedVehicle.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de vehículos */}
      {isLoading || isLoadingById ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !vehiclesToShow.length ? (
        <div className={`border-l-4 p-4 ${
          showDomainSearchResults || showIdSearchResults
            ? 'bg-red-50 border-red-500 text-red-700'
            : 'bg-blue-50 border-blue-500 text-blue-700'
        }`}>
          <p>
            {showDomainSearchResults
              ? `No se encontraron vehículos con el dominio "${debouncedSearchTerm}"`
              : showIdSearchResults
                ? `No se encontraron vehículos para el cliente con ID "${debouncedSearchTermById}"`
                : 'No se encontraron vehículos'}
          </p>
          {(showDomainSearchResults || showIdSearchResults) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSearchTermById('');
              }}
              className="mt-2 text-sm underline hover:text-red-800"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {(showDomainSearchResults || showIdSearchResults) && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 flex justify-between items-center">
              <span>
                {showDomainSearchResults
                  ? `Mostrando ${searchedVehicles.length} resultado(s) para dominio "${debouncedSearchTerm}"`
                  : `Mostrando ${searchedVehiclesById.length} resultado(s) de cliente "${searchTermByIdLabel}"`}
              </span>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSearchTermById('');
                }}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Volver a todos los vehículos
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año/Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dominio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiclesToShow.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">{vehicle.brand}</span>
                        <span className="text-sm text-gray-500">{vehicle.model}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm text-gray-900 block">{vehicle.year}</span>
                        <span className="text-sm text-gray-500">{vehicle.color}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{vehicle.domain}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(vehicle.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="flex justify-end">
                        <button 
                          onClick={(e) => togglePopup(vehicle.id, e)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          aria-label="Menú de acciones"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activePopupId === vehicle.id && (
                          <div 
                            ref={setPopupRef(vehicle.id)}
                            className="fixed z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                            style={{
                              top: `${popupPosition.top}px`,
                              left: `${popupPosition.left - 160}px`
                            }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setActivePopupId('view');
                                  openModal(vehicle);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Ver detalles
                              </button>
                              <button
                                onClick={() => {
                                  setActivePopupId('edit');
                                  openModal(vehicle);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Editar vehículo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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