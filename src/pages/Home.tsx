import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Shield, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Trek, Homestay } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrekCard } from '../components/treks/TrekCard';
import { HomestayCard } from '../components/homestays/HomestayCard';
import { useReveal } from '../hooks/useReveal';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80';

const features = [
  {
    icon: Mountain,
    title: 'Expert Local Guides',
    description:
      'Our guides are born and raised in Himachal, with years of trekking experience.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description:
      'All treks include insurance and safety equipment. RLS-secured booking system.',
  },
  {
    icon: Heart,
    title: 'Authentic Experience',
    description:
      'Stay with local families, eat local food, experience real Himachali culture.',
  },
];

export function Home() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [treksRes, homestaysRes] = await Promise.all([
        supabase.from('treks').select('*').eq('is_active', true).limit(3),
        supabase.from('homestays').select('*').eq('is_active', true).limit(3),
      ]);

      if (!active) return;

      if (treksRes.error) {
        toast.error(treksRes.error.message);
      } else {
        setTreks(treksRes.data ?? []);
      }

      if (homestaysRes.error) {
        toast.error(homestaysRes.error.message);
      } else {
        setHomestays(homestaysRes.data ?? []);
      }

      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      {/* Hero with parallax */}
      <section
        ref={heroRef}
        className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/30 to-forest/70" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-snow backdrop-blur-sm"
            style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
          >
            <Mountain className="h-3.5 w-3.5" />
            Shimla · Himachal Pradesh · India
          </div>

          <h1
            className="mt-6 font-display text-5xl font-bold text-white md:text-7xl"
            style={{ opacity: Math.max(0, 1 - scrollY / 500), transform: `translateY(${scrollY * 0.2}px)` }}
          >
            Experience the Magic<br />of the Himalayas
          </h1>
          <p
            className="mt-4 text-lg text-gray-200 md:text-xl"
            style={{ opacity: Math.max(0, 1 - scrollY / 350) }}
          >
            Book guided treks and authentic homestays in Shimla, Himachal Pradesh
          </p>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
          >
            <Link to="/treks">
              <Button variant="primary" size="lg">
                Explore Treks
              </Button>
            </Link>
            <Link to="/homestays">
              <Button
                size="lg"
                className="bg-white text-forest hover:bg-gray-100"
              >
                Find Homestays
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-forest/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 font-mono text-xs uppercase tracking-widest text-snow/80">
            <span>5 Curated Treks</span>
            <span className="text-earth">·</span>
            <span>4 Homestays</span>
            <span className="text-earth">·</span>
            <span>Shimla, HP</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="reveal p-8">
              <feature.icon className="h-10 w-10 text-mountain" />
              <h3 className="mt-4 font-display text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Treks */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="reveal mb-12 text-center font-display text-3xl font-bold text-forest">Popular Treks</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md">
                <div className="h-48 w-full bg-gray-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-6 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : treks.length === 0 ? (
          <p className="text-center text-gray-500">No treks available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
        <div className="reveal mt-10 text-center">
          <Link to="/treks">
            <Button variant="secondary">View All Treks</Button>
          </Link>
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="reveal mb-12 text-center font-display text-3xl font-bold text-forest">Featured Homestays</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md">
                <div className="h-48 w-full bg-gray-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-6 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : homestays.length === 0 ? (
          <p className="text-center text-gray-500">No homestays available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {homestays.map((stay) => (
              <HomestayCard key={stay.id} homestay={stay} />
            ))}
          </div>
        )}
        <div className="reveal mt-10 text-center">
          <Link to="/homestays">
            <Button variant="secondary">View All Homestays</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 text-white">
        <div className="reveal mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold">Ready for your Himalayan adventure?</h2>
          <div className="mt-8">
            <Link to="/treks">
              <Button
                size="lg"
                className="bg-white text-forest hover:bg-gray-100"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
