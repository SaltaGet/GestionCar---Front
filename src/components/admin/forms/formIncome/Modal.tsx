import { FaCheck, FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirmar",
  showConfirm = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showConfirm?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes />
        </button>

        <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {title}
        </h1>

        <div className="space-y-4">
          {children}
          {showConfirm && onConfirm && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <FaCheck /> {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;