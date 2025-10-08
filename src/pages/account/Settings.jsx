import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile, uploadAvatar, uploadBanner } from '../../utils/db';

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const canShow = useMemo(() => !!user && !loading, [user, loading]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const p = await getMyProfile();
        if (!active) return;
        // Map only the fields we keep in settings
        if (p) {
          setProfile({
            name: p.name || '',
            username: p.username || '',
            bio: p.bio || '',
            avatar_url: p.avatar_url || '',
            banner_url: p.banner_url || '',
          });
        } else {
          setProfile({ name: '', username: '', bio: '', avatar_url: '', banner_url: '' });
        }
      } catch (e) {
        setError(e?.message || 'Failed to load');
      }
    }
    if (user) load();
    return () => { active = false; };
  }, [user]);

  const onSave = async (e) => {
    e?.preventDefault?.();
    try {
      setSaving(true);
      setError('');
      await updateProfile({
        name: profile?.name || '',
        username: profile?.username || null,
        bio: profile?.bio || null,
        avatar_url: profile?.avatar_url || null,
        banner_url: profile?.banner_url || null,
      });
      // Success feedback: turn button green and show a message briefly
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setError(e?.message || 'Failed to save');
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAvatar(file);
      setProfile((p) => ({ ...(p || {}), avatar_url: url }));
    } catch (e) {
      setError(e?.message || 'Avatar upload failed');
    }
  };

  const onBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadBanner(file);
      setProfile((p) => ({ ...(p || {}), banner_url: url }));
    } catch (e) {
      setError(e?.message || 'Banner upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 px-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Account Settings</h1>
        {!canShow && <div className="text-gray-600">Please sign in to manage your account.</div>}
        {canShow && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile settings */}
            <section className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img src={profile?.avatar_url || '/img/icon.png'} alt="Avatar" className="w-16 h-16 rounded-full object-cover border" />
                <Button asChild size="xs" variant="outline">
                  <label className="cursor-pointer">
                    Upload Avatar
                    <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                  </label>
                </Button>
              </div>
              <form onSubmit={onSave} className="space-y-4">
                <Input label="Name" value={profile?.name || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), name: e.target.value }))} />
                <Input label="Username" value={profile?.username || ''} onChange={(e) => setProfile((p) => ({ ...(p || {}), username: e.target.value }))} />
                <div>
                  <label className="text-sm font-medium text-foreground">Bio</label>
                  <textarea className="mt-2 w-full border border-input rounded-md p-2 text-sm" rows={3}
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile((p) => ({ ...(p || {}), bio: e.target.value }))}
                  />
                </div>
                {/** Removed website, location, social links, and preferences */}
                {/* Live region for success/error */}
                <div className="min-h-5" aria-live="polite">
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  {!error && saved && (
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      Saved
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  loading={saving}
                  fullWidth
                  variant={saved ? 'success' : 'default'}
                  iconName={saved ? 'CheckCircle' : undefined}
                >
                  {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
                </Button>
              </form>
            </section>

            {/* Banner settings */}
            <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Profile Banner</h2>
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <div className="h-48 md:h-64 w-full bg-gray-100">
                  {profile?.banner_url ? (
                    <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No banner</div>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Button asChild size="xs" variant="outline">
                    <label className="cursor-pointer">
                      Upload Banner
                      <input type="file" accept="image/*" className="hidden" onChange={onBannerChange} />
                    </label>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
