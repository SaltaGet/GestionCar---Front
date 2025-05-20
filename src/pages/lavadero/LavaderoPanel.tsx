import apiGestionCar from '@/api/gestionCarApi';
import AdminDashboard from '@/components/admin/AdminDashboard';
import useAuthStore from '@/store/authStore';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const getLavaderoToken = async (ctx: QueryFunctionContext) => {
  const [_, id] = ctx.queryKey;
  void _;
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.get(`/auth/workplace_login/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const LavaderoPanel = () => {
  const { id } = useParams();
  const { setWorkPlaceToken } = useAuthStore();

  const { data, isSuccess } = useQuery({
    queryKey: ['lavadero_workplace', id], // Clave única para lavadero
    queryFn: getLavaderoToken,
    staleTime: Infinity
  });

  useEffect(() => {
    if (isSuccess) {
      setWorkPlaceToken(data.body);
    }
  }, [isSuccess, data, setWorkPlaceToken]);

  return (
    <div>
      <h1>LavaderoPanel</h1>
      <AdminDashboard />
    </div>
  );
};

export default LavaderoPanel;