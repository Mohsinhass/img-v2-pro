import React from 'react';
import Icon from '../../../components/AppIcon';

const faqs = [
  { q: 'Do you store my images?', a: 'For browser-handled formats, processing is local. Where server support is needed (like certain conversions), files are handled in-memory and discarded after the response.' },
  { q: 'Is there a limit on conversions?', a: 'Core usage is open. Reasonable throttling may apply to protect stability, but we aim to avoid arbitrary blockers.' },
  { q: 'Can I batch convert large sets?', a: 'Yes—batch actions streamline multi-file sessions. Future updates will introduce background worker optimization.' },
  { q: 'Will more formats be added?', a: 'Yes. Roadmap phases include extended vector & camera raw format exploration.' },
  { q: 'Is there an API?', a: 'An API is planned; internal abstractions are being shaped for safe externalization.' }
];

const FAQ = () => (
  <section id="faq" className="py-16 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Common Questions</h2>
        <p className="text-text-secondary leading-relaxed">A quick reference for topics people ask most often while exploring the tool.</p>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((f, i) => (
          <details key={f.q} className="group p-4 open:bg-background/50 transition-colors">
            <summary className="flex items-start cursor-pointer list-none">
              <Icon name="HelpCircle" size={18} className="text-primary mt-1" />
              <span className="ml-3 font-medium text-text-primary">{f.q}</span>
              <Icon name="ChevronDown" size={16} className="ml-auto text-text-secondary group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 ml-7 text-sm text-text-secondary leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
