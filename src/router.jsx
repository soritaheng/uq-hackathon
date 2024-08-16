import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";

//create routes for app
const router = createBrowserRouter([
<<<<<<< Updated upstream:src/router.jsx
    {
        path: "/",
        element: <Home />,
    },
=======
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/step2",
    element: <Step2 username="iqrapal" />,
  },
>>>>>>> Stashed changes:frontend/src/router.jsx
]);

export default router;
