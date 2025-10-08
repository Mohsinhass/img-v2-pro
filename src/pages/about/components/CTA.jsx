import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CTA = () => (
  <section id="get-started" className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Ready to Try Img V2 Pro?</h2>
      <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">Jump into the conversion hub or explore premium capabilities—your workflow upgrade starts now.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/image-conversion-hub">
          <Button size="lg" iconName="Upload" iconPosition="left">Open Converter</Button>
        </Link>
        <Link to="/premium-features">
          <Button variant="outline" size="lg" iconName="Crown" iconPosition="left">View Premium</Button>
        </Link>
      </div>
      <div className="mt-8 inline-flex items-center space-x-2 text-xs text-text-secondary">
        <Icon name="Shield" size={14} />
        <span>No sign-up needed for core features</span>
      </div>
    </div>
  </section>
);

export default CTA;
