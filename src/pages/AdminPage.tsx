import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { Product, Category } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { UserManagement } from '@/components/admin/UserManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { BulkActions } from '@/components/admin/BulkActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  Plus, 
  Search, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Package,
  FolderTree,
  Users,
  ShoppingBag
} from 'lucide-react';

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductSubmit = async (productData: Partial<Product>) => {
    if (selectedProduct) {
      await updateProduct({ ...selectedProduct, ...productData } as Product);
    } else {
      await addProduct({
        ...productData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product);
    }
    setIsProductFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleCategorySubmit = async (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      await updateCategory({ ...selectedCategory, ...categoryData } as Category);
    } else {
      await addCategory({
        ...categoryData,
        id: Math.random().toString(36).substr(2, 9),
      } as Category);
    }
    setIsCategoryFormOpen(false);
    setSelectedCategory(undefined);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const flatCategories = categories.flatMap(category => [
    category,
    ...(category.children || []).flatMap(subCat => [
      subCat,
      ...(subCat.children || [])
    ])
  ]);

  const filteredCategories = flatCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-emerald-400">Yönetim Paneli</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-emerald-400">
            Hoş geldiniz, {user.name}
          </span>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ürünler
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Kategoriler
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Siparişler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-[#1a1a1a] border-[#2a2a2a]"
                  />
                </div>
                <BulkActions />
              </div>
              <Button 
                onClick={() => {
                  setSelectedProduct(undefined);
                  setIsProductFormOpen(true);
                }}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Ürün Ekle
              </Button>
            </div>

            <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün Adı</TableHead>
                    <TableHead>Kod</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="w-[100px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.price.toLocaleString('tr-TR')} ₺</TableCell>
                      <TableCell>
                        {flatCategories.find(c => c.id === product.categoryId)?.name}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsProductFormOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[#1a1a1a] border-[#2a2a2a]"
                />
              </div>
              <Button 
                onClick={() => {
                  setSelectedCategory(undefined);
                  setIsCategoryFormOpen(true);
                }}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Kategori Ekle
              </Button>
            </div>

            <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori Adı</TableHead>
                    <TableHead>Üst Kategori</TableHead>
                    <TableHead className="w-[100px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        {category.parentId 
                          ? flatCategories.find(c => c.id === category.parentId)?.name 
                          : 'Ana Kategori'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryFormOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="max-w-5xl w-[95%] md:w-full mx-auto h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            categories={flatCategories}
            onSubmit={handleProductSubmit}
            onCancel={() => {
              setIsProductFormOpen(false);
              setSelectedProduct(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
        <DialogContent className="w-[95%] md:w-full mx-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            parentCategories={flatCategories}
            onSubmit={handleCategorySubmit}
            onCancel={() => {
              setIsCategoryFormOpen(false);
              setSelectedCategory(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}