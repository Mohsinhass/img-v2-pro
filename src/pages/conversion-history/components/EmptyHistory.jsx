import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyHistory = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Icon name="History" size={48} className="text-text-secondary" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No Conversion History
        </h3>
        <p className="text-text-secondary mb-8 leading-relaxed">
          You haven't converted any images yet. Start converting your images to see your conversion history here.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/image-conversion-hub">
            <Button
              variant="default"
              size="lg"
              iconName="Upload"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Start Converting Images
            </Button>
          </Link>
          
          <div className="text-sm text-text-secondary">
            <p>Or learn more about our features:</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <Link 
                to="/image-editor" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Image Editor
              </Link>
              <span className="text-border">•</span>
              <Link 
                to="/premium-features" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Premium Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyHistory;