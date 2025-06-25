import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ServiceTenant from "@/pages/tenant/ServiceTenant";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const Layout = () => (
  <>
    {/* <Header /> */}
    <Outlet />
    {/* <Footer /> */}
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
        path: "/service/:id",
        element: <ServiceTenant />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },
    ],
  },
]);

function RoutesWeb() {
  return <RouterProvider router={routers} />;
}

export default RoutesWeb;
