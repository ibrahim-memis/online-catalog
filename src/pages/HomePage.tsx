import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { ProductList } from '@/components/products/ProductList';
import { RightNavbar } from '@/components/layout/RightNavbar';
import { UserOrdersDialog } from '@/components/user/UserOrdersDialog';
import { UserLoginDialog } from '@/components/auth/UserLoginDialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, Package, Menu, User, LogOut, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';

export function HomePage() {
  const { categories, products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        const newSelected = prev.filter(p => p.id !== product.id);
        if (newSelected.length === 0) {
          setIsNavbarOpen(false);
        }
        return newSelected;
      } else {
        setIsNavbarOpen(true);
        return [...prev, product];
      }
    });

    if (!quantities[product.id]) {
      setQuantities(prev => ({ ...prev, [product.id]: 10 }));
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleClearAll = () => {
    setSelectedProducts([]);
    setQuantities({});
    setIsNavbarOpen(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSelected = prev.filter(p => p.id !== productId);
      if (newSelected.length === 0) {
        setIsNavbarOpen(false);
      }
      return newSelected;
    });
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[productId];
      return newQuantities;
    });
  };

  const contentClass = selectedProducts.length > 0 && isNavbarOpen ? 'with-navbar' : '';

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <header className={`h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-all duration-300 ${contentClass}`}>
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-[#1a1a1a] border-r border-[#2a2a2a]">
              <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => {
                  setSelectedCategory(id);
                }}
                isMobile={true}
              />
            </SheetContent>
          </Sheet>
          <img
            src="https://toptan.nodesnets.com/logo.png"
            alt="Logo"
            className="h-8 transition-transform hover:scale-105"
          />
          <h1 className="text-lg md:text-xl font-bold text-emerald-400 hidden sm:block">
            Nodes Netting - Ürün Kataloğu
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-400" />
                    <span className="hidden md:inline text-emerald-400">
                      {user.name}
                      {user.discount ? ` (${user.discount}% İndirimli)` : ''}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsOrdersDialogOpen(true)}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Siparişlerim
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {user.role === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 transition-colors hover:bg-emerald-500 hover:text-white"
                  size="sm"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Yönetim Paneli</span>
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsLoginDialogOpen(true)}
              className="flex items-center gap-2 transition-colors hover:bg-emerald-500 hover:text-white"
              size="sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="hidden md:block">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isMobile={false}
          />
        </div>
        <ProductList
          products={products}
          selectedCategory={categories.find(c => c.id === selectedCategory)}
          selectedProducts={selectedProducts}
          onToggleProduct={handleToggleProduct}
          quantities={quantities}
          onUpdateQuantity={handleUpdateQuantity}
          isNavbarOpen={selectedProducts.length > 0 && isNavbarOpen}
        />
        {selectedProducts.length > 0 && (
          <RightNavbar
            selectedProducts={selectedProducts}
            onRemoveProduct={handleRemoveProduct}
            onClearAll={handleClearAll}
            onClose={() => setIsNavbarOpen(false)}
            isOpen={isNavbarOpen}
            quantities={quantities}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
      </div>

      <UserLoginDialog 
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      <UserOrdersDialog 
        isOpen={isOrdersDialogOpen}
        onClose={() => setIsOrdersDialogOpen(false)}
      />
    </div>
  );
}