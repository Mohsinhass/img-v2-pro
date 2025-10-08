import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqs = [
    {
      question: 'What happens to my files after conversion?',
      answer: `All files are automatically deleted from our servers within 24 hours of upload. For premium users with cloud storage, files are stored securely in your personal account and can be managed through your dashboard. You have full control over your data and can delete files at any time.`
    },
    {
      question: 'Can I cancel my premium subscription anytime?',
      answer: `Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your current billing period. We also offer a 30-day money-back guarantee for new subscribers.`
    },
    {
      question: 'Is there a limit to how many files I can convert?',
      answer: `Free users can convert up to 10 files per batch with a 25MB size limit per file. Premium users have unlimited batch conversion with up to 500MB per file (Enterprise: unlimited file size). There are no daily or monthly conversion limits for any plan.`
    },
    {
      question: 'Do you offer API access for developers?',
      answer: `Yes! Enterprise plan includes REST API access with 10,000 calls per month. Our API supports all conversion formats and features available in the web interface. Comprehensive documentation and SDKs are provided for popular programming languages.`
    },
    {
      question: 'What payment methods do you accept?',
      answer: `We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe with 256-bit SSL encryption.`
    },
    {
      question: 'How does the AI-powered compression work?',
      answer: `Our premium AI compression analyzes each image to determine the optimal compression settings while preserving visual quality. It can reduce file sizes by 40-70% compared to standard compression while maintaining professional quality standards.`
    },
    {
      question: 'Can I use premium features for commercial projects?',
      answer: `Absolutely! All premium plans include commercial usage rights. You can use ImageConvert Pro for client work, commercial projects, and business purposes. Enterprise plans also include white-label options for agencies.`
    },
    {
      question: 'What kind of support do you provide?',
      answer: `Free users receive community support through our help center. Pro users get email support with 24-hour response time. Enterprise customers receive priority phone support with dedicated account management and SLA guarantees.`
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems?.has(index)) {
      newOpenItems?.delete(index);
    } else {
      newOpenItems?.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Frequently Asked Questions</h3>
        <p className="text-sm text-text-secondary mt-1">Everything you need to know about our premium features</p>
      </div>
      <div className="divide-y divide-border">
        {faqs?.map((faq, index) => {
          const isOpen = openItems?.has(index);
          return (
            <div key={index} className="transition-all duration-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left hover:bg-muted/30 transition-colors focus:outline-none focus:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-text-primary pr-4">{faq?.question}</h4>
                  <Icon
                    name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                    size={20}
                    className={`text-text-secondary transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              {isOpen && (
                <div className="px-6 pb-4">
                  <div className="text-text-secondary text-sm leading-relaxed pl-0">
                    {faq?.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Contact Support */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-text-primary">Still have questions?</h4>
            <p className="text-sm text-text-secondary">Our support team is here to help</p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="mailto:support@imageconvertpro.com"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name="Mail" size={16} />
              <span className="text-sm font-medium">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;