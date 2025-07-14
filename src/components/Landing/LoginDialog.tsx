
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loginForm: {
    email: string;
    password: string;
  };
  setLoginForm: (form: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginDialog = ({ 
  isOpen, 
  onOpenChange, 
  loginForm, 
  setLoginForm, 
  onSubmit 
}: LoginDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Entrar na sua conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Sua senha"
              required
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-800">Esqueci minha senha</a>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
