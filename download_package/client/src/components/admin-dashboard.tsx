import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubmissions } from "@/hooks/use-submissions";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Loader2, Search, Eye, LogOut } from "lucide-react";

interface AdminDashboardProps {
  username: string;
  onViewDetails: (submission: Submission) => void;
}

const AdminDashboard = ({ username, onViewDetails }: AdminDashboardProps) => {
  const { logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { submissions, isLoading, error } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };
  
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchQuery || 
      submission.cpf.includes(searchQuery) || 
      submission.phone.includes(searchQuery) || 
      submission.cooperative.includes(searchQuery);
    
    if (!timeFilter) return matchesSearch;
    
    const submissionDate = new Date(submission.createdAt);
    const now = new Date();
    
    if (timeFilter === "today") {
      return matchesSearch && 
        submissionDate.getDate() === now.getDate() &&
        submissionDate.getMonth() === now.getMonth() &&
        submissionDate.getFullYear() === now.getFullYear();
    }
    
    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return matchesSearch && submissionDate >= weekAgo;
    }
    
    if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return matchesSearch && submissionDate >= monthAgo;
    }
    
    return matchesSearch;
  });
  
  if (error) {
    toast({
      title: "Erro ao carregar dados",
      description: "Houve um problema ao buscar os registros.",
      variant: "destructive"
    });
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#33820d] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-semibold text-xl">Sicredi Admin</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{username}</span>
              <Button 
                variant="outline" 
                className="bg-white text-[#33820d] hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Registros de Clientes</h2>
              <p className="mt-1 text-sm text-gray-600">
                Lista de todos os dados coletados através do formulário
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="p-6">
                {/* Search and filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex-1 sm:mr-4 mb-3 sm:mb-0">
                    <div className="relative">
                      <Input 
                        type="text"
                        placeholder="Buscar por CPF, telefone ou cooperativa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search className="h-4 w-4 text-gray-400" />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Todos os registros" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os registros</SelectItem>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Data table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperativa</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">Carregando registros...</p>
                          </td>
                        </tr>
                      ) : filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            Nenhum registro encontrado
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.cpf}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.cooperative}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(submission.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Button 
                                variant="ghost" 
                                className="text-[#33820d] hover:text-[#276c0f] hover:bg-[#edf7e7]"
                                onClick={() => onViewDetails(submission)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detalhes
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination - simplified version */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Mostrando <span className="font-medium">{filteredSubmissions.length}</span> resultado(s)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
