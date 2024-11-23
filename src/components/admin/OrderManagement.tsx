import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye } from 'lucide-react';

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

export function OrderManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: 'Başarılı',
        description: 'Sipariş durumu güncellendi.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Sipariş durumu güncellenirken bir hata oluştu.',
      });
    }
  };

  const filteredOrders = orders.filter(order =>
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Sipariş ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[100px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{order.user.name}</div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{order.user.company || '-'}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString('tr-TR')} ₺</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value: Order['status']) => 
                      handleStatusChange(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <Badge className={statusColors[value as Order['status']]}>
                            {label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sipariş Detayı</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold mb-3">Müşteri Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Ad Soyad:</div>
                      <div>{selectedOrder.user.name}</div>
                      <div className="text-gray-500">E-posta:</div>
                      <div>{selectedOrder.user.email}</div>
                      <div className="text-gray-500">Firma:</div>
                      <div>{selectedOrder.user.company || '-'}</div>
                      <div className="text-gray-500">Telefon:</div>
                      <div>{selectedOrder.user.phone || '-'}</div>
                      {selectedOrder.user.discount && (
                        <>
                          <div className="text-gray-500">İskonto:</div>
                          <div>%{selectedOrder.user.discount}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold mb-3">Sipariş Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Sipariş Tarihi:</div>
                      <div>{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</div>
                      <div className="text-gray-500">Durum:</div>
                      <div>
                        <Badge className={statusColors[selectedOrder.status]}>
                          {statusLabels[selectedOrder.status]}
                        </Badge>
                      </div>
                      <div className="text-gray-500">Toplam Tutar:</div>
                      <div className="font-semibold text-emerald-400">
                        {selectedOrder.totalAmount.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Ürünler</h3>
                  <ScrollArea className="h-[300px] border rounded-lg p-4">
                    {selectedOrder.products.map((product) => (
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
                              {selectedOrder.quantities[product.id]} adet x{' '}
                              {product.price.toLocaleString('tr-TR')} ₺
                            </p>
                            <p className="text-emerald-400">
                              Toplam: {(product.price * selectedOrder.quantities[product.id]).toLocaleString('tr-TR')} ₺
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>

                  {selectedOrder.notes && (
                    <div className="p-4 border rounded-lg space-y-2">
                      <h3 className="font-semibold">Notlar</h3>
                      <p className="text-sm whitespace-pre-wrap">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}