/* eslint-disable react/prop-types */
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
import ContactUs from "../app/UI/ContactUs";
import Income from "../app/UI/Income";
import OrderData from "../app/UI/OrderData";
import AppProfile from "../app/UI/Profile";

import Creation from "../app/UI/Products/Creation";
import Cart from "../store/UI/Cart";
import Profile from "../store/UI/Profile";
import ProductView from "../store/UI/ProductViewPage";
import Checkout from "../store/UI/Checkout";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("User")); 
  const isAdmin = user?.role === "Admin" || user?.role === "Sales Manager" || user?.role === "Stock Manager";

  if (role === "Admin" && isAdmin) {
    return children;
  } else if (role === "customer" && user?.role === "customer") {
    return children;
  } else if (role === "customer" && user?.role === "Whole Customer") {
    return children;
  } else {
    console.warn("Unauthorized access attempt or invalid role:", user?.role);
    return <Navigate to="/login" replace />;
  }
};

const router = createBrowserRouter([
  { path: "/", element: <WebLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/registration", element: <Registration /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute role="Admin">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "Product_Management", element: <ProductManagemnet /> },
      { path: "Masterdata", element: <Masterdata /> },
      { path: "Material", element: <Material /> },
      { path: "customers", element: <CustomerManagement /> },
      { path: "members", element: <MemberManagement /> },
      { path: "suppliers", element: <SuplierManagement /> },
      { path: "material/receive", element: <MaterialReceived /> },
      { path: "material/stock", element: <MaterialStock /> },
      { path: "material/use", element: <MaterialUse /> },
      { path: "materila/payment", element: <Payment /> },
      { path: "product/stock", element: <ProductStock /> },
      { path: "product/stages", element: <Stages /> },
      // { path: "product/quality", element: <QuaityUpdate /> },
      { path: "product/creation", element: <Creation /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "income", element: <Income /> },
      { path: "order-data", element: <OrderData /> },
      { path: "profile", element: <AppProfile /> },
    ],
  },
  {
    path: "/ceramic",
    element: (
      <ProtectedRoute role="customer">
        <Storelayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "home", element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "profile", element: <Profile /> },
      { path: "product", element: <ProductView /> },
      { path: "checkout", element: <Checkout /> },
    ],
  },
]);
const PrivateRoutes = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default PrivateRoutes;
