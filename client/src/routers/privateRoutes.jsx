import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WebLayout from "../web/Layout";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import Layout from "../app/layout/Layout";
import DashBoard from "../app/UI/DashBoard";
import Masterdata from "../app/UI/MasterData";
import Material from "../app/UI/Material/Material";
import Registration from "../auth/Registration";
import Home from "../store/UI/Home";
import Storelayout from "../store/layout/storelayout";
import CustomerManagement from "../app/UI/memberManagement/CustomerManagemnt";
import MemberManagement from "../app/UI/memberManagement/MemberManagement";
import SuplierManagement from "../app/UI/memberManagement/SupliesManagement";
import MaterialReceived from "../app/UI/Material/REceived";
import MaterialStock from "../app/UI/Material/Stock";
import MaterialUse from "../app/UI/Material/Use";
import Payment from "../app/UI/Material/Payment";
import ProductManagemnet from "../app/UI/Products/ProductManagment";
import ProductStock from "../app/UI/Products/Stock";
import Stages from "../app/UI/Products/Stages";
import QuaityUpdate from "../app/UI/Products/QuaityUpdate";
import Creation from "../app/UI/Products/Creation";

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
      { path: "Product_Management", element: <ProductManagemnet/> },
      { path: "Masterdata", element: <Masterdata /> },
      { path: "Material", element: <Material /> },
      { path: "customers", element: <CustomerManagement/> },
      { path: "members", element: <MemberManagement /> },
      { path: "suppliers", element: <SuplierManagement /> },
      { path: "material/receive", element: <MaterialReceived /> },
      { path: "material/stock", element: <MaterialStock /> },
      { path: "material/use", element: <MaterialUse /> },
      { path: "materila/payment", element: <Payment /> },
      { path: "product/stock", element: <ProductStock /> },
      { path: "product/stages", element: <Stages /> },
      { path: "product/quality", element: <QuaityUpdate /> },
      { path: 'product/creation', element: <Creation /> },
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
