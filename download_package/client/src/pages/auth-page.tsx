import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { user, loginMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Redirect to admin page if already logged in
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);
  
  const onSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-2/5 bg-[#33820d] p-12 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">Sicredi Admin</h1>
          <p className="mb-6 text-gray-100">
            Bem-vindo à área administrativa do Sistema Sicredi. Acesse o painel para visualizar e gerenciar os dados coletados.
          </p>
          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-gray-100">
              © Banco Cooperativo Sicredi S.A. Todos os direitos reservados
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-3/5 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-[#33820d]">
                Área Administrativa
              </CardTitle>
              <CardDescription>
                Faça login para acessar o painel de controle
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register" disabled>Registrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Usuário</Label>
                        <Input
                          id="username"
                          placeholder="admin"
                          {...loginForm.register("username", { required: true })}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          {...loginForm.register("password", { required: true })}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-[#33820d] hover:bg-[#276c0f]"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                          </>
                        ) : (
                          "Entrar"
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="border-t pt-4 text-center justify-center">
              <p className="text-sm text-gray-500">
                Utilize as credenciais padrão: admin / admin123
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
