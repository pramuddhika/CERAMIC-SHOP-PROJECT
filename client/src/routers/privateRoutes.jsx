import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WebLayout from "../web/Layout";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import Layout from "../app/layout/Layout";
import DashBoard from "../app/UI/DashBoard";
import ProductManagemnet from "../app/UI/ProductManagment";
import Masterdata from "../app/UI/MasterData";
import Material from "../app/UI/Material";
import Registration from "../auth/Registration";
import Home from "../store/UI/Home";
import CustomerManagement from "../app/UI/CustomerManagemnt";
import MemberManagement from "../app/UI/MemberManagement";
import SuplierManagement from "../app/UI/SupliesManagement";
import Storelayout from "../store/layout/storelayout";

const router = createBrowserRouter([
  { path: "/", element: <WebLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/registration", element: <Registration/> },
  {
    path: "/app",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "Product_Management", element: <ProductManagemnet /> },
      { path: "Masterdata", element: <Masterdata /> },
      { path: "Material", element: <Material /> },
      { path: "customers", element: <CustomerManagement/> },
      { path: "members", element: <MemberManagement /> },
      { path: "suppliers", element: <SuplierManagement/> },
    ],
  },
  {
    path: "/ceramic",
    //TODO: change the layout to new shop layout
    element: <Storelayout />,
    children: [
      { path: "home", element: <Home/> },
    ],
  }
]);
const PrivateRoutes = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default PrivateRoutes;
