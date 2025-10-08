import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactFAQTeaser = () => (
  <section className="py-16 px-4 bg-surface/60">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Looking for Quick Answers?</h2>
          <p className="text-text-secondary leading-relaxed">You might find what you need in our overview and common questions. It covers usage basics, privacy posture, and roadmap direction.</p>
        </div>
        <Link to="/about#faq">
          <Button size="lg" iconName="HelpCircle" iconPosition="left">View FAQ</Button>
        </Link>
      </div>
    </div>
  </section>
);

export default ContactFAQTeaser;
