import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Step1 from "./views/Step1";
import Step2 from "./views/Step2";
import Step3 from "./views/Step3";

//create routes for app
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/step1" />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/step1",
        element: <Step1 />,
      },
      {
        path: "/step2",
        element: <Step2 username="Hyunsoo6257" />,
      },
      {
        path: "/step3",
        element: <Step3 />,
      },
    ],
  },
]);

export default router;
