import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useGetAllClients } from '@/hooks/clients/useGetAllClients';
import { useGetClientsByName } from '@/hooks/clients/usetGetByNameClient';
import { useEffect, useState, useRef, useCallback } from 'react';
import useDeleteAndEditClients from '@/hooks/clients/useDeleteAndEditClients';
import { Save, X, Edit2, Trash2, MoreVertical, User, Mail, CreditCard } from 'lucide-react';

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
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { editClient, deleteClient, isEditing, isDeleting } = useDeleteAndEditClients();

  const searchValue = watch('search');
  const [debouncedSearchTerm] = useDebounce(searchValue, 500);

  const { clients, isLoading } = useGetAllClients();
  const { clients: clientsByName, isLoading: isLoadingByName } = useGetClientsByName(debouncedSearchTerm);

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

  useEffect(() => {
    setIsTyping(!!searchValue);
  }, [searchValue]);

  // Agrega este efecto en tu componente
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

  const handleEdit = useCallback((client: Client) => {
    setEditingClientId(client.id);
    setActivePopupId(null);
    resetEditForm({
      first_name: client.first_name,
      last_name: client.last_name,
      dni: client.dni,
      email: client.email,
      cuil: client.cuil
    });
  }, [resetEditForm]);

  const handleCancelEdit = useCallback(() => {
    setEditingClientId(null);
  }, []);

  const onSubmitEdit = useCallback((data: EditClientForm) => {
    if (!editingClientId) return;
    editClient({ id: editingClientId, ...data });
    setEditingClientId(null);
  }, [editingClientId, editClient]);

  const handleDelete = useCallback((client: Client) => {
    setActivePopupId(null);
    if (confirm(`¿Estás seguro de eliminar a ${client.first_name} ${client.last_name}?`)) {
      deleteClient(client.id);
    }
  }, [deleteClient]);

  const setPopupRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  }, []);

  const togglePopup = useCallback((clientId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setActivePopupId(prev => prev === clientId ? null : clientId);
  }, []);

  const handleViewProfile = useCallback((client: Client) => {
    setActivePopupId(null);
    console.log('Ver perfil de:', client.id);
  }, []);

  const handleSendEmail = useCallback((client: Client) => {
    setActivePopupId(null);
    console.log('Enviar email a:', client.email);
  }, []);

  const displayClients = debouncedSearchTerm.trim().length >= 3 ? clientsByName : clients;
  const showLoading = !isTyping && (debouncedSearchTerm.trim().length >= 3 ? isLoadingByName : isLoading);

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar clientes por nombre..."
          {...register('search')}
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
          {!isLoadingByName ? <p className="text-blue-700">No se encontraron clientes</p> :
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

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
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
                        <div className="flex justify-end">
                          <button 
                            onClick={(e) => togglePopup(client.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Menú de acciones"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {/* Popup de acciones con posicionamiento fijo */}
                          {activePopupId === client.id && (
                            <div 
                              ref={setPopupRef(client.id)}
                              className="fixed z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left - 180}px` // Ajuste para que no se salga por la derecha
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(client)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar cliente
                                </button>
                                
                                <button
                                  onClick={() => handleViewProfile(client)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Ver perfil
                                </button>
                                
                                <button
                                  onClick={() => handleSendEmail(client)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar email
                                </button>
                                
                                <button
                                  onClick={() => console.log('Otra acción para', client.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Ver pagos
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(client)}
                                  disabled={isDeleting}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {isDeleting ? 'Eliminando...' : 'Eliminar cliente'}
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