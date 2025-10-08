import React from 'react';
import { LegalLayout, Section } from './components/LegalLayout';

const sections = [
  { id: 'scope', title: 'Scope' },
  { id: 'principles', title: 'Principles' },
  { id: 'data-min', title: 'Data Minimization' },
  { id: 'rights', title: 'User Rights' },
  { id: 'future', title: 'Future Enhancements' },
  { id: 'contact', title: 'Contact' }
];

const Gdpr = () => (
  <LegalLayout title="GDPR" description="Overview of alignment goals with EU data protection principles." sections={sections}>
    <Section id="scope" title="Scope">
      <p>This document provides a high-level summary of how the project aims to align with core GDPR concepts. It does not constitute legal advice.</p>
    </Section>
    <Section id="principles" title="Principles">
      <ul>
        <li>Lawfulness & fairness: Minimize collection; avoid hidden profiling.</li>
        <li>Purpose limitation: Only process images for explicit conversion actions.</li>
        <li>Integrity & confidentiality: Prefer local processing to reduce exposure.</li>
      </ul>
    </Section>
    <Section id="data-min" title="Data Minimization">
      <p>No mandatory registration is required. Temporary processing artifacts are discarded and not retained as user profiles.</p>
    </Section>
    <Section id="rights" title="User Rights">
      <p>Because persistent accounts are not yet implemented, typical data export / deletion requests rarely apply. If you submit a form message you may request its deletion via email.</p>
    </Section>
    <Section id="future" title="Future Enhancements">
      <p>Planned improvements include explicit data retention timelines and optional account-based consent management once accounts ship.</p>
    </Section>
    <Section id="contact" title="Contact">
      <p>Email: privacy@imageconvertpro.example</p>
    </Section>
  </LegalLayout>
);

export default Gdpr;