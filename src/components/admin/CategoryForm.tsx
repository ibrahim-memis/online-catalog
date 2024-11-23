import { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFormProps {
  category?: Category;
  parentCategories: Category[];
  onSubmit: (category: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  parentCategories,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      name: '',
      parentId: null,
    }
  );

  // Filter out the current category and its children from parent options
  const availableParents = category
    ? parentCategories.filter(cat => {
        const isCurrentCategory = cat.id === category.id;
        const isChildCategory = cat.parentId === category.id;
        return !isCurrentCategory && !isChildCategory;
      })
    : parentCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      toast({
        title: 'Success',
        description: `Category ${category ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save category',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Category</Label>
        <Select
          value={formData.parentId || "root"}
          onValueChange={(value) =>
            setFormData({ ...formData, parentId: value === "root" ? null : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="root">No Parent (Root Category)</SelectItem>
            {availableParents.map((parent) => (
              <SelectItem key={parent.id} value={parent.id}>
                {parent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}