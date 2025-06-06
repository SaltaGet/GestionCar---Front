import apiGestionCar from '@/api/gestionCarApi';
import AdminDashboard from '@/components/admin/AdminDashboard';
import useAuthStore from '@/store/authStore';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const getNewToken = async (ctx: QueryFunctionContext) => {
  const [_, id] = ctx.queryKey;
  void _;
  const token = useAuthStore.getState().token;
  const { data } = await apiGestionCar.get(`/auth/tenant_login/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const ServiceTenant = () => {
  const { id } = useParams();
  const { setTokenWithTenant, } = useAuthStore();

  const { data, isSuccess } = useQuery({
    queryKey: ['tenant-current', id], // Clave única para lavadero
    queryFn: getNewToken,
    staleTime: Infinity
  });

  useEffect(() => {
    if (isSuccess) {
      setTokenWithTenant(data.body);
    }
  }, [isSuccess, data, setTokenWithTenant]);

  return (
    <div>
      <h1>Testing</h1>
      <AdminDashboard />
    </div>
  );
};

export default ServiceTenant;