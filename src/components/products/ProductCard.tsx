import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
}

export function ProductCard({ 
  product,
  onViewDetails,
  isSelected,
  onToggleSelect,
  quantity,
  onUpdateQuantity
}: ProductCardProps) {
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

  const displayPrice = calculateDiscountedPrice(product.price);

  return (
    <Card className="overflow-hidden group hover:border-emerald-500 transition-all duration-300 bg-[#1a1a1a] border-[#2a2a2a]">
      <div className="relative">
        <AspectRatio ratio={4/3} className="bg-[#2a2a2a]">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </AspectRatio>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-black/50 hover:bg-black/70 ${
            isSelected ? 'text-emerald-400' : 'text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
        >
          {isSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
          <h3 className="font-semibold truncate text-sm md:text-base text-emerald-400">
            {product.name}
          </h3>
          <Badge variant="outline" className="shrink-0 text-xs md:text-sm bg-emerald-500/10 text-emerald-400 border-emerald-500">
            {product.code}
          </Badge>
        </div>

        {isSelected && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400">Min. 10 Adet:</span>
            <Input
              type="number"
              min={10}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value < 10) {
                  toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Minimum sipariş adedi 10'dur."
                  });
                  return;
                }
                onUpdateQuantity(value);
              }}
              className="w-24 text-sm bg-[#2a2a2a] border-[#3a3a3a]"
              placeholder="Adet"
            />
          </div>
        )}

        <p className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
          {displayPrice.toLocaleString('tr-TR')} ₺
          {user?.discount && (
            <span className="ml-2 text-sm text-emerald-400">
              %{user.discount} indirimli
            </span>
          )}
        </p>

        <Button 
          variant="outline" 
          className="w-full hover:bg-emerald-500 hover:text-white border-emerald-500 text-emerald-400 text-sm"
          onClick={() => onViewDetails(product)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Detayları Gör
        </Button>
      </div>
    </Card>
  );
}