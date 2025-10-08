import React from 'react';
import Icon from '../../../components/AppIcon';

const links = [
  { id: 'mission', label: 'Mission' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'features', label: 'Features' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'trust', label: 'Trust' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'faq', label: 'FAQ' },
  { id: 'get-started', label: 'Get Started' },
];

const LocalNav = () => {
  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="sticky top-16 z-20 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
        <ul className="flex items-center gap-6 py-3 text-sm">
          <li className="flex items-center pr-2 text-text-secondary">
            <Icon name="Compass" size={16} className="text-primary" />
            <span className="ml-2 font-medium">Explore</span>
          </li>
          {links.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                className="text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default LocalNav;
