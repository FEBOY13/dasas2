import { useQuery, useMutation } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useSubmissions() {
  const { toast } = useToast();
  
  const {
    data: submissions = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const getSubmission = (id: number) => {
    return useQuery<Submission>({
      queryKey: ["/api/submissions", id],
    });
  };

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/submissions/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch submissions list
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "Registro excluído",
        description: "O registro foi excluído com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    submissions,
    isLoading,
    error,
    refetch,
    getSubmission,
    deleteSubmissionMutation,
  };
}
