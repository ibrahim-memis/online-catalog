import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { createPayTRToken } from '@/lib/paytr';
import { useToast } from '@/hooks/use-toast';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

export function PaymentDialog({
  isOpen,
  onClose,
  amount,
  orderId,
  onSuccess
}: PaymentDialogProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    if (isOpen && user) {
      setIsLoading(true);
      setError(null);
      
      createPayTRToken({
        amount,
        user,
        orderId
      })
        .then(token => {
          if (mounted) {
            setIframeUrl(`https://www.paytr.com/odeme/guvenli/${token}`);
            setError(null);
          }
        })
        .catch(err => {
          if (mounted) {
            setError(err.message);
            toast({
              variant: "destructive",
              title: "Ödeme Hatası",
              description: err.message
            });
          }
        })
        .finally(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, user, amount, orderId]);

  // PayTR iframe'den gelen mesajları dinle
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.paytr.com") {
        if (event.data.status === "success") {
          onSuccess();
          onClose();
          toast({
            title: "Ödeme Başarılı",
            description: "Ödemeniz başarıyla alındı."
          });
        } else if (event.data.status === "failed") {
          toast({
            variant: "destructive",
            title: "Ödeme Başarısız",
            description: event.data.reason || "Ödeme işlemi başarısız oldu."
          });
          onClose();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-emerald-400">
            <Lock className="h-5 w-5" />
            PayTR Güvenli Ödeme
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : error ? (
          <div className="h-[500px] flex flex-col items-center justify-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-center text-red-500 mb-4">{error}</p>
            <Button onClick={onClose} variant="outline">
              Kapat
            </Button>
          </div>
        ) : iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-[500px] border-0"
            frameBorder="0"
            scrolling="no"
            title="PayTR Payment"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}