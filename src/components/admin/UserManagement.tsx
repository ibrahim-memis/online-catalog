import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MoreVertical, Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';

interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'user';
  company?: string;
  phone?: string;
  discount?: number;
  plainPassword?: string;
}

const initialFormData: UserFormData = {
  email: '',
  name: '',
  role: 'user',
  company: '',
  phone: '',
  discount: 0,
  plainPassword: '',
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcılar yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.plainPassword && !selectedUser) {
        throw new Error('Şifre gerekli');
      }

      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı güncellendi.',
        });
      } else {
        await createUser(formData);
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı oluşturuldu.',
        });
      }
      await loadUsers();
      setIsFormOpen(false);
      setSelectedUser(null);
      setFormData(initialFormData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error instanceof Error ? error.message : 'İşlem sırasında bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    setIsLoading(true);
    try {
      await deleteUser(userId);
      await loadUsers();
      toast({
        title: 'Başarılı',
        description: 'Kullanıcı silindi.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcı silinirken bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setFormData(initialFormData);
            setIsFormOpen(true);
          }}
          className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>İskonto</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[100px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company || '-'}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>{user.discount ? `%${user.discount}` : '-'}</TableCell>
                <TableCell>{user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {user.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
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
                          setSelectedUser(user);
                          setFormData({
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            company: user.company,
                            phone: user.phone,
                            discount: user.discount,
                          });
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(user.id)}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {selectedUser ? 'Şifre (Değiştirmek için doldurun)' : 'Şifre'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.plainPassword}
                  onChange={(e) => setFormData({ ...formData, plainPassword: e.target.value })}
                  required={!selectedUser}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Firma Adı</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">İskonto Oranı (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : selectedUser ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}