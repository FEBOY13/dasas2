import { useEffect, useState } from "react";
import ClientForm from "@/components/client-form";
import { useLocation } from "wouter";
import { Link } from "wouter";

const HomePage = () => {
  const [, navigate] = useLocation();
  const [showAdminLink, setShowAdminLink] = useState(false);
  
  // Show admin link after 3 seconds on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdminLink(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center min-h-screen py-8 px-4">
        <ClientForm />
      </div>
      
      {showAdminLink && (
        <div className="fixed bottom-4 right-4">
          <Link href="/auth" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Área Administrativa
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
