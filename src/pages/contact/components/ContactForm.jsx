import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MIN_DELAY_MS = 800; // basic anti-bot timing

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef(Date.now());
  const honeypotRef = useRef(null);

  const onSubmit = async (data) => {
    // Honeypot check
    if (honeypotRef.current?.value) return; // silently drop
    const elapsed = Date.now() - startRef.current;
    if (elapsed < MIN_DELAY_MS) return; // likely bot

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        // If server isn't configured for email yet, show a friendly message
        const detail = await res.text().catch(() => '');
        throw new Error(detail || 'Send failed');
      }
      setSubmitted(true);
      reset();
    } catch (e) {
      alert('Unable to send message right now. Please try again later.');
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      const t = setTimeout(() => setSubmitted(false), 6000);
      return () => clearTimeout(t);
    }
  }, [isSubmitSuccessful]);

  return (
    <section id="contact-form" className="py-14 px-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">Send a Message</h2>
          <p className="text-text-secondary leading-relaxed mb-6">We typically respond within 1–2 business days. Provide as much context as you comfortably can so we can help faster.</p>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li className="flex items-start space-x-2"><Icon name="Info" size={16} className="text-primary mt-0.5" /><span>For account or security concerns, describe the impact (no sensitive data).</span></li>
            <li className="flex items-start space-x-2"><Icon name="Lightbulb" size={16} className="text-primary mt-0.5" /><span>Feature ideas: explain the underlying problem you’re solving.</span></li>
            <li className="flex items-start space-x-2"><Icon name="AlertTriangle" size={16} className="text-primary mt-0.5" /><span>Bug reports: include browser + steps + expected vs actual result.</span></li>
          </ul>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5 relative" noValidate>
          {submitted && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center px-4">
                <Icon name="CheckCircle" size={40} className="text-success mx-auto mb-3" />
                <p className="font-medium text-text-primary mb-1">Message Sent</p>
                <p className="text-sm text-text-secondary">Thanks for reaching out—we’ll follow up soon.</p>
              </div>
            </div>
          )}
          <input ref={honeypotRef} type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
          <Input
            label="Name"
            required
            placeholder="Your name"
            {...register('name', { required: 'Name is required', maxLength: { value: 120, message: 'Too long' } })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } })}
            error={errors.email?.message}
          />
          <Textarea
            label="Message"
            required
            rows={6}
            placeholder="How can we help?"
            {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Add a little more detail' } })}
            error={errors.message?.message}
          />
          <Button type="submit" size="lg" disabled={isSubmitting} loading={isSubmitting} iconName="Send" iconPosition="left" className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          <p className="text-xs text-text-secondary text-center">We only use this information to reply. No automated mailing lists.</p>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
