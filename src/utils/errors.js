export function friendlyAuthError(err) {
  const raw = err?.message || String(err || 'Unknown error');
  // Weak password / policy errors → provide a friendly, concise message
  if (/password\s+(should|must)\s+contain|password\s+(should|must)\s+be\s+at\s+least|weak password|password too short|invalid password/i.test(raw)) {
    return 'Please choose a stronger password with a mix of uppercase, lowercase, numbers, and symbols (8+ characters recommended).';
  }
  // Supabase leaked/compromised password protection
  if (/leaked password|compromised password|data breach|have i been pwned|pwned/i.test(raw)) {
    return 'This password appears in known data breaches. Please choose a stronger, unique password.';
  }
  if (raw === 'Failed to fetch' || /TypeError: Failed to fetch/i.test(raw)) {
    return `Failed to reach Supabase. Check:
• VITE_SUPABASE_URL is correct (must start with https:// and end with .supabase.co)
• VITE_SUPABASE_ANON_KEY is the anon public key (not service_role)
• Dev server was restarted after editing .env
• No ad-block/VPN/firewall is blocking *.supabase.co
• Supabase Auth → URL Configuration includes your dev URL (http://localhost:5173 or 5174)`;
  }
  return raw;
}
