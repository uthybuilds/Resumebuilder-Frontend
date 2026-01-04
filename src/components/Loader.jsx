import React from "react";
import Logo from "../assets/logo.svg";

const Loader = ({ className = "h-screen" }) => {
  return (
    <div className={`flex justify-center items-center ${className} w-full`}>
      <img src={Logo} alt="Loading..." className="h-16 animate-bounce" />
    </div>
  );
};

export default Loader;
