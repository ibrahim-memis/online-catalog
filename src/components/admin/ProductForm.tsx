import { useState } from 'react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (product: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      code: '',
      price: 0,
      images: [],
      categoryId: '',
      details: {
        dimensions: '',
        thread: '',
        canvas: '',
        content: '',
        stitchDetail: '',
        tensioning: '',
        usage: '',
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      toast({
        title: 'Success',
        description: `Product ${product ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save product',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Product Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Product Details</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={formData.details?.dimensions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, dimensions: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thread">Thread</Label>
            <Input
              id="thread"
              value={formData.details?.thread}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, thread: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="canvas">Canvas</Label>
            <Input
              id="canvas"
              value={formData.details?.canvas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, canvas: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stitchDetail">Stitch Detail</Label>
            <Input
              id="stitchDetail"
              value={formData.details?.stitchDetail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, stitchDetail: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tensioning">Tensioning</Label>
            <Input
              id="tensioning"
              value={formData.details?.tensioning}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, tensioning: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usage">Usage</Label>
            <Input
              id="usage"
              value={formData.details?.usage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: { ...formData.details, usage: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Product Images</Label>
        <ImageUpload
          images={formData.images || []}
          onChange={(images) => setFormData({ ...formData, images })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}