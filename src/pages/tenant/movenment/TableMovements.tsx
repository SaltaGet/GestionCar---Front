import { useForm } from 'react-hook-form';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Save, X, Edit2, Trash2, MoreVertical, Filter } from 'lucide-react';
import useDeleteAndEditMovements from '@/hooks/movements/useDeleteAndEditMovements';
import { useGetAllMovements } from '@/hooks/movements/useGetAllMovements';

type Movement = {
  id: string;
  name: string;
  is_income: boolean;
  created_at: string;
  updated_at: string;
};

type EditMovementForm = {
  name: string;
  is_income: boolean;
};

export const TableMovements = () => {
  // Formulario para edición
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<EditMovementForm>();

  // Estados
  const [editingMovementId, setEditingMovementId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [filterIncome, setFilterIncome] = useState<boolean | undefined>(true);
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Hooks
  const { movements, isLoading } = useGetAllMovements(filterIncome);
  const { editMovement, deleteMovement, isEditing, isDeleting } = useDeleteAndEditMovements();

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
    document.body.style.overflow = activePopupId ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [activePopupId]);

  // Handlers
  const handleEdit = (movement: Movement) => {
    setEditingMovementId(movement.id);
    setActivePopupId(null);
    resetEditForm({ name: movement.name, is_income: movement.is_income });
  };

  const handleCancelEdit = () => setEditingMovementId(null);

  const onSubmitEdit = (data: EditMovementForm) => {
    if (!editingMovementId) return;
    editMovement({ id: editingMovementId, ...data });
    setEditingMovementId(null);
  };

  const handleDelete = (movement: Movement) => {
    setActivePopupId(null);
    if (confirm(`¿Eliminar el movimiento "${movement.name}"?`)) {
      deleteMovement(movement.id);
    }
  };

  const setPopupRef = (id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  };

  const togglePopup = (movementId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setActivePopupId(prev => prev === movementId ? null : movementId);
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilterIncome(true)}
          className={`px-3 py-1 text-sm rounded ${
            filterIncome === true ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <Filter className="h-4 w-4 inline mr-1" />
          Ingresos
        </button>
        <button
          onClick={() => setFilterIncome(false)}
          className={`px-3 py-1 text-sm rounded ${
            filterIncome === false ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <Filter className="h-4 w-4 inline mr-1" />
          Gastos
        </button>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : movements.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            {filterIncome === undefined 
              ? "No hay movimientos registrados" 
              : filterIncome 
                ? "No hay ingresos registrados" 
                : "No hay gastos registrados"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actualizado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr 
                    key={movement.id} 
                    className={`transition-colors ${editingMovementId === movement.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMovementId === movement.id ? (
                        <input
                          {...registerEdit('name', { required: true })}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{movement.name}</span>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMovementId === movement.id ? (
                        <select
  {...registerEdit('is_income', { 
    setValueAs: (value) => value === 'true' // Convierte el string a booleano
  })}
  className="w-full px-2 py-1 border rounded text-sm"
>
  <option value="true">Ingreso</option>
  <option value="false">Gasto</option>
</select>
                      ) : (
                        <span className={`text-sm font-medium ${movement.is_income ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.is_income ? 'Ingreso' : 'Gasto'}
                        </span>
                      )}
                    </td>

                    {/* Fechas */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(movement.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(movement.updated_at).toLocaleDateString()}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {editingMovementId === movement.id ? (
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
                            onClick={(e) => togglePopup(movement.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {activePopupId === movement.id && (
                            <div 
                              ref={setPopupRef(movement.id)}
                              className="fixed z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: `${popupPosition.top}px`,
                                left: `${popupPosition.left - 180}px`
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEdit(movement)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(movement)}
                                  disabled={isDeleting}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
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