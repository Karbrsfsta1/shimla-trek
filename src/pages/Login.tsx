import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;
  const redirect = searchParams.get('redirect');
  const redirectTo = from || redirect || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Welcome back!');
    navigate(redirectTo);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) toast.error(error);
  };

  return (
    <div className="mx-auto mt-20 max-w-md px-4">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-forest">Welcome Back</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your ShimlaTrek account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button
          variant="outline"
          onClick={handleGoogle}
          loading={googleLoading}
          className="w-full"
        >
          Sign in with Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-forest hover:text-mountain">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
