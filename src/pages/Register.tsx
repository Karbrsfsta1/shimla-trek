import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Mountain, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      setShakeKey((k) => k + 1);
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirm: 'Passwords do not match' });
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast.error(error);
      setShakeKey((k) => k + 1);
      return;
    }
    toast.success('Check your email for verification link');
    navigate('/login');
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) toast.error(error);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest px-4 py-12">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-mountain/40 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-10 top-20 h-80 w-80 rounded-full bg-earth/30 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        {/* Left: illustration panel (hidden on mobile) */}
        <div className="relative hidden items-center justify-center bg-gradient-to-br from-mountain via-forest-light to-forest p-10 md:flex">
          <div className="text-center text-white">
            <Compass className="mx-auto h-16 w-16 opacity-80" />
            <h2 className="mt-6 font-display text-2xl font-bold">Begin Your Journey</h2>
            <p className="mt-3 text-sm text-white/80">
              Join ShimlaTrek to discover curated treks and authentic homestays in the heart of the Himalayas.
            </p>
            <div className="mt-8 flex justify-center gap-6 text-center">
              <div>
                <p className="font-display text-3xl font-bold">5+</p>
                <p className="text-xs uppercase tracking-wider text-white/70">Treks</p>
              </div>
              <div className="border-l border-white/20" />
              <div>
                <p className="font-display text-3xl font-bold">4+</p>
                <p className="text-xs uppercase tracking-wider text-white/70">Homestays</p>
              </div>
              <div className="border-l border-white/20" />
              <div>
                <p className="font-display text-3xl font-bold">100%</p>
                <p className="text-xs uppercase tracking-wider text-white/70">Local</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2 font-display text-2xl font-bold text-forest">
            <Mountain className="h-7 w-7" />
            <span>ShimlaTrek</span>
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-forest">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join ShimlaTrek to start your Himalayan adventure</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={User}
              required
              shake={shakeKey > 0}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              autoComplete="email"
              shake={shakeKey > 0}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              minLength={8}
              autoComplete="new-password"
              error={errors.password}
              shake={shakeKey > 0}
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              required
              autoComplete="new-password"
              error={errors.confirm}
              shake={shakeKey > 0}
            />
            <Button type="submit" loading={loading} className="w-full">
              Sign Up
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
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-forest hover:text-mountain focus:outline-none focus-visible:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
