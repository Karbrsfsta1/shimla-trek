import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star } from 'lucide-react';
import type { Trek } from '../../types';
import { formatINR } from '../../lib/utils';

const difficultyStyles: Record<Trek['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  challenging: 'bg-red-100 text-red-800',
};

export function TrekCard({ trek }: { trek: Trek }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <Link to={`/treks/${trek.slug}`} className="block h-48 w-full overflow-hidden">
        {trek.image_url ? (
          <img
            src={trek.image_url}
            alt={trek.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
            <Star className="h-8 w-8" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link to={`/treks/${trek.slug}`}>
            <h3 className="text-xl font-bold text-forest hover:text-mountain">{trek.title}</h3>
          </Link>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${difficultyStyles[trek.difficulty]}`}
          >
            {trek.difficulty}
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-mountain" />
            {trek.duration_days} {trek.duration_days === 1 ? 'day' : 'days'}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-mountain" />
            {trek.start_location}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-forest">
            {formatINR(trek.price_per_person)}
            <span className="text-sm font-normal text-gray-500"> /person</span>
          </p>
          <Link
            to={`/treks/${trek.slug}`}
            className="rounded-md bg-apple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-apple-dark focus:outline-none focus:ring-2 focus:ring-apple focus:ring-offset-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
