import { useState } from 'react';
import { ChevronDown, ChevronRight, FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  isMobile?: boolean;
}

const CategoryItem = ({ 
  category, 
  level = 0,
  selectedCategory,
  onSelectCategory 
}: { 
  category: Category;
  level?: number;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 pl-[calc(0.75rem*var(--level))] hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors",
          selectedCategory === category.id && "bg-emerald-500/20 text-emerald-400"
        )}
        style={{ '--level': level } as any}
        onClick={() => {
          onSelectCategory(category.id);
          if (hasChildren) setIsExpanded(!isExpanded);
        }}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        ) : (
          <div className="w-4" />
        )}
        {category.name}
      </Button>
      {isExpanded && hasChildren && (
        <div className="mt-1">
          {category.children?.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function CategorySidebar({ 
  categories,
  selectedCategory,
  onSelectCategory,
  isMobile = false
}: CategorySidebarProps) {
  return (
    <div className={cn(
      "w-64 border-r border-[#2a2a2a] bg-[#1a1a1a]",
      isMobile && "w-full border-r-0"
    )}>
      <div className="p-4 border-b border-[#2a2a2a]">
        <h2 className="flex items-center gap-2 font-semibold text-emerald-400">
          <FolderTree className="h-5 w-5" />
          Kategoriler
        </h2>
      </div>
      <ScrollArea className={cn(
        "h-[calc(100vh-5rem)]",
        isMobile && "h-[calc(100vh-8rem)]"
      )}>
        <div className="p-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}