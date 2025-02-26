import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Register from "@/pages/Register/Register";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
  },
]);

export default Routes;
