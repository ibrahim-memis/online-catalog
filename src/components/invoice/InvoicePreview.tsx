import { useState } from 'react';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { downloadInvoice, previewInvoice } from '@/lib/invoice';
import { FileText, Download, Eye } from 'lucide-react';

interface InvoicePreviewProps {
  order: Order;
}

export function InvoicePreview({ order }: InvoicePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold">Fatura</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => previewInvoice(order)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Önizle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadInvoice(order)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            İndir
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-card">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Fatura No</p>
            <p>INV-{order.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tarih</p>
            <p>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Toplam Tutar</p>
            <p className="text-emerald-400 font-semibold">
              {order.totalAmount.toLocaleString('tr-TR')} ₺
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Durum</p>
            <p className="capitalize">{order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}