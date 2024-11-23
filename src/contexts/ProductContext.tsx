import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Category } from '@/types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getInitialData = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Sports Equipment',
    parentId: null,
  },
  {
    id: '1-1',
    name: 'Volleyball',
    parentId: '1',
  },
  {
    id: '1-1-1',
    name: 'Nets',
    parentId: '1-1',
  },
  {
    id: '1-1-2',
    name: 'Balls',
    parentId: '1-1',
  },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Volleyball Net',
    code: 'VN001',
    price: 975,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
    details: {
      dimensions: '75*950 cm',
      thread: 'Polyamid - 2mm - 100*100mm',
      canvas: '50mm - Halat Overloklu',
      stitchDetail: '2*2ad. Polyester',
      tensioning: '4mm - Yüksek Mukavemetli - Polyester Halat',
      usage: 'Amatör',
      content: 'Voleybol Filesi ve Bağlantı İplikleri'
    },
    categoryId: '1-1-1',
  },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => 
    getInitialData('products', initialProducts)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    getInitialData('categories', initialCategories)
  );

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const buildCategoryTree = useCallback((flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    
    // Create category objects with children arrays
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    const rootCategories: Category[] = [];

    // Build the tree structure
    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const addCategory = useCallback(async (category: Category) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    setCategories(prev => prev.map(cat => cat.id === category.id ? category : cat));
  }, []);

  const deleteCategory = useCallback(async (categoryId: string) => {
    // Delete the category and all its children
    const getChildCategoryIds = (categories: Category[], parentId: string): string[] => {
      return categories.reduce((acc: string[], cat) => {
        if (cat.parentId === parentId) {
          return [...acc, cat.id, ...getChildCategoryIds(categories, cat.id)];
        }
        return acc;
      }, []);
    };

    const categoryIdsToDelete = [categoryId, ...getChildCategoryIds(categories, categoryId)];
    
    // Delete all products in these categories
    setProducts(prev => 
      prev.filter(p => !categoryIdsToDelete.includes(p.categoryId))
    );

    // Delete the categories
    setCategories(prev => 
      prev.filter(cat => !categoryIdsToDelete.includes(cat.id))
    );
  }, [categories]);

  const value = {
    products,
    categories: buildCategoryTree(categories),
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}