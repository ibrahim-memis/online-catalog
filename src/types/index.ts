export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  images: string[];
  views: number;
  variants?: ProductVariant[];
  details: {
    dimensions?: string;
    thread?: string;
    canvas?: string;
    content?: string;
    stitchDetail?: string;
    tensioning?: string;
    usage?: string;
    [key: string]: string | undefined;
  };
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  attributes: {
    [key: string]: string;
  };
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  image?: string;
  children?: Category[];
  customFields?: {
    [key: string]: string;
  };
  stats?: {
    totalProducts: number;
    totalViews: number;
  };
}

export interface ProductStats {
  views: number;
  lastViewed: string;
  conversionRate: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  password?: string;
  company?: string;
  phone?: string;
  discount?: number;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  user: User;
  products: Product[];
  quantities: { [key: string]: number };
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}