import React, { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface Props {
  children?: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
export default Layout;
