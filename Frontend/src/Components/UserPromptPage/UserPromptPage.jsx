import React, { useState, useContext } from "react";
import "./UserPromptPage.css";
import check from "../../assets/images/check.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useEffect } from "react";

const UserPromptPage = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const navigate = useNavigate();
  const id = nanoid(10);
  const [toggle, setToggle] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [message, setMessage] = useState("");
  
  // const BASE_URL = process.env.REACT_APP_BASE_URL;
  const BASE_URL = import.meta.env.REACT_APP_BASE_URL;

  // Setting Up user ID
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      localStorage.setItem("userId", id);
    }
  }, []);

  // handelling the button event
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please hold on while we generate your code.");
    setToggle(!toggle);
    try {
      const data = await axios.post(
        "https://webprompt-1.onrender.com/api/get-user-prompt",
        {
          userPrompt,
          userId: localStorage.getItem("userId"),
        }
      );

      // console.log(JSON.parse(data.data.code.code));
      // console.log(data.data.code.dependencies);

      setUsersData(data.data.code);
      navigate("/websitegenerator");
    } catch (error) {
      setMessage("Server is busy. Please try again.");
      console.log("Error in handleSubmit while submitting the users Prompt ");
    }
  };

  useEffect(() => {
    const localData = localStorage.getItem("code");
    const localDependencies = localStorage.getItem("dependencies");

    if ((localData || localDependencies) && usersData) {
      localStorage.removeItem("code");
      localStorage.removeItem("dependencies");
      localStorage.setItem("code", usersData.code);
      localStorage.setItem("dependencies", usersData.dependencies);
    } else if (!localData && !localDependencies && usersData) {
      localStorage.setItem("code", usersData.code);
      localStorage.setItem("dependencies", usersData.dependencies);
    } else if (localData && localDependencies && !usersData) {
      setUsersData({
        code: localData,
        dependencies: localDependencies,
      });
    }
  }, [usersData]);

  return (
    <>
      <div
        className=" md:mt-15 lg:w-full flex lg:flex-row flex-col-reverse gap-10 md:justify-between relative w-screen 
     "
      >
        {toggle ? (
          <div className="absolute  flex justify-center items-center h-full w-full bg-black/60 z-50 flex-col gap-15">
            <div className="flipping1 sticky bottom-28 "></div>
            <p className="font-[font9] font-bold text-2xl bg-black/50 ">
              {message}
            </p>
          </div>
        ) : (
          <></>
        )}

        <section className=" lg:w-[40%] flex flex-col lg:gap-56  items-center lg:py-10 md:px-10 gap-28 min-w-[300px] ">
          {/* div 1 */}
          <div className="flex flex-col gap-6 px-4 lg:mt-56 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
  <h1 className="text-4xl font-bold text-yellow-300">What We Do</h1>
  
  <p className="text-lg font-medium">
    We create fully functional websites from your prompts.  
    Just describe your vision, and our system will instantly generate a ready-to-use web app—no coding needed, just prompt and launch!
  </p>
</div>


<div className="flex flex-col gap-6 px-6 py-8 md:mt-16 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-xl">
  <h1 className="text-4xl font-bold text-yellow-300">Web App Generation</h1>

  <p className="text-lg font-medium">
    Your website journey starts with a simple prompt and transforms into a fully functional web app. We take your idea and instantly generate code, making web development effortless and accessible.
  </p>

  <ul className="space-y-3">
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Instant Web App Creation</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">AI-Powered Code Generation</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Optimized for React Vite</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Fast and Lightweight Output</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Ready-to-Run Projects</span>
    </li>
  </ul>
</div>



<div className="flex flex-col gap-6 px-6 py-8 md:mt-16 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-xl">
  <h1 className="text-4xl font-bold text-yellow-300">How It Works</h1>

  <p className="text-lg font-medium">
    Transforming your ideas into functional websites has never been easier. Just enter a prompt, and we handle the rest!
  </p>

  <ul className="space-y-3">
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Enter Your Prompt – Describe the website you want.</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Generate Instantly – Our system creates a functional web app.</span>
    </li>
    <li className="flex items-center gap-3">
      <img src={check} className="w-5 h-5" alt="" /> 
      <span className="text-lg font-semibold">Run and Test – Get your project up and running in seconds.</span>
    </li>
  </ul>
</div>

        </section>

        <section
          className="md:top-10 lg:sticky lg:w-[60%]  md:h-[45%] rounded-2xl
       flex flex-col md:gap-4 justify-center items-center py-10  w-screen 
       "
        >
          <p className="font-[font13] md:text-4xl">What do you want to Build</p>

          <form
            onSubmit={HandleSubmit}
            className=" min-w-[300px] max-w-[70%] h-fit flex items-center colorfullborder
           p-5 rounded-2xl bg-gradient-to-r from-[#67186d7a] to-[#0d4878aa] "
          >
            <textarea
              name=""
              id=""
              cols="30"
              rows="3"
              placeholder="Enter your prompt here"
              required={true}
              onChange={(e) => {
                setUserPrompt(e.target.value);
              }}
              className=" rounded-xl outline-none p-4 h-full resize-none w-screen md:w-full "
            ></textarea>
            {toggle ? (
              <div class="flipping"></div>
            ) : (
              <button
                className={` h-fit p-2 rounded-md bg-gradient-to-tl from-[#000] 
            to-[#4cafffe9]  hover:to-[#e33cefe9] transition duration-300 ease-out ${
              toggle ? "cursor-not-allowed" : "cursor-pointer"
            } `}
              >
                submit
              </button>
            )}
          </form>
          <p>Prompt and run web apps instantly.</p>
        </section>
      </div>
    </>
  );
};

export default UserPromptPage;
