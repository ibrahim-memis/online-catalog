import { User } from '@/types';
import CryptoJS from 'crypto-js';
import axios from 'axios';

interface PayTROptions {
  amount: number;
  user: User;
  orderId: string;
}

// PayTR API bilgileri
const PAYTR_CONFIG = {
  merchantId: '501084',
  merchantKey: 'eqiJeqRi9jdL431F',
  merchantSalt: '1dEtFSY8XmySNwZ4'
};

export async function createPayTRToken({
  amount,
  user,
  orderId,
}: PayTROptions): Promise<string> {
  try {
    // Alfanumerik merchant_oid oluştur
    const merchantOrderId = `ORD${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
    
    // Sepet içeriği
    const basketItems = [{
      name: 'Sipariş',
      price: amount.toString(),
      quantity: '1'
    }];
    const userBasket = Buffer.from(JSON.stringify(basketItems)).toString('base64');
    
    // PayTR için gerekli parametreler
    const params = {
      merchant_id: PAYTR_CONFIG.merchantId,
      user_ip: '127.0.0.1',
      merchant_oid: merchantOrderId,
      email: user.email,
      payment_amount: Math.round(amount * 100), // Kuruş cinsinden
      user_basket: userBasket,
      no_installment: 0,
      max_installment: 12,
      user_name: user.name,
      user_address: user.company || 'N/A',
      user_phone: user.phone || 'N/A',
      merchant_ok_url: `${window.location.origin}/payment/success`,
      merchant_fail_url: `${window.location.origin}/payment/error`,
      timeout_limit: 30,
      currency: 'TL',
      test_mode: 1,
      debug_on: 1
    };

    // Hash oluşturma
    const hashStr = `${PAYTR_CONFIG.merchantId}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${params.user_basket}${params.no_installment}${params.max_installment}${params.currency}${params.test_mode}${PAYTR_CONFIG.merchantSalt}`;
    const paytrToken = CryptoJS.SHA256(hashStr).toString();

    // Form verilerini hazırla
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append('paytr_token', paytrToken);
    formData.append('merchant_key', PAYTR_CONFIG.merchantKey);

    // API isteği
    const response = await axios.post('https://www.paytr.com/odeme/api/get-token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 'success') {
      return response.data.token;
    }

    throw new Error(response.data.reason || 'PayTR token oluşturulamadı');
  } catch (error: any) {
    console.error('PayTR Error:', error);
    
    // Daha detaylı hata mesajları
    if (error.response) {
      throw new Error(`PayTR Hatası: ${error.response.data.reason || 'Bilinmeyen hata'}`);
    } else if (error.request) {
      throw new Error('PayTR sunucusuna ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.');
    } else {
      throw new Error('Ödeme sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
    }
  }
}