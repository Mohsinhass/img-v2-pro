import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import supabase from '../../lib/supabaseClient';
import { upsertProfile } from '../../utils/db';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Finalizing sign-in…');

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const code = params.get('code');
        const token_hash = params.get('token_hash');
        const type = params.get('type'); // e.g., signup | magiclink | recovery | email_change | invite

        // 1) OAuth/PKCE flow (e.g., code in query)
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) throw error;
          if (data?.user) {
            await upsertProfile({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || '' });
          }
          if (!mounted) return;
          setMessage('Signed in successfully. Redirecting…');
          setTimeout(() => navigate('/image-conversion-hub'), 500);
          return;
        }

        // 2) Email confirmation / magic link flow (token_hash + type)
        if (token_hash && type) {
          const email = params.get('email') || localStorage.getItem('last_auth_email') || '';
          if (!email) {
            throw new Error('Missing email for verification. Please sign in manually.');
          }
          const { data, error } = await supabase.auth.verifyOtp({ email, token_hash, type });
          if (error) throw error;
          if (data?.user) {
            try { await upsertProfile({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || '' }); } catch {}
            // To enforce manual login after verification, end any session and redirect to sign-in with a success hint.
            try { await supabase.auth.signOut(); } catch {}
          }
          if (!mounted) return;
          setMessage('Email verified. You can now sign in.');
          setTimeout(() => navigate(`/auth/sign-in?verified=1&email=${encodeURIComponent(email)}`), 700);
          return;
        }

        // 3) Fallback: if session already exists, just continue
        const { data: s } = await supabase.auth.getSession();
        if (s?.session) {
          const u = s.session.user;
          if (u) {
            try { await upsertProfile({ id: u.id, email: u.email, name: u.user_metadata?.name || '' }); } catch {}
          }
          if (!mounted) return;
          setMessage('Session active. Redirecting…');
          setTimeout(() => navigate('/image-conversion-hub'), 500);
          return;
        }

        throw new Error('No auth parameters found in URL.');
      } catch (err) {
        console.warn('[AuthCallback] finalize error', err);
        if (!mounted) return;
        setMessage('Could not finalize sign-in. You can close this tab and sign in manually.');
      }
    }
    run();
    return () => { mounted = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-transparent border border-gray-200/70 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-700">{message}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthCallback;
