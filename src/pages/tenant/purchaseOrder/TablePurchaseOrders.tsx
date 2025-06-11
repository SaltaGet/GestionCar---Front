import { useState, useRef, useCallback, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, FileText, X } from 'lucide-react';
import { useGetAllPurchaseOrders } from '@/hooks/purchaseOrder/useGetAllPurchaseOrders';
import useDeleteAndEditPurchaseOrders from '@/hooks/purchaseOrder/useDeleteAndEditPurchaseOrders';

export const TablePurchaseOrders = () => {
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    orderId: string;
  } | null>(null);
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Obtener todas las órdenes de compra
  const { purchaseOrders, isLoading } = useGetAllPurchaseOrders();
  const {deletePurchaseOrder} = useDeleteAndEditPurchaseOrders();

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

  const handleEdit = useCallback((orderId: string) => {
    setModalContent({
      title: "Editar Orden",
      orderId: orderId
    });
    setShowModal(true);
    setActivePopupId(null);
  }, []);

  const handleViewDetails = useCallback((orderId: string) => {
    setModalContent({
      title: "Detalles de Orden",
      orderId: orderId
    });
    setShowModal(true);
    setActivePopupId(null);
  }, []);

  const handleDelete = useCallback((orderId: string) => {
  setActivePopupId(null);
  
  // Show confirmation dialog
  const confirmDelete = window.confirm(
    "¿Estás seguro que deseas eliminar esta orden de compra? Esta acción no se puede deshacer."
  );
  
  if (confirmDelete) {
    deletePurchaseOrder(orderId);
  }
}, [deletePurchaseOrder]);

  const setPopupRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    popupRefs.current[id] = el;
  }, []);

  const togglePopup = useCallback((orderId: string) => {
    setActivePopupId(prev => prev === orderId ? null : orderId);
  }, []);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !purchaseOrders.length ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">No se encontraron órdenes de compra</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchaseOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* Número de orden */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.order_number}</span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(order.order_date).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Monto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        ${order.amount.toLocaleString()}
                      </span>
                    </td>

                    {/* Fecha de creación */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => togglePopup(order.id)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          aria-label="Menú de acciones"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        
                        {/* Popup de acciones */}
                        {activePopupId === order.id && (
                          <div 
                            ref={setPopupRef(order.id)}
                            className="fixed z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                            style={{
                              right: '20px',
                              transform: 'translateX(-100%)'
                            }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(order.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Editar
                              </button>
                              
                              <button
                                onClick={() => handleViewDetails(order.id)}
                                className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver detalles
                              </button>
                              
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
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

      {/* Modal genérico */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{modalContent.title}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p><span className="font-medium">ID de la orden:</span> {modalContent.orderId}</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};