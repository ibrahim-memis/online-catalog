import { useState } from 'react';
import { Product, Category } from '@/types';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, FileSpreadsheet, FileText, File } from 'lucide-react';
import { exportToExcel, exportToPDF, exportToWord } from '@/lib/export';
import { ProductDetail } from './ProductDetail';

interface ProductListProps {
  products: Product[];
  selectedCategory: Category | null;
  selectedProducts: Product[];
  onToggleProduct: (product: Product) => void;
  quantities: { [key: string]: number };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isNavbarOpen: boolean;
}

const sortOptions = [
  { value: 'name-asc', label: 'İsim (A-Z)' },
  { value: 'name-desc', label: 'İsim (Z-A)' },
  { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'code', label: 'Ürün Kodu' },
];

export function ProductList({
  products,
  selectedCategory,
  selectedProducts,
  onToggleProduct,
  quantities,
  onUpdateQuantity,
  isNavbarOpen,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleExport = async (type: 'excel' | 'pdf' | 'word') => {
    const exportData = products.map(product => ({
      'Ürün Adı': product.name,
      'Ürün Kodu': product.code,
      'Fiyat': `$${product.price}`,
      'Kategori': selectedCategory?.name || 'Tümü'
    }));

    const filename = `urunler-${new Date().toISOString().split('T')[0]}`;

    switch (type) {
      case 'excel':
        await exportToExcel(exportData, filename);
        break;
      case 'pdf':
        await exportToPDF(exportData, filename);
        break;
      case 'word':
        await exportToWord(exportData, filename);
        break;
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'code':
          return a.code.localeCompare(b.code);
        default:
          return 0;
      }
    });

  const contentClass = isNavbarOpen ? 'with-navbar' : '';

  return (
    <div className={`flex-1 p-4 md:p-6 bg-[#121212] transition-all duration-300 ${contentClass}`}>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-[#1a1a1a] border-[#2a2a2a] focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#1a1a1a] border-[#2a2a2a]">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleExport('excel')}
                className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-emerald-500/10 hover:text-emerald-400"
                title="Excel'e Aktar"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleExport('word')}
                className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-emerald-500/10 hover:text-emerald-400"
                title="Word'e Aktar"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleExport('pdf')}
                className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-emerald-500/10 hover:text-emerald-400"
                title="PDF'e Aktar"
              >
                <File className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <AnimatePresence>
          <motion.div 
            className="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                onToggleSelect={() => onToggleProduct(product)}
                quantity={quantities[product.id] || 10}
                onUpdateQuantity={(quantity) => onUpdateQuantity(product.id, quantity)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-5xl w-[95vw]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <ProductDetail
              product={selectedProduct}
              isSelected={selectedProducts.some(p => p.id === selectedProduct.id)}
              onToggleSelect={() => onToggleProduct(selectedProduct)}
              quantity={quantities[selectedProduct.id] || 10}
              onUpdateQuantity={(quantity) => onUpdateQuantity(selectedProduct.id, quantity)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}