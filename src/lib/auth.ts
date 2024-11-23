import { User } from '@/types';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'password',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    password: 'password',
    company: 'Test Company',
    phone: '+90 555 123 4567',
    discount: 10, // %10 iskonto
    createdAt: new Date().toISOString(),
    status: 'active'
  },
];

export async function login(email: string, password: string): Promise<User> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.email === email && u.status === 'active');
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

// Kullanıcı yönetimi fonksiyonları
export async function getUsers(): Promise<User[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_USERS.map(({ password: _, ...user }) => user);
}

export async function createUser(userData: Partial<User> & { plainPassword: string }): Promise<User> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email: userData.email!,
    name: userData.name!,
    role: userData.role || 'user',
    password: userData.plainPassword,
    company: userData.company,
    phone: userData.phone,
    discount: userData.discount,
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  MOCK_USERS.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function updateUser(
  userId: string, 
  userData: Partial<User> & { plainPassword?: string }
): Promise<User> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  const updatedUser = {
    ...MOCK_USERS[userIndex],
    ...userData,
  };

  if (userData.plainPassword) {
    updatedUser.password = userData.plainPassword;
  }

  MOCK_USERS[userIndex] = updatedUser;
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

export async function deleteUser(userId: string): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  // Soft delete - just mark as inactive
  MOCK_USERS[userIndex].status = 'inactive';
}