import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureComparisonTable = () => {
  const features = [
    {
      category: 'Limits',
      items: [
        { feature: 'Batch Size', free: '10 files', plus: '100 files', pro: 'Higher (manual)', enterprise: 'Planned' },
        { feature: 'File Size', free: '25MB', plus: '150MB', pro: '500MB', enterprise: 'Planned' }
      ]
    },
    {
      category: 'Formats',
      items: [
        { feature: 'Common (JPG, PNG, WEBP)', free: 'Yes', plus: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { feature: 'Extra (SVG output)', free: '—', plus: 'Yes', pro: 'Yes', enterprise: 'Planned' },
        { feature: 'PDF Export (batch)', free: '—', plus: '—', pro: 'Yes', enterprise: 'Planned' }
      ]
    },
    {
      category: 'Editing',
      items: [
        { feature: 'Rotate / Flip', free: 'Yes', plus: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { feature: 'Crop & Resize', free: '—', plus: 'Yes', pro: 'Yes', enterprise: 'Planned' }
      ]
    },
    // History category removed
    {
      category: 'Support',
      items: [
        { feature: 'Support', free: 'Community', plus: 'Basic', pro: 'Priority (email)', enterprise: 'Planned' }
      ]
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Feature Comparison</h3>
        <p className="text-sm text-text-secondary mt-1">See how plans scale as your needs grow</p>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 font-medium text-text-primary">Feature</th>
              {['Free','Plus','Pro','Enterprise'].map((label) => (
                <th key={label} className="text-center py-4 px-6 font-medium text-text-primary">
                  <div className="flex items-center justify-center space-x-2">
                    {label === 'Free' && <Icon name="Gift" size={16} className="text-accent" />}
                    {label === 'Plus' && <Icon name="Star" size={16} className="text-primary" />}
                    {label === 'Pro' && <Icon name="Crown" size={16} className="text-warning" />}
                    {label === 'Enterprise' && <Icon name="Shield" size={16} className="text-secondary" />}
                    <span>{label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features?.map((category) => (
              <React.Fragment key={category?.category}>
                <tr className="bg-muted/50">
                  <td colSpan={5} className="py-3 px-6 font-medium text-text-primary text-sm">
                    {category?.category}
                  </td>
                </tr>
                {category?.items?.map((item, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 text-text-primary font-medium">{item?.feature}</td>
                    <td className="py-4 px-6 text-center text-text-secondary">{item?.free}</td>
                    <td className="py-4 px-6 text-center text-primary font-medium">{item?.plus}</td>
                    <td className="py-4 px-6 text-center text-primary font-medium">{item?.pro}</td>
                    <td className="py-4 px-6 text-center text-primary font-medium">{item?.enterprise}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Accordion Style */}
      <div className="md:hidden space-y-4 p-4">
        {features?.map((category) => (
          <div key={category?.category} className="space-y-3">
            <h4 className="font-semibold text-text-primary text-sm bg-muted px-3 py-2 rounded-lg">
              {category?.category}
            </h4>
            {category?.items?.map((item, idx) => (
              <div key={idx} className="bg-surface rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-text-primary">{item?.feature}</h5>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Gift" size={12} className="text-accent" />
                      <span className="font-medium text-text-secondary">Free</span>
                    </div>
                    <p className="text-text-secondary">{item?.free}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-primary" />
                      <span className="font-medium text-text-secondary">Plus</span>
                    </div>
                    <p className="text-primary font-medium">{item?.plus}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Crown" size={12} className="text-warning" />
                      <span className="font-medium text-text-secondary">Pro</span>
                    </div>
                    <p className="text-primary font-medium">{item?.pro}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Shield" size={12} className="text-secondary" />
                      <span className="font-medium text-text-secondary">Ent</span>
                    </div>
                    <p className="text-primary font-medium">{item?.enterprise}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureComparisonTable;