import React from 'react';
import Icon from '../../../components/AppIcon';

const cases = [
  { icon: 'Palette', title: 'Design Teams', text: 'Quickly prepare marketing assets, social banners, and UI mocks without leaving the browser.' },
  { icon: 'Code', title: 'Developers', text: 'Optimize images for web delivery, generate alternate formats, and test visual variants.' },
  { icon: 'Store', title: 'E‑commerce', text: 'Standardize product photos, convert supplier files, and reduce weight for faster storefronts.' },
  { icon: 'Camera', title: 'Photographers', text: 'Produce lightweight previews while preserving originals and export batches for clients.' },
  { icon: 'Sparkles', title: 'Content Creators', text: 'Turn raw captures into platform-ready assets in seconds.' },
  { icon: 'Briefcase', title: 'Agencies', text: 'Centralize a consistent workflow for mixed file formats from multiple clients.' },
];

const UseCases = () => (
  <section id="use-cases" className="py-16 px-4 bg-surface/60">
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Who Benefits</h2>
        <p className="text-text-secondary leading-relaxed">Img V2 Pro adapts to distinct real-world workflows—removing friction when preparing, standardizing, and sharing visual assets.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(c => (
          <article key={c.title} className="bg-card border border-border rounded-xl p-5" aria-label={c.title}>
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
              <Icon name={c.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{c.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{c.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default UseCases;
