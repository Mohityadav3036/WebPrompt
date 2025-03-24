import left from "../../assets/images/left.png";
import React, { useRef } from "react";
import "../Home/Home.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const childRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div
      className="relative flex items-center justify-between
     md:w-full w-screen h-[75px] bg-black "
    >
      <leftside
        className="flex p-2 justify-center items-center cursor-pointer"
        onClick={handleClick}
      >
        <img src={left} className="w-10" alt="" />
        <p className="font-[font10] font-extrabold bgAlter ">WebPrompt</p>
        <img src={left} className="w-10 rotate-y-180 " alt="" />
      </leftside>

      {/* <rightside className="flex gap-10">
        <p className="border p-2 rounded-lg">Register</p>
        <p className=" p-2 mr-5 ">Login</p>
      </rightside> */}
    </div>
  );
};

export default Header;
