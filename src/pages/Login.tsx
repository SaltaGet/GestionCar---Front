import apiGestionCar from "@/api/gestionCarApi";
import { Spinner } from "@/components/LoadingComponents";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormLogin {
    username: string,
    password: string
}

const postLogin = async (form:FormLogin) => {
    const {data} = await apiGestionCar.post("/auth/login",form)
    return data
}

const Login: React.FC = () => {
  const [form, setForm] = useState<FormLogin>({ username: "", password: "" });
  const navigate = useNavigate();
  const {setToken} = useAuthStore();

  const {mutate,isPending}= useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setToken(data.body)
      navigate("/dashboard")

    },
    onError: () => {
      alert("Credenciales incorrectas")
    }
  }) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
    mutate(form)
    // Aquí puedes hacer el fetch o mutate
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {!isPending ?<button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>: <Spinner size="md" color="text-blue-500" className="mx-auto" />}
      </form>
    </div>
  );
};

export default Login;
