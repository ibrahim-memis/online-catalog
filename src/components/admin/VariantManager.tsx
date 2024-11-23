import { useState } from 'react';
import { ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const addVariant = () => {
    onChange([
      ...variants,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        price: 0,
        attributes: {},
      },
    ]);
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    onChange(newVariants);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Product Variants</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <Card key={variant.id} className="p-4 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeVariant(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Variant Name</Label>
                  <Input
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, { name: e.target.value })
                    }
                    placeholder="e.g., Size L, Color Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, { price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}