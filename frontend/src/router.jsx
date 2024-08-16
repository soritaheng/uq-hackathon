import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Step2 from "./views/Step2";

//create routes for app
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/step2",
    element: <Step2 username="iqrapal" />,
  },
]);

export default router;
