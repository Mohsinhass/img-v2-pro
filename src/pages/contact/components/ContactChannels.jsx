import React from 'react';
import Icon from '../../../components/AppIcon';

const channels = [
  { icon: 'Mail', title: 'Email', detail: '', note: 'General inquiries & assistance' },
  { icon: 'Bug', title: 'Issue Report', detail: 'Report a bug via form', note: 'Attach reproduction details' },
  { icon: 'Shield', title: 'Security', detail: '', note: 'Responsible disclosure welcome' },
];

const ContactChannels = () => (
  <section id="channels" className="py-14 px-4">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">Direct Channels</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {channels.map(c => (
          <div key={c.title} className="bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-3">
              <Icon name={c.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{c.title}</h3>
            <p className="text-sm text-text-secondary">{c.detail}</p>
            <p className="text-xs text-text-secondary mt-2 opacity-80">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ContactChannels;
