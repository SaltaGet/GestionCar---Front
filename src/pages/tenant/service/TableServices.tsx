import { useForm } from 'react-hook-form';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Save, X, Edit2, Trash2, MoreVertical, PlusCircle } from 'lucide-react';
import { useGetAllService } from '@/hooks/service/useGetAllService';
import useDeleteAndEditServices from '@/hooks/service/useDeleteAndEditServices';

type Service = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  incomes: null;
};

type EditServiceForm = {
  name: string;
};

export const TableServices = () => {
  // Formulario para edición
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<EditServiceForm>();

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { editService, deleteService, isEditing, isDeleting } = useDeleteAndEditServices();

  const { services, isLoading } = useGetAllService();

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
    if (activePopupId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activePopupId]);

  const handleEdit = useCallback((service: Service) => {
    setEditingServiceId(service.id);
    setActivePopupId(null);
    resetEditForm({
      name: service.name
    });
  }, [resetEditForm]);

  const handleCancelEdit = useCallback(() => {
    setEditingServiceId(null);
  }, []);

  const onSubmitEdit = useCallback((data: EditServiceForm) => {
    if (!editingServiceId) return;
    editService({ id: editingServiceId, ...data });
    setEditingServiceId(null);
  }, [editingServiceId, editService]);

  const handleDelete = useCallback((service: Service) => {
    setActivePopupId(null);
    if (confirm(`¿Estás seguro de eliminar el servicio "${service.name}"?`)) {
      deleteService(service.id);
    }
  }, [deleteService]);

  const setPopupRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  }, []);

  const togglePopup = useCallback((serviceId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setActivePopupId(prev => prev === serviceId ? null : serviceId);
  }, []);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !services.length ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">No se encontraron servicios</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actualizado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr 
                    key={service.id} 
                    className={`transition-colors ${editingServiceId === service.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingServiceId === service.id ? (
                        <input
                          {...registerEdit('name', { required: 'Nombre es requerido' })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                      )}
                    </td>

                    {/* Fecha de creación */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(service.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Fecha de actualización */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(service.updated_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {editingServiceId === service.id ? (
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={handleEditSubmit(onSubmitEdit)} 
                            disabled={isEditing}
                            className="flex items-center text-green-600 hover:text-green-800"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {isEditing ? 'Guardando...' : 'Guardar'}
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
                            onClick={(e) => togglePopup(service.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Menú de acciones"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {/* Popup de acciones */}
                          {activePopupId === service.id && (
                            <div 
                              ref={setPopupRef(service.id)}
                              className="fixed z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left - 180}px`
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(service)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar servicio
                                </button>
                                
                                <button
                                  onClick={() => console.log('Ver ingresos de:', service.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Ver ingresos
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(service)}
                                  disabled={isDeleting}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {isDeleting ? 'Eliminando...' : 'Eliminar servicio'}
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