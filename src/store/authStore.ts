import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  // Campos adicionales para el tenant
  is_admin: boolean;
  member_id: string;
  permissions: string[];
  role_id: string;
  role_name: string;
  tenant_id: string;
};

type AuthStore = {
  token: string | null;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  setToken: (token: string) => void;
  setTokenWithTenant: (token: string) => void;
  clearAuth: () => void;
  //ESTADOS PARA EL TENANT
  is_admin: boolean | null;
  member_id: string | null;
  permissions: string[] | null;
  role_id: string | null;
  role_name: string | null;
  tenant_id: string | null;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      firstName: null,
      lastName: null,
      username: null,
      // Valores iniciales para tenant
      is_admin: null,
      member_id: null,
      permissions: null,
      role_id: null,
      role_name: null,
      tenant_id: null,

      setToken: (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            userId: decoded.id,
            firstName: decoded.first_name,
            lastName: decoded.last_name,
            username: decoded.username,
          });
        } catch (err) {
          console.error('Error decoding token:', err);
          set({
            token,
            userId: null,
            firstName: null,
            lastName: null,
            username: null,
          });
        }
      },

      setTokenWithTenant: (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            userId: decoded.id,
            firstName: decoded.first_name,
            lastName: decoded.last_name,
            username: decoded.username,
            // Campos del tenant
            is_admin: decoded.is_admin,
            member_id: decoded.member_id,
            permissions: decoded.permissions,
            role_id: decoded.role_id,
            role_name: decoded.role_name,
            tenant_id: decoded.tenant_id,
          });
        } catch (err) {
          console.error('Error decoding token with tenant info:', err);
          set({
            token,
            userId: null,
            firstName: null,
            lastName: null,
            username: null,
            // Resetear campos del tenant también
            is_admin: null,
            member_id: null,
            permissions: null,
            role_id: null,
            role_name: null,
            tenant_id: null,
          });
        }
      },

      clearAuth: () =>
        set({
          token: null,
          userId: null,
          firstName: null,
          lastName: null,
          username: null,
          // Limpiar también los campos del tenant
          is_admin: null,
          member_id: null,
          permissions: null,
          role_id: null,
          role_name: null,
          tenant_id: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;