import { useForm } from 'react-hook-form';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Save, X, Edit2, Trash2, MoreVertical, Phone, Mail, MapPin, Search } from 'lucide-react';
import { useGetAllSuppliers } from '@/hooks/suppliers/useGetAllSuppliers';
import useDeleteAndEditSuppliers from '@/hooks/suppliers/useDeleteAndEditSuppliers';
import { useDebounce } from 'use-debounce';
import { useGetSuppliersByName } from '@/hooks/suppliers/useGetByNameSuppliers';

type Supplier = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type EditSupplierForm = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export const TableSuppliers = () => {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Término de búsqueda con debounce
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Formulario para edición
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors }
  } = useForm<EditSupplierForm>();

  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { editSupplier, deleteSupplier, isEditing, isDeleting } = useDeleteAndEditSuppliers();

  // Obtener todos los proveedores o los filtrados según el término de búsqueda
  const { suppliers: allSuppliers, isLoading } = useGetAllSuppliers();
  const { suppliers: filteredSuppliers, isLoading: isLoadingByName } = useGetSuppliersByName(debouncedSearchTerm);

  // Determinar qué proveedores mostrar
  const suppliersToShow = debouncedSearchTerm ? filteredSuppliers : allSuppliers;

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

  const handleEdit = useCallback((supplier: Supplier) => {
    setEditingSupplierId(supplier.id);
    setActivePopupId(null);
    resetEditForm({
      name: supplier.name,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email
    });
  }, [resetEditForm]);

  const handleCancelEdit = useCallback(() => {
    setEditingSupplierId(null);
  }, []);

  const onSubmitEdit = useCallback((data: EditSupplierForm) => {
    if (!editingSupplierId) return;
    editSupplier({ id: editingSupplierId, ...data });
    setEditingSupplierId(null);
  }, [editingSupplierId, editSupplier]);

  const handleDelete = useCallback((supplier: Supplier) => {
    setActivePopupId(null);
    if (confirm(`¿Estás seguro de eliminar el proveedor "${supplier.name}"?`)) {
      deleteSupplier(supplier.id);
    }
  }, [deleteSupplier]);

  const setPopupRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  }, []);

  const togglePopup = useCallback((supplierId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setActivePopupId(prev => prev === supplierId ? null : supplierId);
  }, []);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar proveedores..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {isLoading || (debouncedSearchTerm && isLoadingByName) ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !suppliersToShow.length ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            {debouncedSearchTerm 
              ? `No se encontraron proveedores para "${debouncedSearchTerm}"` 
              : 'No se encontraron proveedores'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliersToShow.map((supplier) => (
                  <tr 
                    key={supplier.id} 
                    className={`transition-colors ${editingSupplierId === supplier.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSupplierId === supplier.id ? (
                        <input
                          {...registerEdit('name', { required: 'Nombre es requerido' })}
                          className={`w-full px-2 py-1 border rounded text-sm ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                      )}
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSupplierId === supplier.id ? (
                        <div className="space-y-2">
                          <div>
                            <input
                              {...registerEdit('phone', { 
                                required: 'Teléfono es requerido',
                                pattern: {
                                  value: /^[0-9+-]+$/,
                                  message: 'Formato inválido'
                                }
                              })}
                              className={`w-full px-2 py-1 border rounded text-sm ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.phone && (
                              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                            )}
                          </div>
                          <div>
                            <input
                              {...registerEdit('email', {
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Email inválido'
                                }
                              })}
                              className={`w-full px-2 py-1 border rounded text-sm ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.email && (
                              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            {supplier.phone}
                          </div>
                          {supplier.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-1" />
                              {supplier.email}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Dirección */}
                    <td className="px-6 py-4">
                      {editingSupplierId === supplier.id ? (
                        <textarea
                          {...registerEdit('address')}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          rows={2}
                        />
                      ) : (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{supplier.address || 'Sin dirección'}</span>
                        </div>
                      )}
                    </td>

                    {/* Fecha de creación */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(supplier.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {editingSupplierId === supplier.id ? (
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
                            onClick={(e) => togglePopup(supplier.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Menú de acciones"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {/* Popup de acciones */}
                          {activePopupId === supplier.id && (
                            <div 
                              ref={setPopupRef(supplier.id)}
                              className="fixed z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left - 180}px`
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(supplier)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar proveedor
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(supplier)}
                                  disabled={isDeleting}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {isDeleting ? 'Eliminando...' : 'Eliminar proveedor'}
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