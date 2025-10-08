// Central updates data so list and detail share a single source.
// Each entry should have: slug, date (YYYY-MM-DD), title, summary, and content (HTML-safe JSX string or array).

export const updates = [
  {
    slug: 'contact-form-email-sending-2025-10-07',
    date: '2025-10-07',
    title: 'Contact form email sending',
    summary: 'Backend endpoint added to forward contact messages and improved form UX.',
    items: [
      'Added backend endpoint to forward contact messages to your inbox.',
      'Form now shows a success overlay after sending.'
    ],
    content: `
      <p>We added a new backend endpoint (<code>/api/contact/send</code>) that forwards messages from the contact form directly to your inbox using SMTP. Configure <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code>, <code>CONTACT_FROM_EMAIL</code> and <code>CONTACT_TO_EMAIL</code> on the server.</p>
      <p>The contact form now displays a friendly success overlay after sending, and clearer error messages if delivery fails.</p>
    `
  },
  {
    slug: 'conversion-history-improvements-2025-10-06',
    date: '2025-10-06',
    title: 'Conversion History improvements',
    summary: 'Immediate logging and patching after conversion; HEIC previews fixed and download button added.',
    items: [
      'History now logs uploads immediately and patches after conversion.',
      'HEIC previews fixed in Profile and Download button added.'
    ],
    content: `
      <p>We improved how conversion history is recorded. Uploads are logged immediately, then details are patched after processing finishes. This ensures you always see your latest uploads in the Profile page.</p>
      <p>We also fixed HEIC thumbnail previews and added a convenient Download button for converted files.</p>
    `
  }
];

export function getUpdateBySlug(slug) {
  return updates.find((u) => u.slug === slug);
}
