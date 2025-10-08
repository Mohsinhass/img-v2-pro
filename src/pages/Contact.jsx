import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/ui/Header';
import ContactHero from './contact/components/ContactHero';
import ContactChannels from './contact/components/ContactChannels';
import ContactForm from './contact/components/ContactForm';
import ContactFAQTeaser from './contact/components/ContactFAQTeaser';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Img V2 Pro - Support, Feedback & Partnership</title>
        <meta name="description" content="Reach the Img V2 Pro team for support, feature ideas, partnerships or security concerns. Typical response within 1–2 business days." />
        <link rel="canonical" href="/contact" />
        <script type="application/ld+json">{JSON.stringify({
          '@context':'https://schema.org',
            '@type':'ContactPage',
            name:'Img V2 Pro Contact',
            about:'Support and inquiry page for Img V2 Pro image conversion platform',
            mainEntityOfPage:'/contact'
        })}</script>
      </Helmet>
      <Header />
      <ContactHero />
      <main>
        <ContactChannels />
        <ContactForm />
        <ContactFAQTeaser />
      </main>
    </div>
  );
};

export default ContactPage;
