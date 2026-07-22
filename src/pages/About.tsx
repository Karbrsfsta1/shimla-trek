import { Link } from 'react-router-dom';
import { Leaf, Users, ShieldCheck, Mountain } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';

const ABOUT_HERO = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80';

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We follow leave-no-trace principles and partner with eco-conscious local hosts to protect the Himalayan ecosystem.',
  },
  {
    icon: Users,
    title: 'Local Community',
    description: 'Every booking directly supports Himachali families, guides, and homestay owners — not corporate chains.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description: 'Trained guides, certified equipment, insurance on every trek, and 24/7 on-trail support.',
  },
];

export function About() {
  useReveal();
  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('${ABOUT_HERO}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative text-center">
          <h1 className="font-display text-5xl font-bold text-white">About ShimlaTrek</h1>
          <p className="mt-3 text-xl text-gray-200">Local roots, Himalayan soul</p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="reveal">
        <h2 className="font-display text-3xl font-bold text-forest">Our Story</h2>
        <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
          <p>
            Born in the heart of Shimla, ShimlaTrek began as a small group of friends sharing their
            love for the Himalayas with travelers from across the world. We grew up on these trails —
            walking to school through pine forests, herding sheep in the high meadows, and listening
            to our grandparents' stories of mountain life.
          </p>
          <p>
            What started as weekend trips with backpackers in our village has grown into a fully
            guided trekking and homestay platform. But our promise hasn't changed: real experiences,
            real people, and real Himachali hospitality — no scripted tourist traps, no middlemen.
          </p>
          <p>
            Today we work with a network of local guides, family-run homestays, and small businesses
            across Kullu, Shimla, Kinnaur, and Spiti. Every booking puts money directly into the
            hands of the communities that make these mountains worth visiting.
          </p>
        </div>
        </div>
      </section>
      <section className="bg-snow py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Mountain className="mx-auto h-10 w-10 text-forest" />
          <h2 className="reveal mt-4 font-display text-3xl font-bold text-forest">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-700">
            To connect travelers with authentic Himalayan experiences while supporting local communities.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="reveal text-center font-display text-3xl font-bold text-forest">Our Values</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="reveal rounded-xl bg-white p-8 shadow-md">
              <v.icon className="h-10 w-10 text-forest" />
              <h3 className="mt-4 font-display text-xl font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-gray-600">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="reveal font-display text-3xl font-bold">Have a question?</h2>
          <p className="mt-2 text-gray-200">We'd love to hear from you.</p>
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-forest hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
