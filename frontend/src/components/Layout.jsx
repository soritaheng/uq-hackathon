import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="py-8 px-14 m-auto">
      <header>
        <Link href="/" className="text-body-lg font-bold text-primary">
          Gitfolio
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
