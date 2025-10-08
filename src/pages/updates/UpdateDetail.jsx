import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import { getUpdateBySlug } from './data';

const UpdateDetail = () => {
  const { slug } = useParams();
  const entry = getUpdateBySlug(slug);

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 px-4 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-text-primary">Update not found</h1>
          <p className="mt-3 text-text-secondary">We couldn't find that update. It may have been moved.</p>
          <Link to="/updates" className="inline-flex items-center mt-6 text-primary hover:underline">
            ← Back to Updates
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 px-4 max-w-3xl mx-auto">
        <Link to="/updates" className="inline-flex items-center text-primary hover:underline mb-4">
          ← Back to Updates
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">{entry.title}</h1>
            </div>
            <Icon name="Sparkles" size={20} className="text-primary" />
          </div>
          <ul className="mt-4 list-disc pl-6 text-sm text-text-secondary space-y-1">
            {entry.items?.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
          <div className="prose max-w-none mt-6 prose-p:leading-relaxed prose-headings:text-text-primary prose-p:text-text-secondary">
            {/* Render trusted HTML content. If content is user-provided, sanitize first. */}
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateDetail;
