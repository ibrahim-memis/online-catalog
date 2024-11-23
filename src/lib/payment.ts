import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  uri: 'https://sandbox-api.iyzipay.com'
});

interface PaymentOptions {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  amount: number;
  installment?: number;
  currency?: string;
}

export async function processPayment({
  cardHolderName,
  cardNumber,
  expireMonth,
  expireYear,
  cvc,
  amount,
  installment = 1,
  currency = 'TRY'
}: PaymentOptions) {
  const request = {
    locale: 'tr',
    conversationId: Date.now().toString(),
    price: amount.toString(),
    paidPrice: amount.toString(),
    currency,
    installment,
    basketId: 'B' + Date.now(),
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    paymentCard: {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard: '0'
    },
    buyer: {
      id: 'BY789',
      name: 'John',
      surname: 'Doe',
      gsmNumber: '+905350000000',
      email: 'email@email.com',
      identityNumber: '74300864791',
      lastLoginDate: '2015-10-05 12:43:35',
      registrationDate: '2013-04-21 15:12:09',
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742'
    },
    billingAddress: {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742'
    },
    basketItems: [
      {
        id: 'BI101',
        name: 'Binocular',
        category1: 'Collectibles',
        category2: 'Accessories',
        itemType: 'PHYSICAL',
        price: amount.toString()
      }
    ]
  };

  return new Promise((resolve, reject) => {
    iyzipay.payment.create(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function getInstallmentInfo(cardNumber: string, amount: number) {
  return new Promise((resolve, reject) => {
    iyzipay.installmentInfo.retrieve({
      locale: 'tr',
      conversationId: Date.now().toString(),
      binNumber: cardNumber.substring(0, 6),
      price: amount.toString()
    }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}