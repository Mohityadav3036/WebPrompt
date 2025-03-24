// import React from "react";
// import {
//   FaSquareInstagram,
//   FaXTwitter,
//   FaLinkedin,
//   FaSquareGithub,
// } from "react-icons/fa6";
// import "../Home/Home.css";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div className="mt-10 md:w-full w-screen relative bottom-0 border-t px-4 p-10">
//       {/* Webite Name */}
//       <p className="font-[font10] font-bold md:text-4xl text-2 bgAlter text-right ">
//         Webly
//       </p>

//       {/* Creator Name */}
//       <p className="mt-5 ">
//         {" "}
//         <span className="font-[font10] font-bold text-xl">
//           Created by -{" "}
//         </span>{" "}
//         <span className="font-[font9] font-bold text-2xl bgAlter">
//           Mohit Yadav
//         </span>
//       </p>

//       {/* Connect */}
//       <p className=" flex gap-4 md:flex-nowrap flex-wrap justify-evenly items-center font-[font9] mt-5 md:text-xl font-bold ">
//         <Link
//           to="https://www.linkedin.com/in/mohit-yadav-33811024a/"
//           className="flex gap-2 justify-center items-center bgAlter "
//         >
//           <FaLinkedin className="md:text-2xl " />
//           Linkedin
//         </Link>
//         <Link
//           to="https://www.linkedin.com/in/mohit-yadav-33811024a/"
//           className="flex gap-2 justify-center items-center bgAlter"
//         >
//           <FaSquareGithub className="md:text-2xl" />
//           Github
//         </Link>
//         <Link
//           to="w"
//           className="flex gap-2 justify-center items-center bgAlter"
//         >
//           <FaXTwitter className="md:text-2xl" />
//           X.com
//         </Link>
//         <Link
//           to="https://www.instagram.com/mohit3379yadav/"
//           className="flex gap-2 justify-center items-center bgAlter"
//         >
//           {" "}
//           <FaSquareInstagram className="md:text-2xl" /> Instagram
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Footer;
import React from 'react'
import { useState } from 'react';
import logo from '../../assets/ailogo.png'
import { BsTwitter } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";
import { BsDiscord } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";

import { Link } from "react-router-dom";
import {styles} from '../../styles'
const Footer = () =>  {
  const [active, setActive] = useState("");
  return (
   
    <div className=' bg-black pt-[40px]'>
          <div className="text-[20px]   md:text-[35px] flex justify-center gap-5  items-center md:mt-10 mt-5 md:gap-12 ">
              <Link
                target="_blank"
                to="www.twitter.com"
              > 

                <BsTwitter className=" mb-10 mr-2 hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100 -md:mr-0 -md:my-[1px]" />
              </Link>

              <Link target="_blank" to="https://github.com/Mohityadav3036">
                <BsGithub className=" mb-10 mx-2 hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100 -md:mx-0 -md:my-[1px]" />
              </Link>
              
              <Link target="_blank" to="https://www.linkedin.com/in/mohit-yadav-33811024a/">
                <BsLinkedin className=" mb-10 ml-2 hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100 -md:ml-0 -md:my-[1px]  " />
              </Link>
              <Link target="_blank" to="https://discord.com/channels/@me">
                <BsDiscord className=" mb-10 mx-4 hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100 -md:mx-0 -md:my-[1px]" />
              </Link>

              <Link
                target="_blank"
                to="https://www.instagram.com/mohit3379yadav/"
              >
                <BsInstagram className=" mb-10 mx-2 hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100 -md:mx-0 -md:my-[1px]" />
              </Link>
            </div>
            <Link
          to="/"
        className={`${styles.heroSubText} flex justify-center items-center`}
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
            <div className={`${styles.heroSubText} flex justify-center items-center`}>
            <img src={logo} alt="logo" className='w-[80px] mb-10 flex justify-center items-center' />
            <div className='mt-7 ml-4'>
                <h1 className='-mt-8 mb-10 flex justify-center items-center'> Mohit Yadav ❤️ &copy; 2025 </h1>
            </div>
            </div>
            </Link>
            
    </div>
  )
}

export default Footer
