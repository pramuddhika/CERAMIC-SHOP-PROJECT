import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WebLayout from "../web/Layout";

const router = createBrowserRouter([
    { path: "/", element: <WebLayout /> }
]);

const PrivateRoutes = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default PrivateRoutes;
