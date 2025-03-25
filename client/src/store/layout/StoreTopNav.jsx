import { useState } from "react";
import user from "../../assets/user.png";
import { useNavigate } from "react-router-dom";

const StoreTopNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("User"));

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-slate-700">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex justify-between items-center h-16 p-2 hover:cursor-pointer"
          onClick={()=> {
            navigate("/ceramic/home");
          }}
        >
          <h1 className="text-white font-bold text-lg">GLEAM CERAMIC</h1>
        </div>
        <div className="flex justify-between items-center gap-5 h-16 p-2 relative">
          <button className="text-white bg-slate-700 font-bold px-2"
            onClick={()=> {
              navigate("/ceramic/cart");
            }}
          >
            <i className="bi bi-cart px-2"></i>
            Cart
          </button>
          <div className="relative">
            <button
              className="text-white bg-slate-700 font-bold flex items-center px-2 gap-2"
              onClick={toggleDropdown}
            >
              {currentUser?.firstName}{' '}{currentUser?.lastName}
              <img
                src={user}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg" style={{ zIndex: 9999, top: "100%"}} >
                <ul className="py-2 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={()=> {
                      navigate("/ceramic/profile");
                      toggleDropdown();
                    }}
                  >
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={()=> {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTopNav;