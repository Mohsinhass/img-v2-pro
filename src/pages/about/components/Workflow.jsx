import React from 'react';
import Icon from '../../../components/AppIcon';

const steps = [
  { title: 'Add Files', icon: 'Upload', text: 'Drag in images or browse securely—nothing stored beyond the session.' },
  { title: 'Adjust & Refine', icon: 'Sliders', text: 'Optional edits like rotation, format change, and quality adjustments keep control simple.' },
  { title: 'Batch Convert', icon: 'Layers', text: 'Process one or many with consistent output preferences.' },
  { title: 'Download Instantly', icon: 'Download', text: 'Results are available immediately—no email gates or queue delays.' },
];

const Workflow = () => (
  <section id="workflow" className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Typical Flow</h2>
        <p className="text-text-secondary leading-relaxed">A straightforward sequence keeps creative energy focused on outcomes—not tool overhead.</p>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
        {steps.map((s, idx) => (
          <li key={s.title} className="relative bg-card border border-border rounded-xl p-5" aria-posinset={idx+1} aria-setsize={steps.length}>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shadow">{idx+1}</div>
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
              <Icon name={s.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{s.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Workflow;
