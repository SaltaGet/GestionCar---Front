import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Save, X, Edit2, Trash2 } from 'lucide-react';
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
  const { editService, deleteService, isEditing, isDeleting } = useDeleteAndEditServices();

  const { services, isLoading } = useGetAllService();

  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    resetEditForm({
      name: service.name
    });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
  };

  const onSubmitEdit = (data: EditServiceForm) => {
    if (!editingServiceId) return;
    
    editService({
      id: editingServiceId,
      ...data
    });
    setEditingServiceId(null);
  };

  const handleDelete = (service: Service) => {
    if (confirm(`¿Estás seguro de eliminar el servicio "${service.name}"?`)) {
      deleteService(service.id);
    }
  };

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

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => handleEdit(service)} 
                            className="text-indigo-600 hover:text-indigo-900" 
                            title="Editar"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(service)} 
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900" 
                            title="Eliminar"
                          >
                            {isDeleting ? (
                              <span>.</span>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
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