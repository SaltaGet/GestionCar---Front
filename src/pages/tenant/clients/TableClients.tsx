import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useGetAllClients } from '@/hooks/clients/useGetAllClients';
import { useGetClientsByName } from '@/hooks/clients/usetGetByNameClient';
import { useEffect, useState } from 'react';
import useDeleteAndEditClients from '@/hooks/clients/useDeleteAndEditClients';
import { Save, X, Edit2, Trash2 } from 'lucide-react';

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  cuil: string;
};

type EditClientForm = {
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  cuil: string;
};

export const TableClients = () => {
  const { register, watch } = useForm<{ search: string }>({
    defaultValues: { search: '' },
  });

  // Formulario para edición
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<EditClientForm>();

  const [isTyping, setIsTyping] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const { editClient, deleteClient, isEditing, isDeleting } = useDeleteAndEditClients();

  const searchValue = watch('search');
  const [debouncedSearchTerm] = useDebounce(searchValue, 500);

  const { clients, isLoading } = useGetAllClients();
  const { clients: clientsByName, isLoading: isLoadingByName } = useGetClientsByName(debouncedSearchTerm);

  useEffect(() => {
    if (searchValue) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [searchValue]);

  const handleEdit = (client: Client) => {
    setEditingClientId(client.id);
    resetEditForm({
      first_name: client.first_name,
      last_name: client.last_name,
      dni: client.dni,
      email: client.email,
      cuil: client.cuil
    });
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
  };

  const onSubmitEdit = (data: EditClientForm) => {
    if (!editingClientId) return;
    
    editClient({
      id: editingClientId,
      ...data
    });
    setEditingClientId(null);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`¿Estás seguro de eliminar a ${client.first_name} ${client.last_name}?`)) {
      deleteClient(client.id);
    }
  };

  const displayClients = debouncedSearchTerm.trim().length >= 3 ? clientsByName : clients;
  const showLoading = !isTyping && (debouncedSearchTerm.trim().length >= 3 ? isLoadingByName : isLoading);

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar clientes por nombre..."
          {...register('search', {
            validate: value => value.length === 0 || value.length >= 3 || 'ingresa al menos 3 caracteres',
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      {showLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !displayClients.length ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          {!isLoadingByName ?<p className="text-blue-700">No se encontraron clientes</p>:
          <p className="text-blue-700">Buscando...</p>}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className={`transition-colors ${editingClientId === client.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* DNI */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClientId === client.id ? (
                        <input
                          {...registerEdit('dni', { required: 'DNI es requerido' })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{client.dni}</span>
                      )}
                    </td>

                    {/* Apellido */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClientId === client.id ? (
                        <input
                          {...registerEdit('last_name', { required: 'Apellido es requerido' })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">{client.last_name}</span>
                      )}
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClientId === client.id ? (
                        <input
                          {...registerEdit('first_name', { required: 'Nombre es requerido' })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 font-semibold">{client.first_name}</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClientId === client.id ? (
                        <input
                          type="email"
                          {...registerEdit('email', { 
                            required: 'Email es requerido',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Email inválido'
                            }
                          })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">{client.email}</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingClientId === client.id ? (
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
                            onClick={() => handleEdit(client)} 
                            className="text-indigo-600 hover:text-indigo-900" 
                            title="Editar"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(client)} 
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900" 
                            title="Eliminar"
                          >
                            {isDeleting ? (
                              <span>Eliminando...</span>
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