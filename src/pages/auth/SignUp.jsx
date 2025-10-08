import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import supabase, { isSupabaseConfigured } from '../../lib/supabaseClient';
import { upsertProfile } from '../../utils/db';
import { friendlyAuthError } from '../../utils/errors';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setLoading(true);
      try { localStorage.setItem('last_auth_email', email); } catch {}
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw error;

      // If email confirmation is ON, Supabase requires confirmation before sign-in
      if (data?.user && !data?.session) {
        // Redirect to sign-in with a friendly notice
        navigate(`/auth/sign-in?confirm=sent&email=${encodeURIComponent(email)}`);
      } else {
        if (data?.user) {
          await upsertProfile({ id: data.user.id, email: data.user.email, name });
        }
        // If confirmation is not required and session exists, you can choose to go to hub
        navigate('/image-conversion-hub');
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sign Up | Img V2 Pro</title>
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div
          className={`w-full max-w-lg mx-auto bg-transparent border border-gray-200/70 rounded-2xl p-8 shadow-md transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99]'}`}
        >
          <div className="flex items-center justify-center mb-4">
            <img src="/img/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create your account</h1>
          <p className="text-base text-gray-600 mb-6">Start converting with your personal workspace.</p>

          {!isSupabaseConfigured() && (
            <div className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
              Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="h-12 text-base"
            />
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
            {info && <div className="text-sm text-green-600">{info}</div>}
            <Button type="submit" size="lg" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/sign-in" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
