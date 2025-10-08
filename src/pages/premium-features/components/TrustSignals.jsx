import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your files are protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'Files are automatically deleted after 24 hours'
    },
    {
      icon: 'Award',
      title: 'SOC 2 Compliant',
      description: 'Meets enterprise security standards'
    },
    {
      icon: 'Users',
      title: '2M+ Users',
      description: 'Trusted by professionals worldwide'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'UX Designer at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      content: `ImageConvert Pro has streamlined our design workflow significantly. The batch processing and API integration saved us hours every week.`,
      rating: 5
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      content: `The premium compression algorithms are incredible. My images are 40% smaller with no visible quality loss. Worth every penny!`,
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'E-commerce Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      content: `We process thousands of product images monthly. The enterprise plan's automation features are a game-changer for our team.`,
      rating: 5
    }
  ];

  const stats = [
    {
      value: '2M+',
      label: 'Files Converted',
      icon: 'Image'
    },
    {
      value: '50K+',
      label: 'Happy Users',
      icon: 'Users'
    },
    {
      value: '99.9%',
      label: 'Uptime',
      icon: 'Activity'
    },
    {
      value: '24/7',
      label: 'Support',
      icon: 'MessageCircle'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={badge?.icon} size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm">{badge?.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Statistics */}
      <div className="bg-muted rounded-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-text-primary mb-2">Trusted by Professionals</h3>
          <p className="text-text-secondary">Join thousands of users who rely on ImageConvert Pro daily</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">{stat?.value}</div>
              <div className="text-sm text-text-secondary">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-text-primary mb-2">What Our Users Say</h3>
          <p className="text-text-secondary">Real feedback from professionals using ImageConvert Pro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card rounded-xl p-6 border border-border">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial?.rating)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                "{testimonial?.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="font-medium text-text-primary text-sm">{testimonial?.name}</div>
                  <div className="text-xs text-text-secondary">{testimonial?.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
        <div className="flex items-start">
          <Icon name="Shield" size={20} className="text-accent mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-text-primary mb-2">Your Security is Our Priority</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              All file processing happens securely in your browser or on our encrypted servers. We never store your original files permanently, and all data is automatically purged after processing. Our infrastructure is SOC 2 compliant and regularly audited for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;