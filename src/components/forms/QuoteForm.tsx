import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';

interface QuoteFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
}

const initialFormData: QuoteFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  quantity: 1,
  message: '',
};

export function QuoteForm({ product, isOpen, onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1500));

      // E-posta gönderme simülasyonu
      console.log('Teklif talebi:', {
        product,
        ...formData,
      });

      toast({
        title: 'Teklif Talebiniz Alındı',
        description: 'En kısa sürede size dönüş yapacağız.',
      });

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Teklif talebi gönderilirken bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Toptan Teklif Talebi</DialogTitle>
          <DialogDescription>
            {product.name} ürünü için toptan teklif almak üzere formu doldurun.
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Adınız ve soyadınız"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Firma Adı</Label>
              <Input
                id="company"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Firma adınız"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="E-posta adresiniz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefon numaranız"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Talep Edilen Miktar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              placeholder="Adet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Ek Notlar</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Varsa eklemek istediğiniz notları yazabilirsiniz"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Teklif İste
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}