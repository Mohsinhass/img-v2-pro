import React from 'react';
import { LegalLayout, Section } from './components/LegalLayout';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'data-we-collect', title: 'Data We Collect' },
  { id: 'local-processing', title: 'Local Processing' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'third-parties', title: 'Third Parties' },
  { id: 'data-rights', title: 'Your Rights' },
  { id: 'contact', title: 'Contact' }
];

const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How we handle and minimize data collection."
      sections={sections}
    >
      <Section id="intro" title="Introduction">
        <p>This policy explains what limited information is handled when you use the application. We aim to keep processing local in your browser whenever technically feasible.</p>
      </Section>
      <Section id="data-we-collect" title="Data We Collect">
        <ul>
          <li>Basic usage events (anonymous) for improving stability.</li>
          <li>Temporary file data during conversion when a server format is required. This is discarded after processing.</li>
          <li>Optional messages you submit via the contact form.</li>
        </ul>
      </Section>
      <Section id="local-processing" title="Local Processing">
        <p>Supported image transformations (rotate, flip, some format changes) run locally in the browser using Canvas or similar APIs. This keeps files from leaving your device for those operations.</p>
      </Section>
      <Section id="cookies" title="Cookies">
        <p>We currently do not set marketing cookies. A minimal preference cookie may be added in the future for things like remembering interface settings.</p>
      </Section>
      <Section id="third-parties" title="Third Parties">
        <p>No third-party ad networks are integrated. If analytics is enabled, it is limited to aggregate event counts without personal identifiers.</p>
      </Section>
      <Section id="data-rights" title="Your Rights">
        <p>If you have concerns about data handling you may contact us. Because we avoid persistent account storage in this phase, most data is ephemeral.</p>
      </Section>
      <Section id="contact" title="Contact">
        <p>Email: privacy@imageconvertpro.example</p>
      </Section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;