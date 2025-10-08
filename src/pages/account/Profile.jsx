import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile, uploadAvatar, uploadBanner, listMyConversions, deleteConversion, clearMyConversions, updateConversionMetadata, getSignedUrlForInput, getLocalThumb, syncLocalHistoryToSupabase } from '../../utils/db';
import { convertHeicOnServer } from '../../utils/api';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [thumbs, setThumbs] = useState({}); // id -> signed URL
  const [bannerPreviewOpen, setBannerPreviewOpen] = useState(false);
  const [bannerNatural, setBannerNatural] = useState({ w: 0, h: 0 });
  const [bannerFitToScreen, setBannerFitToScreen] = useState(true);
  const [editItem, setEditItem] = useState(null); // { id, name, description, tags }
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [expanded, setExpanded] = useState({}); // id -> boolean
  const [shareLink, setShareLink] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  const email = user?.email || '';

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setError('');
        setProfileLoading(true);
        const p = await getMyProfile();
        if (!mounted) return;
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
        setError(e?.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    }
    async function loadHistory() {
      try {
        // Migrate local history into the user's Supabase history if signed in
        try { if (user) { await syncLocalHistoryToSupabase(); } } catch {}
        const rows = await listMyConversions(100, 0);
        setHistory(rows);
        // Preload thumbnails for any rows with input_path; use local thumbnail_data_url if provided
        const map = {};
        for (const r of rows) {
          // 1) Prefer embedded thumbnail from DB if present
          if (r.thumbnail_data_url) { map[r.id] = r.thumbnail_data_url; continue; }
          // 2) Then prefer locally cached thumbnail (saved at conversion/log time)
          const cached = getLocalThumb(r.id);
          if (cached) { map[r.id] = cached; continue; }
          // 3) Finally, try a signed URL to the original input file
          //    Skip for HEIC/HEIF because most browsers can't render those in <img>
          const fname = String(r.file_name || '').toLowerCase();
          const ext = fname.split('.').pop() || '';
          const isHeif = ext === 'heic' || ext === 'heif';
          if (!isHeif && r.input_path) {
            try {
              const url = await getSignedUrlForInput(r.input_path, 3600);
              if (url) { map[r.id] = url; continue; }
            } catch {}
          }
          // 4) HEIC/HEIF: On-demand preview via backend conversion of the original
          if (isHeif && r.input_path) {
            try {
              const srcUrl = await getSignedUrlForInput(r.input_path, 600);
              if (srcUrl) {
                const resp = await fetch(srcUrl);
                const blob = await resp.blob();
                const file = new File([blob], r.file_name || 'image.heic', { type: blob.type || 'image/heic' });
                const { blob: jpgBlob } = await convertHeicOnServer(file, 'jpg', { quality: 60, name: r.file_name || 'image' });
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve, reject) => {
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(jpgBlob);
                });
                map[r.id] = dataUrl;
                continue;
              }
            } catch {}
          }
        }
        setThumbs(map);
      } finally {
        setHistoryLoading(false);
      }
    }
    // Always load history so local entries appear even when not signed in
    loadHistory();
    if (user) {
      load();
    } else {
      // No user -> don't keep the profile header in skeleton state
      setProfileLoading(false);
    }
    return () => { mounted = false; };
  }, [user]);

  const canShow = useMemo(() => !!user && !loading, [user, loading]);

  const onSave = async (e) => {
    e?.preventDefault?.();
    try {
      setSaving(true);
      await updateProfile({ name: profile?.name || '', avatar_url: profile?.avatar_url || null, banner_url: profile?.banner_url || null });
    } catch (e) {
      setError(e?.message || 'Failed to save');
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

  const onDeleteRow = async (id) => {
    await deleteConversion(id);
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  const onClearAll = async () => {
    if (!window.confirm('Delete all your conversion history?')) return;
    await clearMyConversions();
    setHistory([]);
  };

  const toggleExpanded = (id) => setExpanded((m) => ({ ...m, [id]: !m?.[id] }));

  const fmtBytes = (n) => {
    if (!n || n <= 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let v = n;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v % 1 === 0 ? v : v.toFixed(1)} ${units[i]}`;
  };

  const normalizeFormat = (fmt) => {
    if (!fmt) return '';
    const f = String(fmt).toLowerCase();
    if (f === 'jpeg') return 'jpg';
    if (f === 'svg+xml') return 'svg';
    return f;
  };

  const extFromFilename = (name) => {
    if (!name) return '';
    const parts = String(name).split('.');
    if (parts.length < 2) return '';
    return normalizeFormat(parts.pop());
  };

  // Helper: force download from a URL (even cross-origin) by converting to Blob first
  async function forceDownload(url, filename) {
    try {
      if (!url) throw new Error('No url');
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (e) {
      alert('Unable to download file.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        {/* Large Cover Header */}
        {profileLoading ? (
          <section className="relative mb-6 rounded-xl overflow-hidden border border-gray-200">
            <div className="h-64 md:h-80 w-full bg-gray-100 animate-pulse" />
          </section>
        ) : (
          <section className="relative mb-6 rounded-xl overflow-hidden border border-gray-200">
            <div className="h-64 md:h-80 w-full bg-gray-100">
              {profile?.banner_url ? (
                <img
                  src={profile.banner_url}
                  alt="Banner"
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => { setBannerFitToScreen(true); setBannerPreviewOpen(true); }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No banner</div>
              )}
            </div>
            {/* Top-right quick actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              {profile?.banner_url && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                  onClick={() => { setBannerFitToScreen(true); setBannerPreviewOpen(true); }}
                >
                  View
                </Button>
              )}
              <Link to="/settings">
                <Button
                  size="xs"
                  variant="secondary"
                  className="bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  Edit in Settings
                </Button>
              </Link>
            </div>
            {/* Bottom dark overlay bar */}
            <div className="absolute inset-x-0 bottom-0 h-20 md:h-24 bg-gradient-to-t from-black/75 to-black/10 pointer-events-none" />

            {/* Avatar overlapping the bar */}
            <div className="absolute bottom-8 left-6">
              <div className="relative">
                {profileLoading ? (
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-white border border-white/80 shadow-lg bg-gray-200 animate-pulse" />
                ) : profile?.avatar_url ? (
                  avatarError ? (
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-white border border-white/80 shadow-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  ) : (
                    <img
                      src={profile?.avatar_url}
                      alt="Avatar"
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white border border-white/80 shadow-lg bg-gray-100"
                      onError={() => setAvatarError(true)}
                    />
                  )
                ) : (
                  <img
                    src={'/img/icon.jpg'}
                    alt="Avatar default"
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white border border-white/80 shadow-lg bg-gray-100"
                    onError={(e) => {
                      if (!e?.currentTarget?.dataset?.fallbackApplied) {
                        e.currentTarget.dataset.fallbackApplied = '1';
                        e.currentTarget.src = '/img/icon.png';
                      }
                    }}
                  />
                )}
                {/* Camera shortcut to Settings */}
                <Link
                  to="/settings"
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white text-gray-700 shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  aria-label="Change photo"
                >
                  <Icon name="Camera" size={18} />
                </Link>
              </div>
            </div>

            {/* Name and subtext to the right of the avatar */}
            <div className="absolute bottom-8 left-40 md:left-52">
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">{profile?.name || 'Your Name'}</h2>
              <div className="text-white/90 text-sm md:text-base space-y-0.5">
                {profile?.username && (
                  <div className="font-medium">@{profile.username}</div>
                )}
                {profile?.bio && (
                  <div className="opacity-95 max-w-[60ch] truncate">{profile.bio}</div>
                )}
              </div>
            </div>
          </section>
        )}

        {!canShow && <div className="text-gray-600">Please sign in to view your profile.</div>}
        <div className="grid grid-cols-1 gap-6">
          {/* History */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Conversion History</h2>
                <Button size="xs" variant="outline" onClick={onClearAll}>
                  Clear All
                </Button>
              </div>
              {historyLoading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : history.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No history yet. Convert a file on the Image Conversion page and your history will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((row) => {
                    const status = String(row.status || '').toLowerCase();
                    const statusClasses = status === 'completed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : status === 'failed'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200';
                    const srcFmt = normalizeFormat(row.source_format) || extFromFilename(row.file_name) || '-';
                    const dstFmt = normalizeFormat(row.target_format) || '-';
                    return (
                      <div key={row.id} className="rounded-xl border border-gray-200 bg-white/90 shadow-sm p-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          {/* Left: filename, tags, description */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Small thumbnail when available */}
                              <div className="w-9 h-9 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                                {thumbs[row.id] ? (
                                  <img src={thumbs[row.id]} alt={row.file_name || 'preview'} className="w-full h-full object-cover" />
                                ) : (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                )}
                              </div>
                              <span className="text-sm text-primary cursor-pointer hover:underline" onClick={() => toggleExpanded(row.id)}>
                                {expanded?.[row.id] ? 'Hide details' : 'View details'}
                              </span>
                              <span className="font-medium truncate max-w-[40ch]">{row.file_name || 'Unknown file'}</span>
                              {/* Formats badge removed on left; shown on right meta section only */}
                              {row.name && (
                                <span className="text-xs text-gray-500">“{row.name}”</span>
                              )}
                            </div>
                            {(row.tags || row.description) && (
                              <div className="mt-2">
                                {row.tags && (
                                  <div className="flex flex-wrap gap-1">
                                    {row.tags.split(',').map((t, i) => (
                                      <span key={i} className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">
                                        {t.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {row.description && (
                                  <div className="mt-1 text-xs text-gray-600 line-clamp-2">{row.description}</div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: meta and actions */}
                          <div className="flex flex-col md:items-end gap-2 shrink-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${statusClasses}`}>
                                {row.status || '-'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-gray-100 border">{srcFmt} → {dstFmt}</span>
                              <span className="px-2 py-0.5 rounded bg-gray-100 border">{fmtBytes(row.file_size)}</span>
                              {row.duration_ms != null && (
                                <span className="px-2 py-0.5 rounded bg-gray-100 border">{row.duration_ms} ms</span>
                              )}
                              <span className="px-2 py-0.5 rounded bg-gray-100 border">{new Date(row.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button size="xs" variant="secondary" className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50" onClick={() => setEditItem({ id: row.id, name: row.name || '', description: row.description || '', tags: row.tags || '' })}>Edit</Button>
                              <Button size="xs" variant="secondary" className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50" onClick={() => onDeleteRow(row.id)}>Delete</Button>
                              <Button size="xs" variant="secondary" className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50" onClick={async () => {
                                // Prefer downloading the converted output if we have a path
                                const base = (row.file_name || 'image');
                                const parts = base.split('.');
                                const baseNoExt = parts.length > 1 ? parts.slice(0, -1).join('.') : base;
                                const outExt = normalizeFormat(row.target_format) || extFromFilename(row.file_name) || 'img';
                                const outName = `${baseNoExt}.${outExt}`;
                                try {
                                  if (row.output_path) {
                                    try {
                                      const url = await getSignedUrlForInput(row.output_path, 3600);
                                      if (url) return forceDownload(url, outName);
                                    } catch {}
                                  }
                                  // If a data URL/preview exists, allow downloading that as a fallback
                                  const t = thumbs[row.id] || row.thumbnail_data_url;
                                  if (t && (t.startsWith('data:') || t.startsWith('blob:') || t.startsWith('http'))) {
                                    return forceDownload(t, outName);
                                  }
                                  // Fall back to original input file
                                  if (row.input_path) {
                                    try {
                                      const url = await getSignedUrlForInput(row.input_path, 3600);
                                      if (url) return forceDownload(url, row.file_name || 'input');
                                    } catch {}
                                  }
                                  alert('No downloadable file is available for this item.');
                                } catch {
                                  alert('Download failed.');
                                }
                              }}>Download</Button>
                              <Button size="xs" variant="secondary" className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50" onClick={async () => {
                                try {
                                  let url = null;
                                  // Prefer a fresh signed URL for sharing; make it valid for 7 days
                                  if (row.input_path) {
                                    try { url = await getSignedUrlForInput(row.input_path, 60 * 60 * 24 * 7); } catch {}
                                  }
                                  // Fallback to existing cached preview if it's a proper absolute or data URL
                                  if (!url) {
                                    const t = thumbs[row.id];
                                    if (t && (t.startsWith('http') || t.startsWith('data:'))) url = t;
                                  }
                                  // As last resort, try embedded thumbnail on the row
                                  if (!url && row.thumbnail_data_url && row.thumbnail_data_url.startsWith('data:')) {
                                    url = row.thumbnail_data_url;
                                  }
                                  // Reject internal asset placeholders
                                  if (!url || url.startsWith('/assets/')) {
                                    alert('No shareable link is available yet for this item.');
                                    return;
                                  }
                                  // Cache the fresh link for preview as well
                                  setThumbs((prev) => ({ ...prev, [row.id]: url }));
                                  setShareLink(url);
                                  setShareOpen(true);
                                } catch (e) {
                                  alert('Unable to create a share link.');
                                }
                              }}>Share</Button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded grid details */}
                        {expanded?.[row.id] && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
                            <div>
                              <div className="text-gray-500">Preview</div>
                              <div className="mt-1 w-24 h-24 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                                {thumbs[row.id] ? (
                                  <img src={thumbs[row.id]} alt={row.file_name || 'preview'} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Original filename</div>
                              <div className="font-medium break-all">{row.file_name || '-'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Formats</div>
                              <div className="font-medium">{srcFmt} → {dstFmt}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">File size</div>
                              <div className="font-medium">{fmtBytes(row.file_size)}{row.file_size ? ` (${row.file_size} bytes)` : ''}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Duration</div>
                              <div className="font-medium">{row.duration_ms != null ? `${row.duration_ms} ms` : '-'}</div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-gray-500">Description</div>
                              <div className="font-medium whitespace-pre-wrap">{row.description || '-'}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
        </div>
      </main>

      {/* Fullscreen Banner Preview */}
      {bannerPreviewOpen && profile?.banner_url && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex flex-col"
          onClick={() => setBannerPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-3 text-white/90 select-none" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm">
              {bannerNatural.w && bannerNatural.h ? `Original: ${bannerNatural.w}×${bannerNatural.h}` : 'Loading image…'}
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" onClick={() => setBannerFitToScreen((v) => !v)}>
                {bannerFitToScreen ? 'View 100%' : 'Fit to screen'}
              </Button>
              <a href={profile.banner_url} target="_blank" rel="noreferrer" className="text-xs underline opacity-90 hover:opacity-100">Open in new tab</a>
              <Button size="xs" variant="danger" onClick={() => setBannerPreviewOpen(false)}>Close</Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-full min-h-full flex items-center justify-center p-4">
              <img
                src={profile.banner_url}
                alt="Banner full"
                className={bannerFitToScreen ? 'max-w-[95vw] max-h-[85vh] object-contain' : ''}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setBannerNatural({ w: img.naturalWidth, h: img.naturalHeight });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Conversion Metadata Modal */}
      {editItem && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center" onClick={() => setEditItem(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl border border-gray-200 p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Edit details</h3>
            <div className="space-y-3">
              <Input label="Name / Title" value={editItem.name} onChange={(e) => setEditItem((it) => ({ ...it, name: e.target.value }))} />
              <Input label="Tags (comma separated)" value={editItem.tags} onChange={(e) => setEditItem((it) => ({ ...it, tags: e.target.value }))} />
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea className="mt-2 w-full border border-input rounded-md p-2 text-sm" rows={4} value={editItem.description} onChange={(e) => setEditItem((it) => ({ ...it, description: e.target.value }))} />
              </div>
              {editError && <div className="text-sm text-red-600">{editError}</div>}
              {editSuccess && <div className="text-sm text-green-600">Saved.</div>}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button loading={editSaving} onClick={async () => {
                try {
                  setEditSaving(true);
                  setEditError('');
                  setEditSuccess(false);
                  const updated = await updateConversionMetadata(editItem.id, { name: editItem.name, tags: editItem.tags, description: editItem.description });
                  setHistory((rows) => rows.map(r => r.id === editItem.id ? { ...r, ...updated } : r));
                  setEditSuccess(true);
                  // Close after a brief confirmation flash
                  setTimeout(() => setEditItem(null), 600);
                } catch (e) {
                  setEditError(e?.message || 'Failed to save changes');
                } finally { setEditSaving(false); }
              }}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Share link modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center" onClick={() => setShareOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-xl border border-gray-200 p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Share preview</h3>
            <p className="text-sm text-gray-600 mb-2">This link grants temporary access to the preview.</p>
            <div className="flex items-center gap-2">
              <input className="flex-1 border border-gray-300 rounded-md p-2 text-sm" value={shareLink} readOnly onFocus={(e) => e.currentTarget.select()} />
              <Button size="sm" onClick={() => { navigator.clipboard?.writeText(shareLink); }}>Copy</Button>
            </div>
            <div className="mt-4 text-right">
              <Button variant="ghost" onClick={() => setShareOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
