import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactHero = () => (
  <section className="pt-28 pb-12 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border text-xs font-medium mb-6">
        <Icon name="MessageCircle" size={14} className="text-primary" />
        <span>Support • Feedback • Partnerships</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">Get in Touch</h1>
      <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-2xl mx-auto">We're here to help with product questions, feature ideas, integration discussions, or anything else you want to explore.</p>
    </div>
  </section>
);

export default ContactHero;
