import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureHighlights = () => {
  const features = [
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'Convert images instantly with our optimized processing engine'
    },
    {
      icon: 'Shield',
      title: 'Secure & Private',
      description: 'All processing happens in your browser. Your files never leave your device'
    },
    {
      icon: 'Infinity',
      title: 'Unlimited Usage',
      description: 'Convert as many images as you want, completely free without restrictions'
    },
    {
      icon: 'Layers',
      title: 'Batch Processing',
      description: 'Convert multiple images at once to save time and effort'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile'
    },
    {
      icon: 'Download',
      title: 'Easy Download',
      description: 'Download individual files or get all converted images in one click'
    }
  ];

  return (
    <div className="bg-surface rounded-xl p-6 lg:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
          Why Choose ImageConvert Pro?
        </h2>
        <p className="text-text-secondary text-lg">
          Professional image conversion made simple and accessible for everyone
        </p>
      </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon 
                name={feature?.icon} 
                size={24} 
                className="text-primary" 
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary mb-1">
                {feature?.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-success" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Smartphone" size={16} className="text-primary" />
            <span>Works on all devices</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-accent" />
            <span>Instant downloads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureHighlights;