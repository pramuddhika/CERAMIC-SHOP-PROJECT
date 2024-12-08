import { Outlet } from "react-router-dom";
import SideNav from "./sideNav";
import TopBar from "./TopBar";
import { useState } from "react";

const Layout = () => {
  const [activeTopic, setActiveTopic] = useState("Dashboard");
    return (
      <div className="flex h-screen">
        <div className="fixed w-[180px]">
        <SideNav setActiveTopic={setActiveTopic} />
        </div>
        <div className="flex flex-col w-calc ml-[180px]">
          <div className="fixed w-full mb-10">
          <TopBar topic={activeTopic} />
          </div>
          <div className="overflow-auto mt-20 pl-3">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

export default Layout;
