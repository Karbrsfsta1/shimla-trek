import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CreditCard, Star, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Booking, Review } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';

type Tab = 'bookings' | 'reviews' | 'profile';

type BookingWithRelations = Booking & {
  treks: { title: string; slug: string; image_url: string | null; start_location: string; end_location: string; duration_days: number; payment_link: string | null } | null;
  homestays: { name: string; slug: string; image_url: string | null; location: string } | null;
};

type ReviewWithRelations = Review & {
  treks: { title: string; slug: string } | null;
  homestays: { name: string; slug: string } | null;
};

const statusStyles: Record<Booking['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const paymentStyles: Record<Booking['payment_status'], string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export function Dashboard() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('bookings');

  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      const [bookingsRes, reviewsRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, treks(title, slug, image_url, start_location, end_location, duration_days, payment_link), homestays(name, slug, image_url, location)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('reviews')
          .select('*, treks(title, slug), homestays(name, slug)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (!active) return;
      if (bookingsRes.error) toast.error(bookingsRes.error.message);
      else setBookings((bookingsRes.data ?? []) as BookingWithRelations[]);

      if (reviewsRes.error) toast.error(reviewsRes.error.message);
      else setReviews((reviewsRes.data ?? []) as ReviewWithRelations[]);

      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', user.id);
    setProfileSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Profile updated');
  };

  if (!user) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'bookings', label: 'My Bookings' },
    { key: 'reviews', label: 'My Reviews' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-forest">
        Welcome, {profile?.full_name || user.email}!
      </h1>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'border-forest text-forest'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="mt-8">
          {/* Bookings tab */}
          {tab === 'bookings' && (
            <div>
              {bookings.length === 0 ? (
                <p className="text-gray-500">You have no bookings yet. <Link to="/treks" className="text-forest hover:underline">Explore treks</Link>.</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {bookings.map((b) => {
                    const isTrek = !!b.trek_id;
                    const trek = isTrek ? b.treks : null;
                    const homestay = !isTrek ? b.homestays : null;
                    const title = trek?.title ?? homestay?.name ?? 'Booking';
                    const slug = trek?.slug ?? homestay?.slug ?? '';
                    const image = trek?.image_url ?? homestay?.image_url ?? null;
                    const sub = trek
                      ? `${trek.start_location} → ${trek.end_location} · ${trek.duration_days}d`
                      : homestay?.location ?? '';
                    return (
                      <div key={b.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="flex gap-4 p-4">
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {image && <img src={image} alt={title} className="h-full w-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <Link to={`/${isTrek ? 'treks' : 'homestays'}/${slug}`} className="font-semibold text-gray-900 hover:text-forest">
                              {title}
                            </Link>
                            {sub && <p className="text-sm text-gray-500">{sub}</p>}
                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(b.booking_date)}</span>
                              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {b.number_of_persons}</span>
                              <span className="font-semibold text-forest">{formatINR(b.total_amount)}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[b.status]}`}>{b.status}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${paymentStyles[b.payment_status]}`}>
                                {b.payment_status}
                              </span>
                              {b.payment_status === 'unpaid' && isTrek && trek?.payment_link && (
                                <Button size="sm" variant="secondary" onClick={() => window.open(trek.payment_link as string, '_blank', 'noopener,noreferrer')}>
                                  <CreditCard className="h-3 w-3" /> Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {tab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <p className="text-gray-500">You haven't written any reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => {
                    const name = r.treks?.title ?? r.homestays?.name ?? 'Item';
                    const slug = r.treks?.slug ?? r.homestays?.slug ?? '';
                    const basePath = r.treks ? 'treks' : 'homestays';
                    return (
                      <div key={r.id} className="rounded-lg bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <Link to={`/${basePath}/${slug}`} className="font-medium text-gray-900 hover:text-forest">{name}</Link>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="mt-2 text-gray-600">{r.comment}</p>}
                        <p className="mt-2 text-xs text-gray-400">{formatDate(r.created_at)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Profile tab */}
          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md">
              <Input label="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button type="submit" loading={profileSaving}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
