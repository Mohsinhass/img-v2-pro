export async function convertHeicOnServer(
  file,
  format = 'jpg',
  options = {}
) {
  // heif-convert FastAPI expects format/quality/exif/name as query params and the file as form-data
  const { quality = 90, exif = true, name = '' } = options || {};
  const params = new URLSearchParams();
  if (format) params.set('format', format);
  if (typeof quality === 'number') params.set('quality', String(quality));
  if (typeof exif === 'boolean') params.set('exif', String(exif));
  if (name) params.set('name', name);

  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`/api/convert?${params.toString()}`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Server error ${res.status}: ${text?.slice(0, 200)}`);
  }
  const blob = await res.blob();
  const ext = format === 'jpeg' ? 'jpg' : format;
  return { blob, ext };
}
