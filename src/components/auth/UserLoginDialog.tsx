import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Info, Loader2 } from 'lucide-react';

interface UserLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserLoginDialog({ isOpen, onClose }: UserLoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: setUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      setUser(user);
      toast({
        title: 'Hoş Geldiniz!',
        description: `${user.name} olarak giriş yapıldı`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Geçersiz e-posta veya şifre',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Kullanıcı Girişi</DialogTitle>
        </DialogHeader>

        <Alert className="bg-emerald-500/10 text-emerald-400 border-emerald-500">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Test hesabı bilgileri:<br />
            E-posta: user@example.com<br />
            Şifre: password
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}