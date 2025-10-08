import React from 'react';
import Icon from '../../../components/AppIcon';

const phases = [
  { phase: 'Now', items: ['Stability & bug fixes', 'Improved batch concurrency', 'Local history persistence'] },
  { phase: 'Next', items: ['Web Worker pipeline', 'True crop & resize rendering', 'Download queue management'] },
  { phase: 'Planned', items: ['Multi-page PDF handling', 'CLI / API bundle', 'Team workspaces'] }
];

const Roadmap = () => (
  <section id="roadmap" className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3">Product Roadmap</h2>
          <p className="text-text-secondary max-w-xl leading-relaxed">A transparent look at where we are investing to bring more capability while keeping the core fast and clean.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {phases.map(col => (
          <div key={col.phase} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Flag" size={18} className="text-primary" />
              <h3 className="font-semibold text-text-primary">{col.phase}</h3>
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              {col.items.map(item => (
                <li key={item} className="flex items-start space-x-2">
                  <Icon name="ChevronRight" size={14} className="mt-0.5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-8">Timelines are directional and may adjust based on community feedback.</p>
    </div>
  </section>
);

export default Roadmap;
