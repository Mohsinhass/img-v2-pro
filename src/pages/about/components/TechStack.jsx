import React from 'react';
import Icon from '../../../components/AppIcon';

const stack = [
  { name: 'React 18', icon: 'Atom', note: 'Concurrent-ready UI layer' },
  { name: 'Vite', icon: 'Bolt', note: 'Ultra-fast dev & build tooling' },
  { name: 'TailwindCSS', icon: 'Wind', note: 'Design tokens & utility styling' },
  { name: 'Canvas API', icon: 'Square', note: 'On-the-fly raster transforms' },
  { name: 'pdfjs-dist', icon: 'FileText', note: 'PDF rasterization (first page)' }
];

const TechStack = () => (
  <section id="tech" className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3">Technology Stack</h2>
          <p className="text-text-secondary leading-relaxed">We choose tools that maximize performance, portability, and future extensibility—favoring native browser capabilities before introducing servers.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stack.map(item => (
          <div key={item.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon name={item.icon} size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary">{item.name}</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
