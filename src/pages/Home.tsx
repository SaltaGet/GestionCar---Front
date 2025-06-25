import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCar, FaTools, FaCarSide, FaOilCan,FaArrowRight, FaWater, FaShower } from "react-icons/fa";
import { GiCarWheel, GiAutoRepair, GiCarKey } from "react-icons/gi";
import { MdElectricalServices, MdCarRental } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dashboard");
  };

  const services = [
    { icon: <FaTools className="text-3xl" />, name: "Taller Mecánico" },
    { icon: <FaWater className="text-3xl" />, name: "Lavado Profesional" },
    { icon: <GiCarWheel className="text-3xl" />, name: "Alineación y Balanceo" },
    { icon: <MdElectricalServices className="text-3xl" />, name: "Diagnóstico Electrónico" },
    { icon: <FaOilCan className="text-3xl" />, name: "Cambio de Fluidos" },
    { icon: <GiCarKey className="text-3xl" />, name: "Venta de Repuestos" },
    { icon: <MdCarRental className="text-3xl" />, name: "Renta de Vehículos" },
    { icon: <FaShower className="text-3xl" />, name: "Detallado Profesional" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Profesional */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <FaCar className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-800">AutoGestión Pro</span>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Servicios</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
          </nav>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hidden md:block"
          >
            Acceso Clientes
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                Solución Integral para <span className="text-blue-600">Negocios Automotrices</span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-gray-600 mb-8 max-w-lg"
              >
                Control completo para talleres mecánicos, lavaderos, venta de repuestos y servicios automotrices. Optimiza tu negocio con nuestra plataforma todo-en-uno.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleStart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md flex items-center gap-2 transition-all"
                >
                  Empezar Ahora <FaArrowRight />
                </button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:w-1/2 relative"
            >
              <div className="bg-blue-100 p-12 rounded-3xl relative">
                <div className="flex justify-center gap-4">
                  <FaCarSide className="text-6xl text-blue-600" />
                  <FaWater className="text-6xl text-blue-500" />
                  <GiAutoRepair className="text-6xl text-blue-700" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                  <GiCarKey className="text-4xl text-blue-600" />
                </div>
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-lg">
                  <MdElectricalServices className="text-4xl text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Servicios Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Gestionamos Todo Tipo de <span className="text-blue-600">Servicios Automotrices</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600">Control completo de inventario, clientes y procesos</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Nuestras <span className="text-blue-600">Funcionalidades</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Gestión de Inventario</h3>
              <p className="text-gray-600">Control de repuestos, productos de limpieza y materiales con alertas de stock bajo.</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Agendamiento Inteligente</h3>
              <p className="text-gray-600">Sistema de citas integrado con recordatorios automáticos para tus clientes.</p>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reportes y Analytics</h3>
              <p className="text-gray-600">Métricas detalladas de tu negocio para tomar mejores decisiones.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Profesional */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaCar className="mr-2" /> AutoGestión Pro
              </h3>
              <p className="text-gray-300">La solución todo-en-uno para negocios automotrices.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Talleres Mecánicos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Lavaderos Profesionales</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Venta de Repuestos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Funcionalidades</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gestión de Inventario</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Control de Citas</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Reportes Financieros</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">contacto@autogestionpro.com</li>
                <li className="text-gray-300">+1 234 567 890</li>
                <li>
                  <button 
                    onClick={handleStart}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium mt-2"
                  >
                    Acceso Clientes
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} AutoGestión Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;