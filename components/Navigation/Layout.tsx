import React, { ReactNode } from "react";
import Navigation from "./Navigation";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

function Layout({ children }: Props) {
  return (
    <>
      {/* Navbar would go here */}
      <Navigation />
      {children}
    </>
  );
}
export default Layout;