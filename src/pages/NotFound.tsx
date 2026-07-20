import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-snow px-4 text-center">
      <Mountain className="h-20 w-20 text-forest" />
      <p className="mt-6 text-9xl font-bold text-forest">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-gray-700">Page Not Found</h1>
      <p className="mt-2 text-gray-500">The trail you're looking for doesn't exist.</p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
