import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Icon from '../components/AppIcon';
import { updates as entries } from './updates/data';

const Updates = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Updates</h1>
        <p className="text-text-secondary mb-8">New features and improvements. We post noteworthy changes here.</p>
        <div className="space-y-6">
          {entries.map((e) => (
            <div key={e.slug} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</div>
                  <h2 className="text-xl font-semibold text-text-primary mt-1">
                    <Link to={`/updates/${e.slug}`} className="hover:underline">
                      {e.title}
                    </Link>
                  </h2>
                </div>
                <Icon name="Sparkles" size={20} className="text-primary" />
              </div>
              <ul className="mt-3 list-disc pl-6 text-sm text-text-secondary space-y-1">
                {e.items.map((i, idx) => (<li key={idx}>{i}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Updates;
