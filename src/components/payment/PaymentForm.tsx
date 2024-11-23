import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Calendar, Shield } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Ödeme Başarılı",
        description: "Ödemeniz başarıyla alındı.",
      });

      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ödeme Başarısız",
        description: "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
        <p className="text-sm text-emerald-300">Ödenecek Tutar</p>
        <p className="text-2xl font-bold text-emerald-400">
          {amount.toLocaleString('tr-TR')} ₺
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>Kart Üzerindeki İsim</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <Input
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              className="pl-10"
              placeholder="JOHN DOE"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Kart Numarası</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <Input
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="pl-10"
              placeholder="4242 4242 4242 4242"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Son Kullanma Tarihi</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                className="pl-10"
                placeholder="MM/YY"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>CVV</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                required
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
                className="pl-10"
                placeholder="***"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button 
          type="submit" 
          disabled={isProcessing}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          {isProcessing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
        </Button>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Lock className="h-4 w-4" />
          <p>256-bit SSL ile güvenli ödeme</p>
        </div>
      </div>
    </form>
  );
}