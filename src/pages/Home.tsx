import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Shield, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Trek, Homestay } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

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

  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), transparent), url('${HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold text-white md:text-6xl">
            Experience the Magic of Himalayas
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Book guided treks and authentic homestays in Shimla, Himachal Pradesh
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-8">
              <feature.icon className="h-10 w-10 text-forest" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Treks */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-forest">Popular Treks</h2>
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : treks.length === 0 ? (
          <p className="text-center text-gray-500">No treks available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {treks.map((trek) => (
              <Card key={trek.id} className="overflow-hidden">
                <div
                  className="h-48 w-full bg-gray-200"
                  style={
                    trek.image_url
                      ? { backgroundImage: `url('${trek.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : undefined
                  }
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{trek.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {trek.duration_days} days &middot; {trek.difficulty}
                  </p>
                  <p className="mt-4 text-lg font-bold text-forest">
                    ₹{trek.price_per_person}
                    <span className="text-sm font-normal text-gray-500"> /person</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/treks">
            <Button variant="secondary">View All Treks</Button>
          </Link>
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-forest">Featured Homestays</h2>
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : homestays.length === 0 ? (
          <p className="text-center text-gray-500">No homestays available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {homestays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden">
                <div
                  className="h-48 w-full bg-gray-200"
                  style={
                    stay.image_url
                      ? { backgroundImage: `url('${stay.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : undefined
                  }
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{stay.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{stay.location}</p>
                  <p className="mt-4 text-lg font-bold text-forest">
                    ₹{stay.price_per_night}
                    <span className="text-sm font-normal text-gray-500"> /night</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/homestays">
            <Button variant="secondary">View All Homestays</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready for your Himalayan adventure?</h2>
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
