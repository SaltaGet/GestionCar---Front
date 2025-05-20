import apiGestionCar from "@/api/gestionCarApi";
import AdminDashboard from "@/components/admin/AdminDashboard";
import useAuthStore from "@/store/authStore";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const getTokenWorkplace = async (ctx: QueryFunctionContext) => {
  const [_, id] = ctx.queryKey;
  void _;
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.get(`/auth/workplace_login/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const TallerPanel = () => {
  const { id } = useParams(); // Extrae el ID de la URL
  const { setWorkPlaceToken } = useAuthStore();

  const { data, isSuccess } = useQuery({
    queryKey: ["taller_workplace", id],
    queryFn: getTokenWorkplace,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess) {
      setWorkPlaceToken(data.body);
    }
  }, [isSuccess,data, setWorkPlaceToken]);

  return (
    <div>
      <h1>TallerPanel</h1>
      <AdminDashboard />
    </div>
  );
};

export default TallerPanel;
