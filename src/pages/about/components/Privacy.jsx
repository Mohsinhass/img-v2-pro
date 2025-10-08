import React from 'react';
import Icon from '../../../components/AppIcon';

const Privacy = () => (
  <section id="privacy" className="py-16 px-4 bg-surface/60">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3">Privacy & Data Handling</h2>
  <p className="text-text-secondary max-w-2xl leading-relaxed">We architect features to minimize data exposure. Most conversions happen locally in your browser. If any feature requires server assistance in the future, files will be processed in-memory and never archived.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: 'Lock', title: 'Local-first', text: 'Browser-based transforms reduce server transfer requirements.' },
          { icon: 'EyeOff', title: 'No Tracking Pixels', text: 'We don’t inject hidden beacons or sell behavioral data.' },
          { icon: 'Server', title: 'Ephemeral Processing', text: 'Server-assisted conversions never persist beyond the request.' }
        ].map(card => (
          <div key={card.title} className="bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
              <Icon name={card.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{card.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-8">Full policy coming soon. Meanwhile, contact us for clarifications.</p>
    </div>
  </section>
);

export default Privacy;
