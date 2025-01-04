import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import { useState, useEffect } from "react";

const Layout = () => {
  const [activeTopic, setActiveTopic] = useState("Dashboard");

  useEffect(() => {
    const savedTopic = localStorage.getItem("activeTopic");
    if (savedTopic) {
      setActiveTopic(savedTopic);
    }
  }, []);

  const handleSetActiveTopic = (topic) => {
    setActiveTopic(topic);
    localStorage.setItem("activeTopic", topic);
  };

  return (
    <div className="h-screen">
      <div className="fixed w-[180px]">
        <SideNav setActiveTopic={handleSetActiveTopic} />
      </div>
      <div className="flex flex-col h-screen">
        <div className="fixed mb-10 w-calc ml-[180px]">
          <TopBar topic={activeTopic} />
        </div>
        <div className="overflow-auto mt-20 px-3 w-calc ml-[180px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;