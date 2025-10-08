import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import supabase, { isSupabaseConfigured } from '../../lib/supabaseClient';
import { upsertProfile } from '../../utils/db';
import { friendlyAuthError } from '../../utils/errors';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const confirmSent = params.get('confirm') === 'sent';
  const verified = params.get('verified') === '1';
  const emailPrefill = params.get('email') || '';

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (emailPrefill) setEmail(emailPrefill);
  }, [emailPrefill]);
  // Facebook OAuth removed by request

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setLoading(true);
      try { localStorage.setItem('last_auth_email', email); } catch {}
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) {
        await upsertProfile({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || '' });
      }
      navigate('/image-conversion-hub');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sign In | Img V2 Pro</title>
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div
          className={`w-full max-w-lg mx-auto bg-transparent border border-gray-200/70 rounded-2xl p-8 shadow-md transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99]'}`}
        >
          <div className="flex items-center justify-center mb-4">
            <img src="/img/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-base text-gray-600 mb-6">Sign in to continue.</p>

          {!isSupabaseConfigured() && (
            <div className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
              Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </div>
          )}

          {confirmSent && (
            <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
              Confirmation email sent. Please verify your email, then sign in here.
            </div>
          )}
          {verified && (
            <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
              Your email is verified. You can now sign in.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 text-base"
            />
            <Input
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 text-base"
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            {String(error || '').toLowerCase().includes('not confirmed') && (
              <div className="text-xs text-gray-600">
                Check your inbox for the confirmation email, then sign in. If you didn’t receive it, try resending from Supabase Auth or sign up again.
              </div>
            )}
            <Button type="submit" size="lg" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>
          <div className="mt-3 text-sm">
            <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot your password?</Link>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/auth/sign-up" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
