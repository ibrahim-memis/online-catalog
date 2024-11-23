import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';
import { Product } from '@/types';

export function BulkActions() {
  const [isImporting, setIsImporting] = useState(false);
  const { products, addProduct } = useProducts();
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = products.map(product => ({
      ...product,
      details: JSON.stringify(product.details)
    }));

    const csv = [
      ['ID', 'Ürün Adı', 'Kod', 'Fiyat', 'Resim URL', 'Kategori ID', 'Detaylar'],
      ...exportData.map(product => [
        product.id,
        product.name,
        product.code,
        product.price,
        product.image,
        product.categoryId,
        product.details
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `urunler-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Dışa Aktarma Başarılı',
      description: 'Ürünler CSV dosyasına aktarıldı'
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.replace(/^"|"$/g, ''))
        );
        
        const products = rows.slice(1).map(row => ({
          id: row[0] || Math.random().toString(36).substr(2, 9),
          name: row[1],
          code: row[2],
          price: parseFloat(row[3]),
          image: row[4],
          categoryId: row[5],
          details: JSON.parse(row[6])
        }));

        for (const product of products) {
          await addProduct(product as Product);
        }

        toast({
          title: 'İçe Aktarma Başarılı',
          description: `${products.length} ürün içe aktarıldı`
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'İçe Aktarma Başarısız',
          description: 'Lütfen CSV dosya formatını kontrol edin'
        });
      } finally {
        setIsImporting(false);
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex-1 md:flex-none items-center gap-2 text-xs md:text-sm"
        size="sm"
      >
        <Download className="h-4 w-4" />
        <span className="hidden md:inline">Dışa Aktar</span>
      </Button>
      
      <div className="relative flex-1 md:flex-none">
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isImporting}
        />
        <Button
          variant="outline"
          disabled={isImporting}
          className="w-full md:w-auto items-center gap-2 text-xs md:text-sm"
          size="sm"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden md:inline">
            {isImporting ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
          </span>
        </Button>
      </div>
    </div>
  );
}