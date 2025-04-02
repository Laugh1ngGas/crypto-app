import { React, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";
import SignFormPage from "./pages/SignFormPage";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/form",
    element: <SignFormPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  // {
  //   path: "/*",
  //   element: <App />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

reportWebVitals();
