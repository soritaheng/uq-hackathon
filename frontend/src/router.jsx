import { createBrowserRouter } from "react-router-dom";
import Step1 from "./views/Step1";
import Step2 from "./views/Step2";

//create routes for app
const router = createBrowserRouter([
  {
    path: "/",
    element: <Step1 />,
  },
  {
    path: "/step2",
    element: <Step2 username="Hyunsoo6257" />,
  },
]);

export default router;
