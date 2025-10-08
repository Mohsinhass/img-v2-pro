import React from 'react';
import Icon from '../../../components/AppIcon';

const Hero = () => (
  <section id="top" className="pt-28 pb-16 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent px-4">
    <div className="max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border text-xs font-medium mb-6">
        <Icon name="Image" size={14} className="text-primary" />
        <span>Fast • Private • Free Core Tools</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
        About <span className="text-primary">Img V2 Pro</span>
      </h1>
      <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-3xl mx-auto">
        A privacy‑first, high‑performance image conversion & editing platform built for creators, teams, and businesses.
        No ads. No clutter. Just powerful tools.
      </p>
    </div>
  </section>
);

export default Hero;
