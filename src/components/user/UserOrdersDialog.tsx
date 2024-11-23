import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  approved: 'bg-emerald-500/10 text-emerald-500',
  rejected: 'bg-red-500/10 text-red-500',
  completed: 'bg-blue-500/10 text-blue-500',
};

const statusLabels = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  completed: 'Tamamlandı',
};

interface UserOrdersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserOrdersDialog({ isOpen, onClose }: UserOrdersDialogProps) {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) return null;

  const userOrders = getOrdersByUser(user.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Siparişlerim</DialogTitle>
        </DialogHeader>

        {userOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Henüz bir siparişiniz bulunmuyor.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg bg-[#1a1a1a] border-[#2a2a2a]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        Sipariş Tarihi: {new Date(order.createdAt).toLocaleString('tr-TR')}
                      </p>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detaylar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {order.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-4 rounded-lg bg-[#2a2a2a]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">
                            {order.quantities[product.id]} adet x{' '}
                            {product.price.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                        <p className="font-medium text-emerald-400">
                          {(product.price * order.quantities[product.id]).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex justify-between items-center">
                    <span className="text-gray-400">Toplam Tutar:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {order.totalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}