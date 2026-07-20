import { CreditCard } from 'lucide-react';
import { formatINR } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface PaymentButtonProps {
  paymentLink: string | null;
  amount: number;
  label?: string;
}

export function PaymentButton({ paymentLink, amount, label = 'Book Now' }: PaymentButtonProps) {
  if (!paymentLink) {
    return (
      <Button disabled className="w-full">
        Booking Coming Soon
      </Button>
    );
  }

  return (
    <Button
      className="w-full gap-2"
      onClick={() => window.open(paymentLink, '_blank', 'noopener,noreferrer')}
    >
      <CreditCard className="h-4 w-4" />
      {label} - {formatINR(amount)}
    </Button>
  );
}
