import axios from 'axios';

// Usar la variable de entorno definida
const apiGestionCar = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default apiGestionCar;
