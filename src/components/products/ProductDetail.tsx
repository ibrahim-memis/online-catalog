import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProductDetailProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
}

export function ProductDetail({
  product,
  isSelected,
  onToggleSelect,
  quantity,
  onUpdateQuantity,
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { user } = useAuth();

  const images = product.images || [product.image];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // İskontolu fiyat hesaplama
  const calculateDiscountedPrice = (price: number) => {
    if (user?.discount) {
      const discountAmount = price * (user.discount / 100);
      return price - discountAmount;
    }
    return price;
  };

  const displayPrice = calculateDiscountedPrice(product.price);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="relative group">
          <img
            src={images[selectedImageIndex]}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg cursor-pointer"
            onClick={() => setIsImageDialogOpen(true)}
          />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} - ${index + 1}`}
              className={`aspect-square object-cover rounded-md cursor-pointer border-2 ${
                selectedImageIndex === index
                  ? 'border-emerald-500'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500">
              {product.code}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`${
                isSelected ? 'text-emerald-400' : 'text-white'
              }`}
              onClick={onToggleSelect}
            >
              {isSelected ? (
                <Check className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>
          </div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="mt-2">
            <p className="text-3xl font-bold text-emerald-400">
              {displayPrice.toLocaleString('tr-TR')} ₺
            </p>
            {user?.discount && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
                  %{user.discount} İndirim
                </Badge>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key}>
                <h3 className="font-medium capitalize mb-1">{key}</h3>
                <p className="text-sm text-gray-400">{value}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>{`${product.name} - Image ${selectedImageIndex + 1} of ${images.length}`}</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>

          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              style={{ margin: 'auto' }}
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <VisuallyHidden>Previous image</VisuallyHidden>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                  <VisuallyHidden>Next image</VisuallyHidden>
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}