import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import AdminDashboard from "@/components/admin-dashboard";
import RecordDetailsModal from "@/components/record-details-modal";
import { Submission } from "@shared/schema";
import { Loader2 } from "lucide-react";

const AdminPage = () => {
  const { user, isLoading } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsModalOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#33820d]" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard 
        username={user?.username || "Admin"} 
        onViewDetails={handleOpenDetails}
      />
      
      {isModalOpen && selectedSubmission && (
        <RecordDetailsModal
          submission={selectedSubmission}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default AdminPage;
