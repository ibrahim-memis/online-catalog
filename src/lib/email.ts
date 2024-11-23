import { Product, User } from '@/types';

interface QuoteEmailData {
  user: User;
  products: Product[];
  quantities: { [key: string]: number };
  message?: string;
}

export async function sendQuoteEmail({ user, products, quantities, message }: QuoteEmailData) {
  // Bu fonksiyon gerçek bir e-posta servisi ile değiştirilmeli
  // Örneğin: SendGrid, Amazon SES, veya SMTP
  console.log('Teklif e-postası gönderiliyor...');
  console.log('Kime:', 'ibrahim.memis@yahoo.com');
  console.log('Kimden:', user.email);
  console.log('Konu:', `Teklif Talebi - ${user.name}`);
  
  const emailContent = `
    Yeni Teklif Talebi
    
    Müşteri Bilgileri:
    Ad Soyad: ${user.name}
    Firma: ${user.company || '-'}
    E-posta: ${user.email}
    Telefon: ${user.phone || '-'}
    
    Ürünler:
    ${products.map(product => `
      - ${product.name} (${product.code})
      Miktar: ${quantities[product.id]} adet
      Birim Fiyat: ${product.price.toLocaleString('tr-TR')} ₺
      ${user.discount ? `İndirim: %${user.discount}` : ''}
      Toplam: ${((product.price * (1 - (user.discount || 0) / 100)) * quantities[product.id]).toLocaleString('tr-TR')} ₺
    `).join('\n')}
    
    ${message ? `\nNotlar:\n${message}` : ''}
  `;

  console.log('İçerik:', emailContent);
  
  // Simüle edilmiş API çağrısı
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return true;
}