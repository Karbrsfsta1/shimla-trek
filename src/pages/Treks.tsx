import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Trek } from '../types';
import { TrekCard } from '../components/treks/TrekCard';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';

type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'challenging';
type DurationFilter = 'all' | '1' | '2-3' | '4+';
type SortFilter = 'newest' | 'price-asc' | 'price-desc' | 'duration-asc';

const labelClass =
  'block text-sm font-medium text-gray-700 mb-1';

const selectClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain';

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md">
      <div className="h-48 w-full bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-8 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function Treks() {
  useReveal();
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [duration, setDuration] = useState<DurationFilter>('all');
  const [sort, setSort] = useState<SortFilter>('newest');

  const fetchTreks = async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from('treks').select('*').eq('is_active', true);

    if (difficulty !== 'all') {
      query = query.eq('difficulty', difficulty);
    }
    if (duration === '1') {
      query = query.eq('duration_days', 1);
    } else if (duration === '2-3') {
      query = query.gte('duration_days', 2).lte('duration_days', 3);
    } else if (duration === '4+') {
      query = query.gte('duration_days', 4);
    }

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price-asc') {
      query = query.order('price_per_person', { ascending: true });
    } else if (sort === 'price-desc') {
      query = query.order('price_per_person', { ascending: false });
    } else if (sort === 'duration-asc') {
      query = query.order('duration_days', { ascending: true });
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      toast.error(fetchError.message);
    } else {
      setTreks((data ?? []) as Trek[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTreks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, duration, sort]);

  const clearFilters = () => {
    setDifficulty('all');
    setDuration('all');
    setSort('newest');
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-snow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-forest">All Treks</h1>
          <p className="mt-2 text-lg text-gray-600">Find your perfect Himalayan adventure</p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="difficulty" className={labelClass}>Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
                className={selectClass}
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className={labelClass}>Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as DurationFilter)}
                className={selectClass}
              >
                <option value="all">All</option>
                <option value="1">1 day</option>
                <option value="2-3">2-3 days</option>
                <option value="4+">4+ days</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className={labelClass}>Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortFilter)}
                className={selectClass}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Treks grid */}
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
            <Button variant="secondary" onClick={fetchTreks}>Retry</Button>
          </div>
        ) : treks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-lg text-gray-500">No treks found</p>
            <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
