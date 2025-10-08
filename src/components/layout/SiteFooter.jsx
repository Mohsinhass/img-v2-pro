import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

// Centralized footer link data for easy maintenance
const linkGroups = [
  {
    heading: 'Product',
    links: [
      { label: 'Convert Images', to: '/image-conversion-hub' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Pricing', to: '/premium-features#pricing-section' }
    ]
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Contact Support', to: '/contact' },
      { label: 'Status Page', to: '#' }
    ]
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Terms of Service', to: '/legal/terms' },
      { label: 'Cookie Policy', to: '/legal/cookies' },
      { label: 'GDPR', to: '/legal/gdpr' }
    ]
  }
];

const SiteFooter = () => {
  return (
    <footer className="bg-muted border-t border-border py-12 mt-16" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center" title="Home">
              <img
                src="/img/logo.png"
                alt="Logo"
                className="h-8 w-auto select-none"
                draggable="false"
              />
              <span className="sr-only">Img V2 Pro</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Image conversion & basic editing in your browser. Simple, transparent plan limits.
            </p>
          </div>

          {linkGroups.map(group => (
            <nav key={group.heading} aria-label={group.heading} className="space-y-4">
              <h3 className="font-semibold text-text-primary text-sm tracking-wide">{group.heading}</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                {group.links.map(link => (
                  <li key={link.label}>
                    {link.to.startsWith('http') || link.to === '#' ? (
                      <a href={link.to} className="hover:text-text-primary transition-colors">{link.label}</a>
                    ) : (
                      <Link to={link.to} className="hover:text-text-primary transition-colors">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-text-secondary">© {new Date().getFullYear()} Img V2 Pro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Icon name="Shield" size={14} className="text-accent" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Icon name="Lock" size={14} className="text-accent" />
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
