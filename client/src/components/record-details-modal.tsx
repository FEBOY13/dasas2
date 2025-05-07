import { useSubmissions } from "@/hooks/use-submissions";
import { Submission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDateTime, maskPassword } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { X, Trash2, Loader2 } from "lucide-react";

interface RecordDetailsModalProps {
  submission: Submission;
  onClose: () => void;
}

const RecordDetailsModal = ({ submission, onClose }: RecordDetailsModalProps) => {
  const { deleteSubmissionMutation } = useSubmissions();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  const handleDelete = async () => {
    deleteSubmissionMutation.mutate(submission.id, {
      onSuccess: () => {
        setShowDeleteAlert(false);
        onClose();
      }
    });
  };
  
  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Detalhes do Registro</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Informações completas do registro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Informações Pessoais</h4>
              <div className="mt-2 bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">CPF:</span>
                    <p className="text-sm font-medium">{submission.cpf}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Telefone:</span>
                    <p className="text-sm font-medium">{submission.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Informações Bancárias</h4>
              <div className="mt-2 bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">Cooperativa:</span>
                    <p className="text-sm font-medium">{submission.cooperative}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Conta:</span>
                    <p className="text-sm font-medium">{submission.account}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Senha (hash):</span>
                    <p className="text-sm font-medium font-mono bg-gray-100 p-1 rounded">
                      {maskPassword(submission.password)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Metadados</h4>
              <div className="mt-2 bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">Data de Registro:</span>
                    <p className="text-sm font-medium">{formatDateTime(submission.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">IP:</span>
                    <p className="text-sm font-medium">{submission.ip || 'Não disponível'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Dispositivo:</span>
                    <p className="text-sm font-medium">{submission.userAgent || 'Não disponível'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Fechar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation alert dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
              disabled={deleteSubmissionMutation.isPending}
            >
              {deleteSubmissionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecordDetailsModal;
