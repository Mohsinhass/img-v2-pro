import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversionProgress = ({ 
  totalFiles, 
  completedFiles, 
  currentFile, 
  isProcessing 
}) => {
  if (!isProcessing && completedFiles === 0) return null;

  const progressPercentage = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Icon name="CheckCircle" size={20} className="text-success" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">
            {isProcessing ? 'Converting Images' : 'Conversion Complete'}
          </h3>
          <p className="text-sm text-text-secondary">
            {completedFiles} of {totalFiles} images processed
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            Overall Progress
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isProcessing ? 'bg-primary' : 'bg-success'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current File */}
      {isProcessing && currentFile && (
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              Processing: {currentFile}
            </p>
            <p className="text-xs text-text-secondary">
              Please wait while we convert your image...
            </p>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {!isProcessing && completedFiles > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <div>
            <p className="text-sm font-medium text-success">
              All conversions completed successfully!
            </p>
            <p className="text-xs text-success/80">
              Your images are ready for download
            </p>
          </div>
        </div>
      )}

      {/* Processing Stats */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
        <div className="text-center">
          <p className="text-lg font-semibold text-text-primary">{totalFiles}</p>
          <p className="text-xs text-text-secondary">Total</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">{completedFiles}</p>
          <p className="text-xs text-text-secondary">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-text-secondary">{totalFiles - completedFiles}</p>
          <p className="text-xs text-text-secondary">Remaining</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionProgress;