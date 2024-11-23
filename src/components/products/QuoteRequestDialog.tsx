import { useState } from 'react';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { sendQuoteEmail } from '@/lib/email';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { PaymentDialog } from '@/components/payment/PaymentDialog';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Percent,
  Loader2,
  Send,
  UserCircle,
  CreditCard
} from 'lucide-react';

interface QuoteRequestDialogProps {
  products: Product[];
  quantities: { [key: string]: number };
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteRequestDialog({ 
  products, 
  quantities, 
  isOpen, 
  onClose 
}: QuoteRequestDialogProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { toast } = useToast();

  if (!user) return null;

  const calculateDiscountedPrice = (price: number) => {
    if (user.discount) {
      const discountAmount = price * (user.discount / 100);
      return price - discountAmount;
    }
    return price;
  };

  const totalPrice = products.reduce(
    (sum, product) => sum + calculateDiscountedPrice(product.price) * quantities[product.id],
    0
  );

  const handlePaymentSuccess = async () => {
    setIsSubmitting(true);

    try {
      // E-posta gönderimi
      await sendQuoteEmail({
        user,
        products,
        quantities,
        message
      });

      // Sipariş oluşturma
      await addOrder({
        id: '',
        user,
        products,
        quantities,
        totalAmount: totalPrice,
        status: 'pending',
        notes: message,
        createdAt: new Date().toISOString()
      });

      toast({
        title: 'Başarılı',
        description: 'Ödemeniz alındı ve teklif talebiniz oluşturuldu. En kısa sürede size dönüş yapacağız.',
      });

      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Teklif talebi oluşturulurken bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Teklif Talebi</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-400 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Müşteri Bilgileri
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                    <UserCircle className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300">Ad Soyad</p>
                      <p className="font-medium text-white">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300">Firma</p>
                      <p className="font-medium text-white">{user.company || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                    <Mail className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300">E-posta</p>
                      <p className="font-medium text-white">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                    <Phone className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300">Telefon</p>
                      <p className="font-medium text-white">{user.phone || '-'}</p>
                    </div>
                  </div>

                  {user.discount && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
                      <Percent className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-emerald-300">İskonto Oranı</p>
                        <p className="font-medium text-emerald-400">%{user.discount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Seçili Ürünler</h3>
              <ScrollArea className="h-[400px] border rounded-lg p-4">
                {products.map((product) => {
                  const discountedPrice = calculateDiscountedPrice(product.price);
                  const totalProductPrice = discountedPrice * quantities[product.id];

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary mb-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="text-sm space-y-1">
                          <p>
                            {quantities[product.id]} adet x{' '}
                            {discountedPrice.toLocaleString('tr-TR')} ₺
                          </p>
                          <p className="text-emerald-400">
                            Toplam: {totalProductPrice.toLocaleString('tr-TR')} ₺
                          </p>
                          {user.discount && (
                            <p className="text-xs text-gray-400">
                              <span className="line-through">
                                {(product.price * quantities[product.id]).toLocaleString('tr-TR')} ₺
                              </span>
                              <span className="ml-1 text-emerald-400">
                                (%{user.discount} İndirim)
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Toplam Tutar:</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-emerald-400">
                        {totalPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      {user.discount && (
                        <div className="text-xs text-emerald-400">
                          %{user.discount} İndirim Uygulandı
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Notlar</h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Eklemek istediğiniz notları yazabilirsiniz..."
              className="h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button 
              onClick={() => setIsPaymentDialogOpen(true)}
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ödeme Yap ve Teklif İste
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}