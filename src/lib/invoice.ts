import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, Product } from '@/types';

export function generateInvoice(order: Order) {
  const doc = new jsPDF();

  // Add company logo and header
  doc.setFontSize(20);
  doc.text('FATURA', 105, 20, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Fatura No: INV-${order.id}`, 15, 40);
  doc.text(`Tarih: ${new Date(order.createdAt).toLocaleDateString('tr-TR')}`, 15, 45);
  
  // Add customer details
  doc.text('Müşteri Bilgileri:', 15, 60);
  doc.text(`Ad Soyad: ${order.user.name}`, 15, 65);
  doc.text(`Firma: ${order.user.company || '-'}`, 15, 70);
  doc.text(`E-posta: ${order.user.email}`, 15, 75);
  doc.text(`Telefon: ${order.user.phone || '-'}`, 15, 80);

  // Create table for products
  const tableData = order.products.map(product => [
    product.name,
    product.code,
    order.quantities[product.id],
    `${product.price.toLocaleString('tr-TR')} ₺`,
    `${(product.price * order.quantities[product.id]).toLocaleString('tr-TR')} ₺`
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['Ürün', 'Kod', 'Miktar', 'Birim Fiyat', 'Toplam']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50] },
    foot: [[
      'Toplam',
      '',
      '',
      '',
      `${order.totalAmount.toLocaleString('tr-TR')} ₺`
    ]],
    footStyles: { fillColor: [46, 125, 50] }
  });

  // Add payment details
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.text('Ödeme Bilgileri:', 15, finalY + 10);
  doc.text(`Durum: ${order.status}`, 15, finalY + 15);
  
  if (order.notes) {
    doc.text('Notlar:', 15, finalY + 25);
    doc.text(order.notes, 15, finalY + 30);
  }

  // Add footer
  doc.setFontSize(8);
  doc.text('Bu bir bilgisayar çıktısıdır, imza gerektirmez.', 105, 280, { align: 'center' });

  return doc;
}

export function downloadInvoice(order: Order) {
  const doc = generateInvoice(order);
  doc.save(`fatura-${order.id}.pdf`);
}

export function previewInvoice(order: Order) {
  const doc = generateInvoice(order);
  const pdfDataUri = doc.output('datauristring');
  window.open(pdfDataUri);
}