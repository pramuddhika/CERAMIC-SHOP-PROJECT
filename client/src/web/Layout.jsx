import React from "react";
import About_us from "./About_us";
import Contact_us from "./Contact_us";
import LandingPart from "./LandingPart";
import Navbarcomponent from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WebLayout = () => {
  return (
    <div>
      <Navbarcomponent />
      <LandingPart />
      <About_us />
      <ToastContainer />
      <Contact_us />
    </div>
  );
};

export default WebLayout;
