import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.jsx";
import React, { createContext } from "react";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#f1f8f3",
      100: "#ddeee1",
      200: "#bcdec6",
      300: "#90c5a4",
      400: "#61a67e",
      500: "#3f8a60",
      600: "#2e6e4c",
      700: "#25573e",
      800: "#1f4632",
      900: "#1a3a2a",
      950: "#0e2018",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
