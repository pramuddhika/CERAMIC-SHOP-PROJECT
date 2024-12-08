import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WebLayout from "../web/Layout";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import Layout from "../app/layout/Layout";
import DashBoard from "../app/UI/DashBoard";
import MemberManagemnet from "../app/UI/MemberManagment";

const router = createBrowserRouter([
  { path: "/", element: <WebLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/app", element: <Layout />,
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "Member_Management", element: <MemberManagemnet/> },
    ]
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
