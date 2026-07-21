import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { Homestay } from '../../types';
import { formatINR } from '../../lib/utils';

export function HomestayCard({ homestay }: { homestay: Homestay }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <Link to={`/homestays/${homestay.slug}`} className="block h-48 w-full overflow-hidden">
        {homestay.image_url ? (
          <img
            src={homestay.image_url}
            alt={homestay.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
            <Star className="h-8 w-8" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/homestays/${homestay.slug}`}>
          <h3 className="text-xl font-bold text-forest hover:text-mountain">{homestay.name}</h3>
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-mountain" /> {homestay.location}
        </p>

        {homestay.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {homestay.amenities.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full bg-sky/30 px-2.5 py-1 text-xs font-medium text-earth">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-forest">
            {formatINR(homestay.price_per_night)}
            <span className="text-sm font-normal text-gray-500"> /night</span>
          </p>
          <Link
            to={`/homestays/${homestay.slug}`}
            className="rounded-md bg-apple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-apple-dark focus:outline-none focus:ring-2 focus:ring-apple focus:ring-offset-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
