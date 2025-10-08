import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import supabase from '../../lib/supabaseClient';
import { friendlyAuthError } from '../../utils/errors';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // When Supabase redirects with a recovery-type token, a session is created.
  useEffect(() => {
    // no-op here; we rely on updateUser below
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      if (data?.user) {
        setInfo('Password updated. Redirecting to sign in…');
        setTimeout(() => navigate('/auth/sign-in'), 1200);
      }
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Set a new password</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="password" label="New Password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {error && <div className="text-sm text-red-600">{error}</div>}
            {info && <div className="text-sm text-green-600">{info}</div>}
            <Button type="submit" loading={loading} fullWidth>Update Password</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
