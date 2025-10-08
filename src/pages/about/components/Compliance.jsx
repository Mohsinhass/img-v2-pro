import React from 'react';
import Icon from '../../../components/AppIcon';

const Compliance = () => (
  <section id="trust" className="py-16 px-4 bg-surface/60">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Trust & Assurance</h2>
        <p className="text-text-secondary leading-relaxed">We design operational practices that respect user intent and minimize unnecessary retention. Formal certifications are staged for future phases; until then, we apply pragmatic safeguards.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: 'ShieldCheck', title: 'Principled Handling', text: 'Processing-driven usage only—no silent secondary re-use.' },
          { icon: 'Clock', title: 'Ephemeral Lifecycle', text: 'Temporary buffers cleared after conversion completes.' },
          { icon: 'Info', title: 'Transparency Focus', text: 'Roadmap publicly communicates upcoming privacy-impacting features.' },
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
      <p className="text-xs text-text-secondary mt-8">Questions? Reach out via the contact page—feedback guides our prioritization.</p>
    </div>
  </section>
);

export default Compliance;
