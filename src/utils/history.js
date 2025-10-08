// REST implementation backed by Flask + MongoDB

export async function logConversion({ userId, fileName, sourceFormat, targetFormat, fileSize, status }) {
  try {
    const res = await fetch('/api/log-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fileName, sourceFormat, targetFormat, fileSize, status })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true };
  } catch (e) {
    console.error('[History] logConversion error', e);
    return { ok: false, error: e.message };
  }
}

export async function fetchUserHistory(userId) {
  try {
    const res = await fetch(`/api/history?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json?.ok) return { ok: true, data: json.data };
    return { ok: false, data: [] };
  } catch (e) {
    console.error('[History] fetchUserHistory error', e);
    return { ok: false, data: [] };
  }
}
