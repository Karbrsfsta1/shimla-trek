import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Trek, Homestay, Booking } from '../../types';
import { formatINR } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface BookingFormProps {
  itemType: 'trek' | 'homestay';
  item: Trek | Homestay;
  onBookingCreated?: (booking: Booking) => void;
}

export function BookingForm({ itemType, item, onBookingCreated }: BookingFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState(1); // persons for trek, nights for homestay
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const unitPrice = itemType === 'trek' ? (item as Trek).price_per_person : (item as Homestay).price_per_night;
  const total = unitPrice * quantity;
  const maxQty = itemType === 'trek' ? (item as Trek).max_group_size : 30;
  const qtyLabel = itemType === 'trek' ? 'Persons' : 'Nights';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      const slug = item.slug;
      navigate(`/login?redirect=/${itemType === 'trek' ? 'treks' : 'homestays'}/${slug}`);
      return;
    }
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      user_id: user.id,
      booking_date: date,
      number_of_persons: quantity,
      total_amount: total,
      status: 'pending',
      payment_status: 'unpaid',
      customer_notes: customerNotes || null,
    };

    if (itemType === 'trek') {
      payload.trek_id = (item as Trek).id;
    } else {
      payload.homestay_id = (item as Homestay).id;
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + quantity);
      payload.end_date = endDate.toISOString().split('T')[0];
    }

    const { data, error } = await supabase.from('bookings').insert(payload).select().single();
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Booking created! Complete payment to confirm.');
    if (itemType === 'trek' && (item as Trek).payment_link) {
      window.open((item as Trek).payment_link as string, '_blank', 'noopener,noreferrer');
    }
    if (onBookingCreated && data) {
      onBookingCreated(data as Booking);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>
      <div>
        <label htmlFor="qty" className="mb-1 block text-sm font-medium text-gray-700">{qtyLabel}</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={maxQty}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          id="notes"
          rows={3}
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-gray-600">Total</span>
        <span className="text-xl font-bold text-forest">{formatINR(total)}</span>
      </div>
      <Button type="submit" loading={submitting} className="w-full">
        Book Now
      </Button>
    </form>
  );
}
