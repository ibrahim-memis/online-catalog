import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { QuoteRequestDialog } from '@/components/products/QuoteRequestDialog';
import { motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RightNavbarProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  isOpen: boolean;
  quantities: { [key: string]: number };
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function RightNavbar({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  onClose,
  isOpen,
  quantities,
  onUpdateQuantity,
}: RightNavbarProps) {
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // İskontolu fiyat hesaplama
  const calculateDiscountedPrice = (price: number) => {
    if (user?.discount) {
      const discountAmount = price * (user.discount / 100);
      return price - discountAmount;
    }
    return price;
  };

  const totalPrice = selectedProducts.reduce(
    (sum, product) => sum + calculateDiscountedPrice(product.price) * (quantities[product.id] || 0),
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-screen w-[min(100vw,320px)] border-l border-[#2a2a2a] bg-[#1a1a1a] shadow-xl z-50"
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold">Seçili Ürünler ({selectedProducts.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-400 hover:text-red-500"
              >
                Temizle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {selectedProducts.map((product) => {
              const discountedPrice = calculateDiscountedPrice(product.price);
              const totalProductPrice = discountedPrice * (quantities[product.id] || 0);

              return (
                <div
                  key={product.id}
                  className="flex flex-col p-3 rounded-lg bg-[#2a2a2a] mb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">Adet:</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={10}
                            value={quantities[product.id] || 10}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!Number.isFinite(value) || value < 10) {
                                toast({
                                  variant: "destructive",
                                  title: "Hata",
                                  description: "Minimum sipariş adedi 10'dur."
                                });
                                return;
                              }
                              onUpdateQuantity(product.id, value);
                            }}
                            className="w-20 text-sm bg-[#1a1a1a] border-[#3a3a3a]"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveProduct(product.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-emerald-400 text-sm">
                          {totalProductPrice.toLocaleString('tr-TR')} ₺
                        </p>
                        {user?.discount && (
                          <p className="text-xs text-gray-400">
                            <span className="line-through">
                              {(product.price * (quantities[product.id] || 0)).toLocaleString('tr-TR')} ₺
                            </span>
                            <span className="ml-1 text-emerald-400">
                              (%{user.discount} İndirim)
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>

          {selectedProducts.length > 0 && (
            <div className="p-4 border-t border-[#2a2a2a]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Toplam Tutar:</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-400">
                    {totalPrice.toLocaleString('tr-TR')} ₺
                  </span>
                  {user?.discount && (
                    <div className="text-xs text-emerald-400">
                      %{user.discount} İndirim Uygulandı
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => setIsQuoteDialogOpen(true)}
              >
                Teklif İste
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <QuoteRequestDialog
        products={selectedProducts}
        quantities={quantities}
        isOpen={isQuoteDialogOpen}
        onClose={() => setIsQuoteDialogOpen(false)}
      />
    </>
  );
}