import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpgradePrompt = () => {
  const benefits = [
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'Priority processing queue for instant conversions'
    },
    {
      icon: 'Infinity',
      title: 'No Limits',
      description: 'Unlimited batch size and file conversions'
    },
    {
      icon: 'Sparkles',
      title: 'AI-Powered',
      description: 'Advanced compression with perfect quality'
    },
    {
      icon: 'Cloud',
      title: 'Cloud Storage',
      description: 'Keep your files safe with 50GB storage'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Crown" size={32} className="text-primary-foreground" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Ready to Unlock Premium Features?
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          Join thousands of professionals who've upgraded their image conversion workflow
        </p>
      </div>
      {/* Benefits Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {benefits?.map((benefit, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={benefit?.icon} size={20} className="text-primary" />
              </div>
            </div>
            <h4 className="font-semibold text-text-primary text-sm mb-1">{benefit?.title}</h4>
            <p className="text-xs text-text-secondary">{benefit?.description}</p>
          </div>
        ))}
      </div>
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="default"
          size="lg"
          iconName="Crown"
          iconPosition="left"
          className="w-full sm:w-auto"
          onClick={() => {
            // Scroll to pricing section
            document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Start Free Trial
        </Button>
        
        <Link to="/image-conversion-hub">
          <Button
            variant="outline"
            size="lg"
            iconName="ArrowLeft"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Continue with Free
          </Button>
        </Link>
      </div>
      {/* Trust Signal */}
      <div className="text-center mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} className="text-accent" />
            <span>30-day guarantee</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CreditCard" size={14} className="text-accent" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} className="text-accent" />
            <span>50K+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;