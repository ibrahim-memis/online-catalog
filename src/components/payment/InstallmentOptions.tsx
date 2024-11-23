import { useState, useEffect } from 'react';
import { getInstallmentInfo } from '@/lib/payment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface InstallmentOptionsProps {
  cardNumber: string;
  amount: number;
  onSelect: (installment: number) => void;
}

export function InstallmentOptions({
  cardNumber,
  amount,
  onSelect
}: InstallmentOptionsProps) {
  const [installments, setInstallments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cardNumber.length >= 6) {
      setLoading(true);
      getInstallmentInfo(cardNumber, amount)
        .then((result: any) => {
          if (result.installmentDetails?.[0]?.installmentPrices) {
            setInstallments(result.installmentDetails[0].installmentPrices);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [cardNumber, amount]);

  if (loading || installments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>Taksit Seçenekleri</Label>
      <Select onValueChange={(value) => onSelect(parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Taksit seçin" />
        </SelectTrigger>
        <SelectContent>
          {installments.map((option) => (
            <SelectItem key={option.installment} value={option.installment.toString()}>
              {option.installment} Taksit - {option.totalPrice.toLocaleString('tr-TR')} ₺
              {option.installment > 1 && (
                <span className="text-sm text-gray-400 ml-2">
                  (Aylık {(option.totalPrice / option.installment).toLocaleString('tr-TR')} ₺)
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}