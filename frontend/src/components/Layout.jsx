import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="py-8 px-14 m-auto">
      <header>
        <p className="text-body-lg font-bold text-primary">Gitfolio</p>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
