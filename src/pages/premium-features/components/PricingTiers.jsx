import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingTiers = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Core converter for personal use',
      price: { monthly: 0, annual: 0 },
      badge: 'Free',
      badgeColor: 'bg-accent text-accent-foreground',
      bestFor: 'Trying it out',
      features: [
        'Convert common formats (JPG, PNG, WEBP)',
        'Up to 10 files per batch',
        '25MB max per file',
        'Rotate & flip tools',
  // history removed
      ],
      limitations: [
        'No crop / resize',
        'Limited batch size'
      ],
      cta: 'Current Plan',
      ctaVariant: 'outline',
      popular: false
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'Higher limits for frequent use',
      price: { monthly: 5.99, annual: 4.49 },
      badge: 'Popular',
      badgeColor: 'bg-primary/90 text-primary-foreground',
      bestFor: 'Regular users',
      features: [
        'All Free features',
        'Up to 100 files per batch',
        '150MB max per file',
        'Crop & resize tools',
        'Basic quality slider'
      ],
      limitations: [
        'No advanced features'
      ],
      cta: 'Upgrade to Plus',
      ctaVariant: 'default',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For heavy personal or small team use',
      price: { monthly: 12.99, annual: 9.99 },
      badge: 'Best Value',
      badgeColor: 'bg-primary text-primary-foreground',
      bestFor: 'Power users',
      features: [
        'All Plus features',
        'Larger limits (500MB)',
        'Bigger batch size (practical upper limit)',
        'More format outputs',
  // history removed
      ],
      limitations: [
        'No cloud storage',
        'No API'
      ],
      cta: 'Get Pro',
      ctaVariant: 'default',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom limits & support (future)',
      price: { monthly: 39.99, annual: 32.99 },
      badge: 'Planned',
      badgeColor: 'bg-secondary text-secondary-foreground',
      bestFor: 'Future roadmap',
      features: [
        'Placeholder – not yet available'
      ],
      limitations: [
        'Not currently offered'
      ],
      cta: 'Contact Us',
      ctaVariant: 'outline',
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    switch (planId) {
      case 'free':
        return; // no action
      case 'plus':
        console.log('Initiate Plus upgrade flow');
        // TODO: integrate payment modal / checkout
        break;
      case 'pro':
        console.log('Initiate Pro trial / subscription flow');
        // TODO: integrate payment modal / checkout
        break;
      case 'enterprise':
        window.open('mailto:sales@imageconvertpro.com?subject=Enterprise Plan Inquiry', '_blank');
        break;
      default:
        break;
    }
  };

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleFeatureCount = 6; // show first N then collapse

  return (
    <div className="space-y-10">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-muted p-1 rounded-lg flex items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              billingCycle === 'monthly' ?'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              billingCycle === 'annual' ?'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>
      {/* Pricing Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans?.map((plan) => (
          <div
            key={plan?.id}
            className={`relative bg-card rounded-xl border-2 p-6 transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/50 outline-none ${
              plan?.popular ? 'border-primary shadow-md scale-[1.015]' : 'border-border'
            }`}
            tabIndex={0}
            aria-label={`${plan?.name} plan card`}
          >
            {/* Badge */}
            {plan?.badge && (
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${plan?.badgeColor}`}>
                {plan?.badge}
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-text-primary mb-1">{plan?.name}</h3>
              <p className="text-xs uppercase tracking-wide text-text-tertiary mb-3">{plan?.bestFor}</p>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">{plan?.description}</p>
              
              {/* Price */}
              <div className="mb-4">
                {plan?.price?.[billingCycle] === 0 ? (
                  <div className="text-3xl font-bold text-text-primary">Free</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-text-primary">
                      ${plan?.price?.[billingCycle]}
                      <span className="text-lg font-normal text-text-secondary">/mo</span>
                    </div>
                    {billingCycle === 'annual' ? (
                      <div className="text-xs text-text-secondary flex flex-col space-y-1">
                        <span>Billed annually ${(plan?.price?.annual * 12)?.toFixed(2)}/yr</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">You save {(100 - (plan?.price?.annual / plan?.price?.monthly) * 100).toFixed(0)}%</span>
                      </div>
                    ) : (
                      <div className="text-xs text-text-tertiary">Switch to annual and save</div>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan?.ctaVariant}
                fullWidth
                onClick={() => handlePlanSelect(plan?.id)}
                disabled={plan?.id === 'free'}
                className="mb-6"
              >
                {plan?.cta}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary mb-3 flex items-center">
                  <Icon name="Check" size={16} className="text-accent mr-2" />
                  What's included
                </h4>
                <ul className="space-y-2" aria-label={`${plan?.name} included features`}>
                  {(expanded[plan?.id] ? plan?.features : plan?.features.slice(0, visibleFeatureCount))?.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Icon name="Check" size={14} className="text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan?.features.length > visibleFeatureCount && (
                  <button
                    onClick={() => toggleExpand(plan?.id)}
                    className="mt-3 text-xs font-medium text-primary hover:underline"
                    aria-expanded={!!expanded[plan?.id]}
                    aria-controls={`features-${plan?.id}`}
                  >
                    {expanded[plan?.id] ? 'Show less' : `Show all ${plan?.features.length}`}
                  </button>
                )}
              </div>

              {/* Limitations */}
              {plan?.limitations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-text-primary mb-3 flex items-center">
                    <Icon name="X" size={16} className="text-destructive mr-2" />
                    Limitations
                  </h4>
                  <ul className="space-y-2">
                    {plan?.limitations?.map((limitation, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Icon name="X" size={14} className="text-destructive mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/60 rounded-lg p-4 text-xs">
        <div className="space-y-1">
          <p className="font-medium text-text-primary">Batch Size</p>
          <p className="text-text-secondary">10 / 100 / Higher / Planned</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-text-primary">File Size</p>
          <p className="text-text-secondary">25MB / 150MB / 500MB / Planned</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-text-primary">Formats</p>
          <p className="text-text-secondary">Core / +SVG / +More / Planned</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-text-primary">Support</p>
          <p className="text-text-secondary">Comm / Basic / Email / Planned</p>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center bg-muted rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Transparent & realistic roadmap</h3>
        <p className="text-text-secondary text-sm">We only list what exists today. Enterprise & advanced capabilities are placeholders for future development.</p>
      </div>
    </div>
  );
};

export default PricingTiers;