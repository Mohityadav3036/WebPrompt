// import React from "react";
// import left from "../../assets/images/left.png";
// import arrow from "../../assets/images/arrow.png";
// import "./Home.css";

// const Home = () => {
//   return (
//     <div
//       className=" lg:w-full relative p-2 mt-5 text-left flex items-center 
//     justify-center flex-col  w-screen "
//     >
//       {/* TRY IT TEXT */}
//       <toptext className="flex py-2 mt-5 items-center text-xl md:text-5xl ">
//         <img src={left} className="w-15" alt="" />
//         <p className="font-[font19] ">Crafted with Curiosity and Code</p>
//         <img src={left} className="w-15 rotate-y-180 " alt="" />
//       </toptext>

//       {/* TAG LINE TEXT */}
//       <p className=" font-[font10] font-extrabold w-full lg:text-9xl md:text-7xl text-3xl pt-10 ">
//         <p className="font-[font10]">
//           E
//           <span className="lg:text-7xl md:text-5xl uppercase">ffortlessly</span>{" "}
//           D<span className="lg:text-7xl md:text-5xl uppercase">esign</span>
//         </p>{" "}
//         W<span className="lg:text-7xl md:text-5xl uppercase">ith</span>{" "}
//         <span
//           className="text-violet-500 leading-2.5 mt-4 
//          uppercase font-[font10]"
//         >
//           <span className="bgAlter">
//             W<span className="lg:text-7xl md:text-5xl uppercase">ebly</span>
//           </span>
//         </span>{" "}
//         <br />S
//         <span className="lg:text-7xl md:text-5xl uppercase">tunning</span> W
//         <span className="lg:text-7xl md:text-5xl uppercase ">ebsites</span>.
//       </p>

//       {/* ARROW */}
//       <p
//         className=" flex justify-center items-center
//        rounded-full mt-10 md:p-1 bg-gradient-to-tl from-[#e33cefe9] 
//       to-[#4cafffe9]"
//       >
//         <img src={arrow} className="md:w-16 w-10 animate-bounce" alt="" />
//       </p>
//     </div>
//   );
// };

// export default Home;


import React from "react";
import left from "../../assets/images/left.png";
import arrow from "../../assets/images/arrow.png";
import "./Home.css";

const Home = () => {
  return (
    <div className="w-full  flex flex-col items-center justify-center bg-black text-white p-6">
   

      {/* Tagline */}
      <div className="text-center mt-16 ">
        <span className="bg-purple-500 px-4 py-2  rounded-full text-sm font-semibold">AI-Powered Website Builder</span>
        <h1 className="text-5xl md:text-7xl font-bold mt-10">
          Transform Your <span className="text-purple-400 ">Digital Presence</span> <br /><h1 className=" mt-6">With <span className="text-purple-400 "> AI-Generated </span> Websites</h1> 

        </h1>
        <p className="text-gray-400 mt-10 max-w-3xl mx-auto text-xl">
        Just describe the website you want, and our AI will build it instantly. Complete with design, code, and functionality — no technical skills required.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col items-center mt-[100px] space-y-4">
  <button className="bg-purple-500 px-10 py-3 text-lg rounded-lg mb-[100px]">Get Started →</button>
  
</div>

    </div>
  );
};

export default Home;
