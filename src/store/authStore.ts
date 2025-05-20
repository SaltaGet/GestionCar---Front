import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
};

type AuthStore = {
  token: string | null;
  workPlaceToken: string | null;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  username: string | null;
  setToken: (token: string) => void;
  setWorkPlaceToken: (token: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      workPlaceToken: null,
      userId: null,
      firstName: null,
      lastName: null,
      role: null,
      username: null,

      setToken: (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            userId: decoded.id,
            firstName: decoded.first_name,
            lastName: decoded.last_name,
            role: decoded.role,
            username: decoded.username,
          });
        } catch (err) {
          console.error('Error decoding token:', err);
          set({
            token,
            userId: null,
            firstName: null,
            lastName: null,
            role: null,
            username: null,
          });
        }
      },

      setWorkPlaceToken: (token: string) => {
        set({ workPlaceToken: token });
      },

      clearAuth: () =>
        set({
          token: null,
          workPlaceToken: null,
          userId: null,
          firstName: null,
          lastName: null,
          role: null,
          username: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Opcional: puedes seleccionar qué propiedades persistir
      // partialize: (state) => ({
      //   token: state.token,
      //   userId: state.userId,
      //   firstName: state.firstName,
      //   lastName: state.lastName,
      //   role: state.role,
      //   username: state.username,
      // }),
    }
  )
);

export default useAuthStore;