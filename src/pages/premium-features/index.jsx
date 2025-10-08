import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import FeatureComparisonTable from './components/FeatureComparisonTable';
import PricingTiers from './components/PricingTiers';
import TrustSignals from './components/TrustSignals';
import FAQSection from './components/FAQSection';
import UpgradePrompt from './components/UpgradePrompt';
import SiteFooter from '../../components/layout/SiteFooter';

const PricePage = () => {
  const location = useLocation();

  // Smooth scroll to pricing section when arriving with hash
  useEffect(() => {
    if (location?.hash === '#pricing-section') {
      // Wait a tick to ensure layout is painted
      requestAnimationFrame(() => {
        const el = document.getElementById('pricing-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, [location]);
  const offers = [
    { id: 'free', name: 'Free', price: 0, billing: 'monthly', description: 'Convert common image formats with basic tools.' },
    { id: 'plus', name: 'Plus', price: 5.99, billing: 'monthly', description: 'Higher batch & file size limits plus crop & resize.' },
    { id: 'pro', name: 'Pro', price: 12.99, billing: 'monthly', description: 'Larger limits and more format outputs for heavy use.' },
    { id: 'enterprise', name: 'Enterprise (Planned)', price: 39.99, billing: 'monthly', description: 'Placeholder for future custom limits & support.' }
  ];

  const offerCatalogJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'ImageConvert Pro Pricing',
    itemListElement: offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      description: o.description,
      price: o.price,
      priceCurrency: 'USD',
      priceValidUntil: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      category: 'SoftwareService',
      url: `https://example.com/premium-features#${o.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Pricing & Plans | ImageConvert Pro</title>
  <meta name="description" content="Compare realistic Free, Plus and Pro image conversion plan limits. Only currently available features listed." />
        <script type="application/ld+json">{JSON.stringify(offerCatalogJSONLD)}</script>
      </Helmet>
      <Header onTabChange={() => {}} />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
                  <Icon name="Crown" size={40} className="text-primary-foreground" />
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6">
                Unlock Premium
                <span className="text-primary block">Image Conversion</span>
              </h1>
              
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                Compare real, currently available plan limits. No exaggerated claims—just the features that work today. 
                <span className="font-medium text-text-primary"> Core conversion stays free.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Sparkles"
                  iconPosition="left"
                  onClick={() => {
                    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Pricing Plans
                </Button>
                
                <Link to="/image-conversion-hub">
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Image"
                    iconPosition="left"
                  >
                    Continue with Free
                  </Button>
                </Link>
              </div>

              {/* Free Forever Badge */}
              <div className="mt-8 inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                <Icon name="Gift" size={16} />
                <span className="text-sm font-medium">Free plan available forever - No credit card required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Compare Plans &amp; Features
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                See exactly what you get with each plan. Upgrade only when you need advanced features.
              </p>
            </div>

            <FeatureComparisonTable />
          </div>
        </section>

        {/* Pricing Section */}
  <section id="pricing-section" className="py-16 lg:py-24 bg-muted/30 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Start free and upgrade when you need more power. All plans include our core conversion features.
              </p>
            </div>

            <PricingTiers />

            {/* Pricing Notes / Disclaimers */}
            <div className="mt-12 text-xs text-text-tertiary space-y-2 max-w-3xl mx-auto leading-relaxed">
              <p><span className="font-medium text-text-secondary">Pricing currency:</span> All prices shown in USD. Local taxes or VAT may apply at checkout depending on your region.</p>
              <p><span className="font-medium text-text-secondary">Annual billing:</span> Annual amounts are displayed as equivalent monthly pricing for comparison. Full annual amount is charged upfront.</p>
              <p><span className="font-medium text-text-secondary">Upgrades & downgrades:</span> You can change plans at any time; credits are prorated automatically where applicable.</p>
              <p><span className="font-medium text-text-secondary">Refund policy:</span> 30‑day money-back guarantee on Plus and Pro annual plans. Enterprise terms governed by service agreement.</p>
              <p><span className="font-medium text-text-secondary">Fair use:</span> Unlimited references are subject to fair usage to protect platform stability.</p>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <FAQSection />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <UpgradePrompt />
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
};

export default PricePage;