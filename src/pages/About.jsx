import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Header from '../components/ui/Header';
import Hero from './about/components/Hero';
import LocalNav from './about/components/LocalNav';
import Mission from './about/components/Mission';
import UseCases from './about/components/UseCases';
import Workflow from './about/components/Workflow';
import FeatureGrid from './about/components/FeatureGrid';
import Accessibility from './about/components/Accessibility';
import Privacy from './about/components/Privacy';
import Compliance from './about/components/Compliance';
import Roadmap from './about/components/Roadmap';
import FAQ from './about/components/FAQ';
import CTA from './about/components/CTA';

const AboutPage = () => {
  const location = useLocation();

  // Smooth-scroll to hash target when arriving from another page (e.g., /about#faq)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // slight delay ensures layout is ready after component mount
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background relative">
      <Helmet>
        <title>About Img V2 Pro - Private Batch Image Conversion & Editing</title>
        <meta name="description" content="Discover how Img V2 Pro helps designers, developers, e-commerce teams and creators streamline image preparation with private, fast batch conversion and lightweight editing." />
        <meta name="keywords" content="image conversion platform, batch image processing, private image tool, browser image editor" />
        <link rel="canonical" href="/about" />
        <script type="application/ld+json">{JSON.stringify({
          '@context':'https://schema.org',
          '@type':'SoftwareApplication',
          name:'Img V2 Pro',
          applicationCategory:'Multimedia',
          operatingSystem:'Any',
          description:'Browser-based private image conversion & batch processing tool with lightweight editing.',
          offers:{'@type':'Offer','price':'0','priceCurrency':'USD'},
          featureList:[
            'Batch image conversion','Lightweight editing tools','Local-first processing','Multiple output formats','Privacy focused design'
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity:[
            { '@type':'Question', name:'Do you store my images?', acceptedAnswer:{ '@type':'Answer', text:'Processing for supported formats occurs locally. For server-assisted conversions, files are handled in-memory only.' }},
            { '@type':'Question', name:'Is there a limit on conversions?', acceptedAnswer:{ '@type':'Answer', text:'Core usage is open; soft protective limits may apply only to preserve stability.' }},
            { '@type':'Question', name:'Can I batch convert large sets?', acceptedAnswer:{ '@type':'Answer', text:'Yes, batch features streamline multi-file workflows with consistent output settings.' }},
            { '@type':'Question', name:'Will more formats be added?', acceptedAnswer:{ '@type':'Answer', text:'Yes, roadmap phases include extended vector and camera raw exploration.' }},
            { '@type':'Question', name:'Is there an API?', acceptedAnswer:{ '@type':'Answer', text:'An API is planned; abstractions are being prepared for safe external access.' }}
          ]
        })}</script>
      </Helmet>
      <Header />
      <Hero />
      <LocalNav />
      <main className="pb-24">
  <Mission />
  <UseCases />
  <Workflow />
  <FeatureGrid />
  <Accessibility />
  <Privacy />
  <Compliance />
  <Roadmap />
  <FAQ />
  <CTA />
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto text-center text-sm text-text-secondary">
            <p>Have questions or feedback? <a href="/contact" className="text-primary hover:underline">Contact us</a>. We iterate based on real user needs.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
