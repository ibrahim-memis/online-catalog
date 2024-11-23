import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { LoginPage } from '@/pages/LoginPage';
import { AdminPage } from '@/pages/AdminPage';
import { HomePage } from '@/pages/HomePage';
import { LiveChat } from '@/components/chat/LiveChat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <LiveChat />
            <Toaster />
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;