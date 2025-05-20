import Footer from "@/components/HeaderFooter/Footer";
import Header from "@/components/HeaderFooter/Header";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import LavaderoPanel from "@/pages/lavadero/LavaderoPanel";
import Login from "@/pages/Login";
import TallerPanel from "@/pages/taller/TallerPanel";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <h1>FAIL HOME</h1>,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },
      {
        path: "/taller/:id",
        element: <TallerPanel />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },
      {
        path: "/lavadero/:id",
        element: <LavaderoPanel />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },
    ],
  },
]);

function RoutesWeb() {
  return <RouterProvider router={routers} />;
}

export default RoutesWeb;
