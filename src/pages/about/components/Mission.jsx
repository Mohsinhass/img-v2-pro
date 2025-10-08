import React from 'react';

const Mission = () => (
  <section id="mission" className="py-16 px-4">
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 items-start">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold text-text-primary mb-3">Our Mission</h2>
        <div className="h-1 w-14 bg-primary rounded" />
      </div>
      <div className="md:col-span-2 space-y-5 text-text-secondary leading-relaxed">
        <p>
          We believe professional-grade image tooling should be <span className="text-text-primary font-medium">accessible, transparent, and respectful of user privacy</span>. Img V2 Pro removes friction for designers, developers, marketers, and everyday users who just need things to work—quickly.
        </p>
        <p>
          Instead of locking essential features behind paywalls or pushing intrusive ads, we deliver a clean core experience and reserve optional advanced capabilities for a sustainable premium tier.
        </p>
        <p>
          Our roadmap focuses on <span className="text-text-primary font-medium">speed, offline capability, edge processing, team collaboration, and extensibility</span> via modular pipelines.
        </p>
      </div>
    </div>
  </section>
);

export default Mission;
