import apiGestionCar from "@/api/gestionCarApi";
import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaSignOutAlt, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Tipos mejor definidos
type Workplace = {
  address: string;
  created_at: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  updated_at: string;
  is_active: boolean;
  user_is_active: boolean;
};

type ApiResponse = {
  body: Workplace[];
  message: string;
  status: boolean;
};

const getWorkplace = async (): Promise<ApiResponse> => {
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.get<ApiResponse>("/tenant/get_all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const Dashboard = () => {
  const { token, firstName, lastName, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const { data: workplaces } = useQuery<ApiResponse, Error>({
    queryKey: ["workplace"],
    queryFn: getWorkplace
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // Configuración única para todos los workplaces
  const workplaceConfig = {
    icon: <FaStore className="text-3xl text-purple-600" />,
    title: "Servicio",
    description: "Acceder al servicio",
    bgColor: "bg-purple-100",
    hoverBgColor: "bg-purple-200",
    borderColor: "hover:border-purple-300",
    bgHoverColor: "hover:bg-purple-50",
    redirect: "/service"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Bienvenido,{" "}
          <span className="text-blue-600">
            {firstName} {lastName}
          </span>
        </h1>
        <p className="text-gray-500 text-lg">Seleccione</p>
      </div>

      {/* Manejo seguro de workplaces con verificación completa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {workplaces?.body && workplaces.body.length > 0 ? (
          workplaces.body.map((workplace) => (
            <button
              key={workplace.id}
              className={`
                bg-white border border-gray-200 rounded-xl
                p-8 flex flex-col items-center justify-center
                transition-all duration-200
                shadow-sm hover:shadow-md
                ${workplaceConfig.borderColor} ${workplaceConfig.bgHoverColor}
                group
              `}
              onClick={() => navigate(`${workplaceConfig.redirect}/${workplace.id}`)}
            >
              <div
                className={`
                  ${workplaceConfig.bgColor} p-4 rounded-full
                  mb-5 group-hover:${workplaceConfig.hoverBgColor}
                  transition-colors duration-200
                `}
              >
                {workplaceConfig.icon}
              </div>
              <span className="text-xl font-semibold text-gray-700">
                {workplace.name || workplaceConfig.title}
              </span>
              <p className="text-gray-400 text-sm mt-1">
                {workplaceConfig.description}
              </p>
            </button>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center">
            No hay servicios disponibles
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="
          mt-8 px-8 py-3 rounded-full
          bg-gradient-to-r from-rose-500 to-rose-600
          text-white font-semibold text-lg
          shadow-md hover:shadow-lg
          flex items-center justify-center
          space-x-2
          border border-rose-700
          hover:from-rose-600 hover:to-rose-700
        "
      >
        <FaSignOutAlt className="text-xl" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Dashboard;