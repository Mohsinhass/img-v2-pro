import supabase from '../lib/supabaseClient';

// Storage bucket configuration: default to 'avatars' but allow override via env
const AVATAR_BUCKET = import.meta?.env?.VITE_SUPABASE_AVATAR_BUCKET || 'avatars';
const USER_DATA_BUCKET = import.meta?.env?.VITE_SUPABASE_USER_DATA_BUCKET || 'user-data';

function sanitizeFileName(name) {
  if (!name) return `${Date.now()}`;
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export async function upsertProfile({ id, email, name }) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('profiles')
    .upsert({ id, email, name, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
}

export async function getMyProfile() {
  if (!supabase) throw new Error('Supabase not configured');
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error && error.code !== 'PGRST116') throw error; // ignore not found
  return data || null;
}

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user?.id || null;
}

// Graceful helper: never throws; returns null on any error
async function safeGetUserId() {
  try {
    if (!supabase) return null;
    return await getCurrentUserId();
  } catch {
    return null;
  }
}

// =========================
// Local fallback (no auth)
// =========================
const LOCAL_HISTORY_KEY = 'local_conversion_history_v1';
const LOCAL_THUMBS_KEY = 'local_thumbs_by_rowid_v1';

function setLocalThumb(rowId, dataUrl) {
  try {
    if (!rowId || !dataUrl) return;
    const map = JSON.parse(localStorage.getItem(LOCAL_THUMBS_KEY) || '{}');
    map[String(rowId)] = dataUrl;
    localStorage.setItem(LOCAL_THUMBS_KEY, JSON.stringify(map));
  } catch {}
}

export function getLocalThumb(rowId) {
  try {
    const map = JSON.parse(localStorage.getItem(LOCAL_THUMBS_KEY) || '{}');
    return map ? map[String(rowId)] : undefined;
  } catch {
    return undefined;
  }
}

function appendLocalHistory(entry) {
  try {
    const now = new Date().toISOString();
    const base = Array.isArray(JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]'))
      ? JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]')
      : [];
    const withId = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, created_at: now, ...entry };
    base.unshift(withId);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(base.slice(0, 500)));
    return withId.id;
  } catch {
    return null;
  }
}

export function getLocalConversions(limit = 100, offset = 0) {
  try {
    const arr = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.slice(offset, offset + limit);
  } catch {
    return [];
  }
}

export function clearLocalConversions() {
  try { localStorage.removeItem(LOCAL_HISTORY_KEY); } catch {}
}

function isNumericId(id) {
  return typeof id === 'number' || (/^\d+$/.test(String(id)));
}

function updateLocalConversionMetadata(id, patch) {
  try {
    const arr = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
    if (!Array.isArray(arr)) return null;
    let updated = null;
    const next = arr.map((row) => {
      if (String(row.id) === String(id)) {
        updated = { ...row, ...patch, updated_at: new Date().toISOString() };
        return updated;
      }
      return row;
    });
    if (updated) {
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(next));
    }
    return updated;
  } catch {
    return null;
  }
}

function deleteLocalConversion(id) {
  try {
    const arr = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
    if (!Array.isArray(arr)) return;
    const next = arr.filter((row) => String(row.id) !== String(id));
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(next));
  } catch {}
}

export async function updateProfile(updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  const payload = { ...updates, id: userId, updated_at: new Date().toISOString() };
  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function uploadAvatar(file) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await safeGetUserId();
  if (!userId) throw new Error('Not authenticated');
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'image/*',
  });
  if (upErr) {
    if (String(upErr?.message || '').toLowerCase().includes('bucket')) {
      throw new Error(`Storage bucket '${AVATAR_BUCKET}' not found. Please create it in Supabase (public) or set VITE_SUPABASE_AVATAR_BUCKET to your bucket name.`);
    }
    throw upErr;
  }
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadBanner(file) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await safeGetUserId();
  if (!userId) throw new Error('Not authenticated');
  const ext = file.name.split('.').pop();
  const path = `banners/${userId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'image/*',
  });
  if (upErr) {
    if (String(upErr?.message || '').toLowerCase().includes('bucket')) {
      throw new Error(`Storage bucket '${AVATAR_BUCKET}' not found. Please create it in Supabase (public) or set VITE_SUPABASE_AVATAR_BUCKET to your bucket name.`);
    }
    throw upErr;
  }
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// =========================
// user-data bucket (private)
// =========================
export async function uploadUserInput(file, { subdir = 'inputs' } = {}) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await safeGetUserId();
  if (!userId) throw new Error('Not authenticated');
  const safeName = sanitizeFileName(file.name);
  const path = `${subdir}/${userId}/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from(USER_DATA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'application/octet-stream',
  });
  if (error) {
    if (String(error?.message || '').toLowerCase().includes('bucket')) {
      throw new Error(`Storage bucket '${USER_DATA_BUCKET}' not found. Create it in Supabase or set VITE_SUPABASE_USER_DATA_BUCKET.`);
    }
    throw error;
  }
  return { bucket: USER_DATA_BUCKET, path };
}

export async function getUserInputSignedUrl(path, expiresIn = 3600) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.storage.from(USER_DATA_BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data?.signedUrl || null;
}

export async function deleteUserInput(path) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await safeGetUserId();
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase.storage.from(USER_DATA_BUCKET).remove([path]);
  if (error) throw error;
}

export async function listUserInputs({ subdir = 'inputs', limit = 100, offset = 0 } = {}) {
  if (!supabase) throw new Error('Supabase not configured');
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  const prefix = `${subdir}/${userId}`;
  const { data, error } = await supabase.storage.from(USER_DATA_BUCKET).list(prefix, {
    limit,
    offset,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw error;
  // return paths including the prefix for convenience
  return (data || []).map((obj) => ({ ...obj, path: `${prefix}/${obj.name}` }));
}

export async function logConversion({ file_name, source_format, target_format, file_size, status = 'completed', duration_ms = null, input_path = null, output_path = null, thumbnail_data_url = undefined }) {
  try {
    // If Supabase isn't configured, or user not logged in, fall back to local history
    if (!supabase) {
      return appendLocalHistory({ file_name, source_format, target_format, file_size, status, duration_ms, thumbnail_data_url, input_path, output_path });
    }
    const userId = await safeGetUserId();
    if (!userId) {
      return appendLocalHistory({ file_name, source_format, target_format, file_size, status, duration_ms, thumbnail_data_url, input_path, output_path });
    }
    const basePayload = {
      user_id: userId,
      file_name,
      source_format,
      target_format,
      file_size,
      status,
      duration_ms,
    };
    // Attempt insert including optional path columns first
    const fullPayload = { ...basePayload };
    if (typeof input_path !== 'undefined') fullPayload.input_path = input_path;
    if (typeof output_path !== 'undefined') fullPayload.output_path = output_path;
    let insertRes = await supabase.from('conversion_history').insert(fullPayload).select('id, created_at');
    if (insertRes.error) {
      const msg = String(insertRes.error?.message || '');
      // If the migration for input_path/output_path hasn't been applied yet, retry without them
      if (/column\s+.*(input_path|output_path).*\s+does not exist/i.test(msg)) {
        const retry = await supabase.from('conversion_history').insert(basePayload).select('id, created_at');
        if (retry.error) {
          // Fall back to local if DB insert still fails
          return appendLocalHistory({ file_name, source_format, target_format, file_size, status, duration_ms, thumbnail_data_url, input_path, output_path });
        } else {
          const row = Array.isArray(retry.data) ? retry.data[0] : null;
          if (row?.id && thumbnail_data_url) setLocalThumb(row.id, thumbnail_data_url);
          return row?.id ?? null;
        }
      } else {
        // Any other error: store locally so user still sees history
        return appendLocalHistory({ file_name, source_format, target_format, file_size, status, duration_ms, thumbnail_data_url, input_path, output_path });
      }
    } else {
      const row = Array.isArray(insertRes.data) ? insertRes.data[0] : null;
      if (row?.id && thumbnail_data_url) setLocalThumb(row.id, thumbnail_data_url);
      return row?.id ?? null;
    }
  } catch {
    // Absolute last resort: ensure we never lose the entry
    return appendLocalHistory({ file_name, source_format, target_format, file_size, status, duration_ms, thumbnail_data_url, input_path, output_path });
  }
}

// Convenience: get a signed URL for an input_path stored on a history row
export async function getSignedUrlForInput(path, expiresIn = 3600) {
  if (!path) return null;
  return getUserInputSignedUrl(path, expiresIn);
}

export async function listMyConversions(limit = 50, offset = 0) {
  const userId = supabase ? (await safeGetUserId()) : null;
  const localAll = getLocalConversions(500, 0); // get more to allow a good merge
  // If no Supabase or not logged in, just return local page
  if (!supabase || !userId) {
    return localAll.slice(offset, offset + limit);
  }
  try {
    const { data, error } = await supabase
      .from('conversion_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const dbRows = Array.isArray(data) ? data : [];

    // Build a set of uniqueness keys to avoid duplicates when we also have local copies
    const keyOf = (r) => `${r.created_at || ''}|${r.file_name || ''}|${r.source_format || ''}|${r.target_format || ''}|${r.file_size || ''}`;
    const seen = new Set(dbRows.map(keyOf));

    const merged = [...dbRows];
    for (const lr of localAll) {
      const k = keyOf(lr);
      if (!seen.has(k)) merged.push(lr);
    }

    // Sort by created_at desc (fall back to newest first when missing)
    merged.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });

    // Apply paging
    return merged.slice(offset, offset + limit);
  } catch {
    // On any DB error, show local so the user sees recent activity
    return localAll.slice(offset, offset + limit);
  }
}

export async function deleteConversion(id) {
  const userId = supabase ? (await safeGetUserId()) : null;
  if (!supabase || !userId || !isNumericId(id)) {
    // delete from local fallback
    deleteLocalConversion(id);
    return;
  }
  const { error } = await supabase.from('conversion_history').delete().eq('id', Number(id)).eq('user_id', userId);
  if (error) throw error;
}

export async function clearMyConversions() {
  const userId = supabase ? (await safeGetUserId()) : null;
  if (!supabase || !userId) {
    clearLocalConversions();
    return;
  }
  const { error } = await supabase.from('conversion_history').delete().eq('user_id', userId);
  if (error) throw error;
  // Also clear local cache to keep UI consistent
  clearLocalConversions();
}

export async function updateConversionMetadata(id, { name = null, description = null, tags = null }) {
  const userId = supabase ? (await safeGetUserId()) : null;
  const patch = {};
  if (name !== null) patch.name = name;
  if (description !== null) patch.description = description;
  if (tags !== null) patch.tags = tags;
  patch.updated_at = new Date().toISOString();

  // If we're not authenticated or ID is not numeric (local entry), update local storage instead
  if (!supabase || !userId || !isNumericId(id)) {
    const updated = updateLocalConversionMetadata(id, patch);
    if (!updated) throw new Error('Unable to update local history');
    return updated;
  }

  const { data, error } = await supabase
    .from('conversion_history')
    .update(patch)
    .eq('id', Number(id))
    .eq('user_id', userId)
    .select('*');
  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

// Generic patch for conversion rows (DB or local). Useful to update status/target_format/duration/paths/thumb.
export async function patchConversion(id, patch) {
  const userId = supabase ? (await safeGetUserId()) : null;
  const normalized = { ...patch, updated_at: new Date().toISOString() };

  // If we're not authenticated or ID is not numeric (local entry), update local storage instead
  if (!supabase || !userId || !isNumericId(id)) {
    const updated = updateLocalConversionMetadata(id, normalized);
    if (!updated) throw new Error('Unable to update local history');
    return updated;
  }

  try {
    const { data, error } = await supabase
      .from('conversion_history')
      .update(normalized)
      .eq('id', Number(id))
      .eq('user_id', userId)
      .select('*');
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  } catch (e) {
    // If schema lacks some columns (e.g., input_path/output_path), fall back to safe subset
    const safe = {};
    const allowed = ['status', 'target_format', 'duration_ms', 'name', 'description', 'tags', 'updated_at'];
    for (const k of allowed) { if (k in normalized) safe[k] = normalized[k]; }
    if (Object.keys(safe).length === 0) throw e;
    const { data, error } = await supabase
      .from('conversion_history')
      .update(safe)
      .eq('id', Number(id))
      .eq('user_id', userId)
      .select('*');
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }
}

// =========================
// Sync: move local history into Supabase for signed-in users
// =========================
export async function syncLocalHistoryToSupabase() {
  try {
    if (!supabase) return 0;
    const userId = await safeGetUserId();
    if (!userId) return 0;

    const localAll = getLocalConversions(1000, 0);
    if (!localAll || localAll.length === 0) return 0;

    // Load existing DB rows to build a dedupe set
    const { data: dbData, error } = await supabase
      .from('conversion_history')
      .select('created_at, file_name, source_format, target_format, file_size')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const dbRows = Array.isArray(dbData) ? dbData : [];
    const keyOf = (r) => `${r.created_at || ''}|${r.file_name || ''}|${r.source_format || ''}|${r.target_format || ''}|${r.file_size || ''}`;
    const seen = new Set(dbRows.map(keyOf));

    // Prepare rows that are not in DB
    const toInsert = [];
    for (const lr of localAll) {
      const k = keyOf(lr);
      if (!seen.has(k)) {
        toInsert.push({
          user_id: userId,
          file_name: lr.file_name || null,
          source_format: lr.source_format || null,
          target_format: lr.target_format || null,
          file_size: lr.file_size || null,
          status: lr.status || 'completed',
          duration_ms: lr.duration_ms ?? null,
          created_at: lr.created_at || new Date().toISOString(),
          input_path: lr.input_path || null,
          output_path: lr.output_path || null,
        });
      }
    }
    if (toInsert.length === 0) return 0;

    let inserted = 0;
    const chunkSize = 50;
    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize);
      const { error: insErr } = await supabase.from('conversion_history').insert(chunk);
      if (insErr) {
        // Retry without optional columns if schema doesn’t have them yet
        const msg = String(insErr?.message || '');
        if (/column\s+.*(input_path|output_path).*does not exist/i.test(msg)) {
          const reduced = chunk.map(({ user_id, file_name, source_format, target_format, file_size, status, duration_ms, created_at }) => ({
            user_id, file_name, source_format, target_format, file_size, status, duration_ms, created_at,
          }));
          const { error: retryErr } = await supabase.from('conversion_history').insert(reduced);
          if (!retryErr) inserted += reduced.length;
        }
      } else {
        inserted += chunk.length;
      }
    }

    // Clean up local entries that were attempted to be inserted to avoid duplicates later
    if (inserted > 0) {
      const insertedKeys = new Set(toInsert.map(keyOf));
      const remaining = getLocalConversions(1000, 0).filter((lr) => !insertedKeys.has(keyOf(lr)));
      try { localStorage.setItem('local_conversion_history_v1', JSON.stringify(remaining)); } catch {}
    }

    return inserted;
  } catch {
    return 0;
  }
}
