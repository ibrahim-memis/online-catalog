import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface StockManagerProps {
  stock: number;
  onChange: (stock: number) => void;
  lowStockThreshold?: number;
}

export function StockManager({ 
  stock, 
  onChange,
  lowStockThreshold = 10 
}: StockManagerProps) {
  const [adjustment, setAdjustment] = useState(0);

  const adjustStock = (amount: number) => {
    const newStock = Math.max(0, stock + amount);
    onChange(newStock);
    setAdjustment(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Current Stock</Label>
        <span className="text-2xl font-bold">
          {stock}
        </span>
      </div>

      {stock <= lowStockThreshold && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Low stock alert! Current stock is below the threshold of {lowStockThreshold} units.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(Number(e.target.value))}
            placeholder="Enter amount"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => adjustStock(-adjustment)}
        >
          Remove
        </Button>
        <Button
          type="button"
          onClick={() => adjustStock(adjustment)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}