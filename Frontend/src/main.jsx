import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import UserPromptPage from "./Components/UserPromptPage/UserPromptPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Routers from "./Routers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Routers />,
    children: [
      {
        path: "/",
        element: [<Home />, <UserPromptPage />],
      },
      {
        path: "/websitegenerator",
        element: <App />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
{
  /* <div
className="absolute top-0 flex flex-col min-h-screen
items-center w-screen
md:px-10 px-0"
>


{/* <Footer /> */
}
// </div> */}
