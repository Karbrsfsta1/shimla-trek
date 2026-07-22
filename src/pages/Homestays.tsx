import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Homestay } from '../types';
import { HomestayCard } from '../components/homestays/HomestayCard';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md">
      <div className="h-48 w-full bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-8 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function Homestays() {
  useReveal();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchHomestays = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('homestays')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
      toast.error(fetchError.message);
    } else {
      setHomestays((data ?? []) as Homestay[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHomestays();
  }, []);

  const filtered = search
    ? homestays.filter((h) => h.location.toLowerCase().includes(search.toLowerCase()) || h.name.toLowerCase().includes(search.toLowerCase()))
    : homestays;

  return (
    <div>
      <section className="bg-snow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-forest">All Homestays</h1>
          <p className="mt-2 text-lg text-gray-600">Stay with local families across Himachal</p>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by location or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="secondary" onClick={fetchHomestays}>Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-lg text-gray-500">No homestays found</p>
            <Button variant="secondary" onClick={() => setSearch('')}>Clear search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h) => (
              <HomestayCard key={h.id} homestay={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
