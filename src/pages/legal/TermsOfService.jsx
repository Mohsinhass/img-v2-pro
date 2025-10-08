import React from 'react';
import { LegalLayout, Section } from './components/LegalLayout';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'use', title: 'Acceptable Use' },
  { id: 'accounts', title: 'Accounts & Identity' },
  { id: 'limitations', title: 'Limitations of Liability' },
  { id: 'changes', title: 'Changes to Service' },
  { id: 'termination', title: 'Termination' },
  { id: 'contact', title: 'Contact' }
];

const TermsOfService = () => (
  <LegalLayout title="Terms of Service" description="Conditions for using the application." sections={sections}>
    <Section id="acceptance" title="Acceptance of Terms">
      <p>By accessing or using the application you agree to these terms. If you do not agree, do not use the service.</p>
    </Section>
    <Section id="use" title="Acceptable Use">
      <ul>
        <li>No abusive, illegal, or rights-infringing content.</li>
        <li>No automated scraping or bulk abuse of resources outside published limits.</li>
        <li>Do not attempt to bypass plan limits or security mechanisms.</li>
      </ul>
    </Section>
    <Section id="accounts" title="Accounts & Identity">
      <p>A lightweight anonymous identifier may be generated locally to apply plan rules. This is not a formal user account.</p>
    </Section>
    <Section id="limitations" title="Limitations of Liability">
      <p>The software is provided “as is” without warranties. Liability is limited to the maximum extent permitted by applicable law.</p>
    </Section>
    <Section id="changes" title="Changes to Service">
      <p>Features and limits may evolve. Material changes to core access will be announced in a reasonable manner.</p>
    </Section>
    <Section id="termination" title="Termination">
      <p>We may suspend access for abuse, security risk, or legal compliance. You may cease use at any time.</p>
    </Section>
    <Section id="contact" title="Contact">
      <p>Email: legal@imageconvertpro.example</p>
    </Section>
  </LegalLayout>
);

export default TermsOfService;