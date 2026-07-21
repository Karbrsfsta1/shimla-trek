import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Flag, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Trek, Review } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

type ReviewWithProfile = Review & { profiles: { full_name: string | null } | null };

const difficultyStyles: Record<Trek['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  challenging: 'bg-red-100 text-red-800',
};

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

function buildItinerary(trek: Trek): ItineraryDay[] {
  const { difficulty, duration_days, start_location, end_location } = trek;
  const days: ItineraryDay[] = [];

  if (difficulty === 'easy' && duration_days === 1) {
    days.push({
      day: 1,
      title: `${start_location} to ${end_location}`,
      description: `Meet your guide at ${start_location} in the morning for a briefing and gear check. Begin the gentle ascent through deodar and pine forests, pausing at viewpoints for photographs and a packed lunch. Reach ${end_location} by early afternoon, explore the temple and surrounding viewpoints, and descend back to ${start_location} by evening.`,
    });
    return days;
  }

  days.push({
    day: 1,
    title: `Arrival at ${start_location}`,
    description:
      difficulty === 'challenging'
        ? `Arrive at ${start_location}, complete registration and permit checks, and meet your lead guide for a full safety briefing. A short acclimatization walk around the base camp helps your body adjust to the altitude. Overnight in tents at the base camp.`
        : `Arrive at ${start_location}, meet your guide, and settle into the base accommodation. After a briefing on the route and safety, take a gentle evening acclimatization walk through the surrounding forest. Dinner and overnight at the base.`,
  });

  for (let d = 2; d < duration_days; d++) {
    const isMid = d === Math.ceil(duration_days / 2);
    days.push({
      day: d,
      title:
        difficulty === 'challenging'
          ? isMid
            ? `Trek to high camp`
            : `Trek through high altitude trails`
          : `Trek through scenic trails`,
      description:
        difficulty === 'challenging'
          ? isMid
            ? `Begin the steep ascent toward the high camp, crossing moraine and possibly snow patches depending on the season. The pace is deliberately slow for acclimatization. Reach the high camp by late afternoon; hot soup and rest.`
            : `Continue along the ridge with panoramic views of the surrounding peaks. The trail climbs steadily through alpine meadows. Set up camp at the next designated site by evening.`
          : `After breakfast, set off along forest trails and meadows with views of the Himalayan ranges. The trail is moderate with gradual climbs. Stop for lunch at a scenic spot, then continue to the next campsite. Evening around the campfire.`,
    });
  }

  if (duration_days > 1) {
    days.push({
      day: duration_days,
      title:
        difficulty === 'challenging'
          ? `Cross the pass and descend to ${end_location}`
          : `Final stretch to ${end_location}`,
      description:
        difficulty === 'challenging'
          ? `An early start to cross the high pass before afternoon clouds build up. The descent is long and tough on the knees; reach ${end_location} by late afternoon. Transport back to the nearest town is arranged.`
          : `The final day is a mostly downhill walk through villages and terraced fields, arriving at ${end_location} by afternoon. Share a farewell meal with the group before departing.`,
    });
  }

  return days;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export function TrekDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trek, setTrek] = useState<Trek | null>(null);
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [persons, setPersons] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('treks')
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

      const trekData = data as Trek;
      setTrek(trekData);
      setLoading(false);

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('trek_id', trekData.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (active) setReviews((reviewData ?? []) as ReviewWithProfile[]);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const total = trek ? trek.price_per_person * persons : 0;

  const handleBooking = async () => {
    if (!trek) return;
    if (!user) {
      navigate(`/login?redirect=/treks/${trek.slug}`);
      return;
    }
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      trek_id: trek.id,
      booking_date: bookingDate,
      number_of_persons: persons,
      total_amount: total,
      status: 'pending',
      payment_status: 'unpaid',
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Booking created! Complete payment to confirm.');
    if (trek.payment_link) {
      window.open(trek.payment_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !trek) return;
    setReviewSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      trek_id: trek.id,
      rating: reviewRating,
      comment: reviewComment || null,
      is_published: true,
    });
    setReviewSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Review submitted!');
    setReviewComment('');
    setReviewRating(5);

    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('trek_id', trek.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    setReviews((reviewData ?? []) as ReviewWithProfile[]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !trek) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">Trek not found.</p>
        <Button variant="secondary" onClick={() => navigate('/treks')}>Back to Treks</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-96 w-full overflow-hidden">
        {trek.image_url ? (
          <img src={trek.image_url} alt={trek.title} className="h-96 w-full object-cover" />
        ) : (
          <div className="h-96 w-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-forest">{trek.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-600">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${difficultyStyles[trek.difficulty]}`}>
                {trek.difficulty}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {trek.duration_days} {trek.duration_days === 1 ? 'day' : 'days'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {trek.start_location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Max {trek.max_group_size}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-forest">About this trek</h2>
              <p className="leading-relaxed text-gray-700">{trek.description}</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-forest">Itinerary</h2>
              <ol className="space-y-4">
                {buildItinerary(trek).map((day) => (
                  <li key={day.day} className="rounded-lg border border-gray-100 bg-white p-5">
                    <div className="flex items-baseline gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                        {day.day}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="mt-2 pl-11 leading-relaxed text-gray-600">{day.description}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm italic text-gray-400">
                A detailed packing list and meeting point map are shared after booking.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-forest">Reviews</h2>
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-snow/50 px-6 py-12 text-center">
                  <MessageSquare className="h-10 w-10 text-mountain" />
                  <p className="mt-4 text-lg font-medium text-gray-700">No reviews yet</p>
                  <p className="mt-1 text-sm text-gray-500">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-gray-100 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {review.profiles?.full_name || 'Anonymous'}
                        </span>
                        <StarRating rating={review.rating} />
                      </div>
                      {review.comment && <p className="mt-2 text-gray-600">{review.comment}</p>}
                      <p className="mt-2 text-xs text-gray-400">{formatDate(review.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <form onSubmit={handleReviewSubmit} className="mt-6 rounded-lg border border-gray-100 bg-white p-5">
                  <h3 className="mb-3 text-lg font-semibold text-forest">Add a Review</h3>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <Button type="submit" loading={reviewSubmitting}>
                    Submit Review
                  </Button>
                </form>
              )}
            </section>
          </div>

          {/* Right column - booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
              <p className="text-3xl font-bold text-forest">
                {formatINR(trek.price_per_person)}
                <span className="text-sm font-normal text-gray-500"> /person</span>
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                  <input
                    id="date"
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label htmlFor="persons" className="mb-1 block text-sm font-medium text-gray-700">Persons</label>
                  <input
                    id="persons"
                    type="number"
                    min={1}
                    max={trek.max_group_size}
                    value={persons}
                    onChange={(e) => setPersons(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-forest">{formatINR(total)}</span>
                </div>
                <Button onClick={handleBooking} loading={submitting} className="w-full">
                  Book Now
                </Button>
                {!user && (
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Flag className="h-3 w-3" /> You'll be asked to sign in to complete booking.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
