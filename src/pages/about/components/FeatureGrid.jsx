import React from 'react';
import Icon from '../../../components/AppIcon';

const FEATURES = [
  { icon: 'Zap', title: 'Fast by Design', desc: 'Vite + Web Workers (coming) keep conversions smooth—even for large batches.' },
  { icon: 'Shield', title: 'Privacy-First', desc: 'Processing happens locally for supported formats. No silent uploads.' },
  { icon: 'Layers', title: 'Batch Power', desc: 'Convert dozens of images with unified or per-item settings.' },
  { icon: 'Cpu', title: 'Modern Stack', desc: 'React 18, Tailwind, Canvas APIs, and future WASM support.' },
  { icon: 'Crop', title: 'Built-In Editing', desc: 'Rotate, flip, crop, resize—with more pixel tools on the way.' },
  { icon: 'Code', title: 'API Ready', desc: 'Planned REST + WASM modules for CI/CD and automation.' },
];

const FeatureGrid = () => (
  <section id="features" className="py-16 px-4 bg-surface/60">
    <div className="max-w-6xl mx-auto">
      <div className="md:flex md:items-end md:justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">What Sets Us Apart</h2>
          <p className="text-text-secondary mt-2">Speed, clarity, and practicality—without compromise.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(f => (
          <div key={f.title} className="group relative bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Icon name={f.icon} size={22} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2 text-lg">{f.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
