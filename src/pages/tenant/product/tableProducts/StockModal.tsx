import type { Product } from "@/hooks/products/useGetAllProducts";
import { useState } from "react";

interface StockModalProps {
  product: Product;
  onClose: () => void;
  onUpdateStock: (newStock: number) => void;
}

export const StockModal = ({ product, onClose, onUpdateStock }: StockModalProps) => {
  const [newStock, setNewStock] = useState(product.stock.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStock(Number(newStock));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-medium mb-4">
          Actualizar stock para {product.name}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock actual: {product.stock}
            </label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nuevo stock"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};