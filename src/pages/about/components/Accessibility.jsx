import React from 'react';
import Icon from '../../../components/AppIcon';

const points = [
  { icon: 'Keyboard', title: 'Keyboard Friendly', text: 'Core interactive elements follow predictable focus order & visible outlines.' },
  { icon: 'Eye', title: 'Readable Contrast', text: 'Color tokens aim for WCAG-compliant contrast in primary surfaces.' },
  { icon: 'MonitorSmartphone', title: 'Responsive Layout', text: 'Interfaces adapt fluidly to mobile, tablet, and large desktop screens.' },
  { icon: 'Globe', title: 'International Ready', text: 'Copy structured for future localization and RTL adaptations.' },
];

const Accessibility = () => (
  <section id="accessibility" className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Inclusive Experience</h2>
        <p className="text-text-secondary leading-relaxed">We treat usability as a continuous responsibility. Improvements roll out iteratively based on real usage and feedback.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map(p => (
          <div key={p.title} className="bg-card border border-border rounded-xl p-5" aria-label={p.title}>
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
              <Icon name={p.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{p.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Accessibility;
