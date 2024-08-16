import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";

//create routes for app
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

export default router;