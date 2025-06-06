import { Outlet } from "react-router-dom";
import StoreTopNav from "./StoreTopNav";

const Storelayout = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-screen">
        <div className="fixed mb-10 min-w-full z-50 bg-slate-700">
          <StoreTopNav/>
        </div>
        <div className="overflow-auto mt-20 px-3 min-w-full z-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Storelayout;