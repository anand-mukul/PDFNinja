import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="dark:bg-black/95 p-0 m-0">
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default layout;
