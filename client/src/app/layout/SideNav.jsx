import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

const SideNav = ({ setActiveTopic }) => {
  const location = useLocation();
  const [showUserSubset, setShowUserSubset] = useState(() => {
    const savedState = localStorage.getItem('showSubset');
    return savedState === 'true';
  });

  const toggleUserSubset = () => {
    setShowUserSubset((prev) => {
      const newState = !prev;
      localStorage.setItem('showSubset', newState); 
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
      <div className="w-[180px] bg-slate-700">
        <div className="flex items-center justify-center h-16 bg-slate-700 mb-4">
          <h1 className="text-white font-bold text-lg">GLEAM CERAMIC</h1>
        </div>
        <NavItem
          to="/app/dashboard"
          Icon={() => <i className="bi bi-card-text"></i>}
          label="Dashboard"
          topic="Dashboard"
        />
        <NavItem
          to="/app/Product_Management"
          Icon={() => <i className="bi bi-person-lines-fill"></i>}
          label="Product"
          topic="Product Management"
        />
        <NavItem
          to="/app/MasterData"
          Icon={() => <i className="bi bi-card-text"></i>}
          label="Master Data"
          topic="Master Data"
        />
        <NavItem
          to="/app/Material"
          Icon={() => <i className="bi bi-basket2-fill"></i>}
          label="Material"
          topic="Material"
        />

        <div
          className={`flex pl-7 gap-2 items-center hover:text-white hover:bg-text-primary rounded-lg p-2 cursor-pointer
        ${showUserSubset ? "text-white border border-gray-300 font-bold" : "text-gray-300"}`}
          onClick={toggleUserSubset}
        >
          <i className="bi bi-people"></i>
          <p>User Management</p>
        </div>
        {showUserSubset && (
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

        <div className="fixed bottom-4 w-[180px]">
          <NavItem
            to="/"
            Icon={() => <i className="bi bi-door-open-fill"></i>}
            label="Logout"
            onClick={() => localStorage.clear()}
          />
        </div>
      </div>
    </div>
  );
};

SideNav.propTypes = {
  setActiveTopic: PropTypes.func.isRequired,
};

export default SideNav;
