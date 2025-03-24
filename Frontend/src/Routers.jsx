import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

const Routers = () => {
  return (
    <div className="absolute ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Routers;
