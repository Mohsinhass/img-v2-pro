import React from 'react';
import { LegalLayout, Section } from './components/LegalLayout';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'what', title: 'What Are Cookies' },
  { id: 'usage', title: 'How We Use Them' },
  { id: 'control', title: 'Control & Opt-Out' },
  { id: 'changes', title: 'Changes' },
  { id: 'contact', title: 'Contact' }
];

const CookiePolicy = () => (
  <LegalLayout title="Cookie Policy" description="Information about limited cookie usage." sections={sections}>
    <Section id="overview" title="Overview">
      <p>This site currently makes minimal or no use of tracking cookies. Core functionality does not depend on marketing trackers.</p>
    </Section>
    <Section id="what" title="What Are Cookies">
      <p>Cookies are small text files stored by your browser. They can help remember preferences or session state.</p>
    </Section>
    <Section id="usage" title="How We Use Them">
      <ul>
        <li>Potential preference storage (theme, interface density).</li>
        <li>Temporary session indicators for rate limiting (non-personal).</li>
      </ul>
    </Section>
    <Section id="control" title="Control & Opt-Out">
      <p>You can clear or block cookies in your browser settings. The application will still function for core conversion tasks.</p>
    </Section>
    <Section id="changes" title="Changes">
      <p>Material changes to cookie usage will update this page with an effective date.</p>
    </Section>
    <Section id="contact" title="Contact">
      <p>Email: privacy@imageconvertpro.example</p>
    </Section>
  </LegalLayout>
);

export default CookiePolicy;