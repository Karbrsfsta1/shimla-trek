import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Check, Users, Calendar, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Homestay } from '../types';
import { formatINR } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

const WHATSAPP_NUMBER = '919876543210'; // placeholder

export function HomestayDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [nights, setNights] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const total = homestay ? homestay.price_per_night * nights : 0;

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('homestays')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (!active) return;
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setHomestay(data as Homestay);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleBooking = async () => {
    if (!homestay) return;
    if (!user) {
      navigate(`/login?redirect=/homestays/${homestay.slug}`);
      return;
    }
    if (!checkIn) {
      toast.error('Please select a check-in date');
      return;
    }
    setSubmitting(true);
    const endDate = new Date(checkIn);
    endDate.setDate(endDate.getDate() + nights);
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      homestay_id: homestay.id,
      booking_date: checkIn,
      end_date: endDate.toISOString().split('T')[0],
      number_of_persons: nights,
      total_amount: total,
      status: 'pending',
      payment_status: 'unpaid',
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Booking request created! We will contact you on WhatsApp to confirm.');
    const msg = encodeURIComponent(`Hi, I'd like to book "${homestay.name}" (${formatINR(total)} for ${nights} night${nights > 1 ? 's' : ''} from ${checkIn}).`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !homestay) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">Homestay not found.</p>
        <Button variant="secondary" onClick={() => navigate('/homestays')}>Back to Homestays</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-96 w-full overflow-hidden">
        {homestay.image_url ? (
          <img src={homestay.image_url} alt={homestay.name} className="h-96 w-full object-cover" />
        ) : (
          <div className="h-96 w-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-forest">{homestay.name}</h1>
        <p className="mt-3 flex items-center gap-1.5 text-gray-600">
          <MapPin className="h-5 w-5" /> {homestay.location}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-forest">About this homestay</h2>
              <p className="leading-relaxed text-gray-700">{homestay.description}</p>
            </section>

            {homestay.amenities.length > 0 && (
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-forest">Amenities</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {homestay.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-gray-700">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <Check className="h-4 w-4" />
                      </span>
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right - booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
              <p className="text-3xl font-bold text-forest">
                {formatINR(homestay.price_per_night)}
                <span className="text-sm font-normal text-gray-500"> /night</span>
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="checkin" className="mb-1 block text-sm font-medium text-gray-700">Check-in</label>
                  <input
                    id="checkin"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label htmlFor="nights" className="mb-1 block text-sm font-medium text-gray-700">Nights</label>
                  <input
                    id="nights"
                    type="number"
                    min={1}
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-forest">{formatINR(total)}</span>
                </div>
                <Button onClick={handleBooking} loading={submitting} className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" /> Contact for Booking
                </Button>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" /> Confirmed via WhatsApp after request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
