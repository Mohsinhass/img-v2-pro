import React from 'react';
import Header from '../../..//components/ui/Header';
import SiteFooter from '../../../components/layout/SiteFooter';

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-xl font-semibold text-text-primary mb-3" id={`${id}-heading`}>{title}</h2>
    <div className="prose prose-sm max-w-none text-text-secondary dark:prose-invert leading-relaxed">
      {children}
    </div>
  </section>
);

const LegalLayout = ({ title, description, sections, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
              {description && <p className="text-sm text-text-secondary leading-relaxed">{description}</p>}
            </div>
            {sections && (
              <nav aria-label="On-page navigation" className="sticky top-24">
                <ul className="space-y-2 text-sm">
                  {sections.map(s => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-text-secondary hover:text-text-primary transition-colors inline-block py-1">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>

          {/* Content */}
          <div className="md:col-span-3 space-y-10">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export { LegalLayout, Section };
