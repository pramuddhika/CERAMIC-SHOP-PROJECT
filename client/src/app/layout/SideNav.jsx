import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import "../../utils/SlideBar.css";

const SideNav = ({ setActiveTopic }) => {
  const location = useLocation();
  const [showUserSubsetUser, setShowUserSubsetUser] = useState(() => {
    const savedState = localStorage.getItem("showSubsetUser");
    return savedState === "true";
  });
  const [showUserSubsetMaterial, setShowUserSubsetMaterial] = useState(() => {
    const savedState = localStorage.getItem("showSubsetMaterial");
    return savedState === "true";
  });
  const [showUserSubsetProduct, setShowUserSubsetProduct] = useState(() => {
    const savedState = localStorage.getItem("showSubsetProduct");
    return savedState === "true";
  });
  const currentUser = JSON.parse(localStorage.getItem("User"));

  const toggleUserSubset = () => {
    setShowUserSubsetUser((prev) => {
      const newState = !prev;
      localStorage.setItem("showSubsetUSer", newState);
      return newState;
    });
  };

  const toggleMaterialSubset = () => {
    setShowUserSubsetMaterial((prev) => {
      const newState = !prev;
      localStorage.setItem("showSubsetMaterial", newState);
      return newState;
    });
  };

  const toggleProductSubset = () => {
    setShowUserSubsetProduct((prev) => {
      const newState = !prev;
      localStorage.setItem("showSubsetProduct", newState);
      return newState;
    });
  };

  const NavItem = ({ to, Icon, topic, label }) => {
    const isActive = location.pathname === to;
    NavItem.propTypes = {
      to: PropTypes.string.isRequired,
      Icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired,
    };

    return (
      <Link to={to} onClick={() => setActiveTopic(topic)}>
        <div
          className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
            ${
              isActive ? "text-white bg-slate-900 font-bold" : "text-gray-300"
            }`}
        >
          <Icon className="h-6 w-6" />
          <p className="flex items-center">{label}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-[180px] bg-slate-700 flex flex-col h-full">
        <div className="flex-shrink-0 flex items-center justify-center h-16 bg-slate-700 mb-4">
          <h1 className="text-white font-bold text-lg">GLEAM CERAMIC</h1>
        </div>
        <div className="flex-1 overflow-y-auto sidebar">
          <NavItem
            to="/app/dashboard"
            Icon={() => <i className="bi bi-card-text"></i>}
            label="Dashboard"
            topic="Dashboard"
          />
          {currentUser?.role === "Admin" && (
            <NavItem
              to="/app/MasterData"
              Icon={() => <i className="bi bi-card-text"></i>}
              label="Master Data"
              topic="Master Data"
            />
          )}

          {currentUser?.role === "Admin" && (
            <div
              className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
        ${
          showUserSubsetUser
            ? "text-white border border-gray-300 font-bold"
            : "text-gray-300"
        }`}
              onClick={toggleUserSubset}
            >
              <i className="bi bi-people"></i>
              <p>User Management</p>
            </div>
          )}

          {showUserSubsetUser && (
            <div className="pl-3">
              <NavItem
                to="/app/members"
                Icon={() => <i className="bi bi-person-fill-gear"></i>}
                label="Members"
                topic="Member Management"
              />
              <NavItem
                to="/app/suppliers"
                Icon={() => <i className="bi bi-boxes"></i>}
                label="Suppliers"
                topic="Supplier Management"
              />
              <NavItem
                to="/app/customers"
                Icon={() => <i className="bi bi-diagram-3"></i>}
                label="Customers"
                topic="Customer Management"
              />
            </div>
          )}

          {currentUser?.role !== "Sales Manager" && (
            <div
              className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
        ${
          showUserSubsetMaterial
            ? "text-white border border-gray-300 font-bold"
            : "text-gray-300"
        }`}
              onClick={toggleMaterialSubset}
            >
              <i className="bi bi-basket2-fill"></i>
              <p>Material</p>
            </div>
          )}

          {showUserSubsetMaterial && (
            <div className="pl-3">
              <NavItem
                to="/app/Material"
                Icon={() => <i className="bi bi-list-task"></i>}
                label="List"
                topic="Material List"
              />
              <NavItem
                to="/app/material/receive"
                Icon={() => <i className="bi bi-box-arrow-in-up"></i>}
                label="Receive"
                topic="Material Receive Note"
              />
              <NavItem
                to="/app/materila/payment"
                Icon={() => <i className="bi bi-credit-card-2-back"></i>}
                label="Payment"
                topic="Suppiler Payment Note"
              />
              <NavItem
                to="/app/material/stock"
                Icon={() => <i className="bi bi-clipboard-plus"></i>}
                label="Stock"
                topic="Material Stock"
              />
              <NavItem
                to="/app/material/use"
                Icon={() => <i className="bi bi-clipboard2-data"></i>}
                label="Use"
                topic="Material Send Note"
              />
            </div>
          )}

          {currentUser?.role !== "Sales Manager" && (
            <div
              className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
           ${
             showUserSubsetProduct
               ? "text-white border border-gray-300 font-bold"
               : "text-gray-300"
           }`}
              onClick={toggleProductSubset}
            >
              <i className="bi bi-box-seam"></i>
              <p>Product</p>
            </div>
          )}

          {showUserSubsetProduct && (
            <div className="pl-3">
              <NavItem
                to="/app/Product_Management"
                Icon={() => <i className="bi bi-list-task"></i>}
                label="List"
                topic="Product List"
              />
              <NavItem
                to="/app/product/creation"
                Icon={() => <i className="bi bi-screwdriver"></i>}
                label="Creation"
                topic="Product Creation Note"
              />
              <NavItem
                to="/app/product/stages"
                Icon={() => <i className="bi bi-clipboard2-data"></i>}
                label="Stages"
                topic="Product Stages"
              />
              {/* <NavItem
              to="/app/product/quality"
              Icon={() => <i className="bi bi-box-arrow-in-up"></i>}
              label="Quality"
              topic="Product Quality Check Note"
            /> */}
              <NavItem
                to="/app/product/stock"
                Icon={() => <i className="bi bi-clipboard-plus"></i>}
                label="Stock"
                topic="Product Stock"
              />
            </div>
          )}

          {currentUser?.role !== "Stock Manager" && (
            <NavItem
              to="/app/income"
              Icon={() => <i className="bi bi-cash-coin"></i>}
              label="Payments"
              topic="Order Payments"
            />
          )}

          {currentUser?.role !== "Stock Manager" && (
            <NavItem
              to="/app/order-data"
              Icon={() => <i className="bi bi-file-earmark-text"></i>}
              label="Order Data"
              topic="Order Data"
            />
          )}

          {currentUser?.role !== "Stock Manager" && (
            <NavItem
              to="/app/contact-us"
              Icon={() => <i className="bi bi-person-rolodex"></i>}
              label="Contact Us"
              topic="Contact Us"
            />
          )}

          <NavItem
            to="/app/profile"
            Icon={() => <i className="bi bi-person-circle"></i>}
            label="Profile"
            topic="Profile"
          />
        </div>
        <div className="flex-shrink-0 w-full bg-slate-700 py-4">
          <div
            className="flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer text-gray-300"
            onClick={() => {
              localStorage.clear();
              setTimeout(() => {
                window.location.href = "/";
              }, 0);
            }}
          >
            <i className="bi bi-door-open-fill"></i>
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SideNav.propTypes = {
  setActiveTopic: PropTypes.func.isRequired,
};

export default SideNav;
