import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import supabase, { isSupabaseConfigured } from '../../lib/supabaseClient';
import { friendlyAuthError } from '../../utils/errors';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured.');
      return;
    }
    try {
      setLoading(true);
      // Check with backend if a user actually exists for this email to avoid sending reset mails to non-users
      let exists = true;
      try {
        const res = await fetch('/api/auth/user-exists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          const json = await res.json();
          exists = !!json?.exists;
        }
      } catch {}
      if (!exists) {
        // Explicitly tell the user there is no account for this email
        setError('No account found for that email. Please sign up.');
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset',
      });
      if (error) throw error;
      setInfo('If an account exists for that email, a password reset link has been sent.');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-transparent border border-gray-200/70 rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Reset your password</h1>
          <p className="text-sm text-gray-600 mb-6">We'll email you a link to set a new password.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="email" label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {error && <div className="text-sm text-red-600">{error}</div>}
            {info && <div className="text-sm text-green-600">{info}</div>}
            <Button type="submit" loading={loading} fullWidth>Send reset link</Button>
          </form>
          <div className="mt-4 text-sm"><Link to="/auth/sign-in" className="text-blue-600 hover:underline">Back to sign in</Link></div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
