import { useState } from "react";
import ClientForm from "@/components/client-form";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center min-h-screen py-8 px-4">
        <ClientForm />
      </div>
    </div>
  );
};

export default HomePage;
