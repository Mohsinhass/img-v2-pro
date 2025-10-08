import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BatchControls = ({ 
  files, 
  onBatchConvert, 
  onBatchDownload, 
  onClearAll,
  batchFormat,
  onBatchFormatChange,
  batchQuality,
  onBatchQualityChange,
  isProcessing,
  convertedFiles
}) => {
  const formatOptions = [
    { value: 'jpg', label: 'JPG', description: 'Best for photos' },
    { value: 'png', label: 'PNG', description: 'Best for graphics with transparency' },
    { value: 'webp', label: 'WEBP', description: 'Modern format with better compression' },
    { value: 'svg', label: 'SVG', description: 'Vector format for scalable graphics' },
    { value: 'pdf', label: 'PDF', description: 'Export all images as a PDF' },
    // Backend-only output formats
    { value: 'tiff', label: 'TIFF', description: 'Lossless (backend conversion)' },
    { value: 'bmp', label: 'BMP', description: 'Bitmap (backend conversion)' },
    { value: 'gif', label: 'GIF', description: 'Animated/legacy (backend conversion)' },
    { value: 'ico', label: 'ICO', description: 'Icon format (backend conversion)' }
  ];

  const qualityOptions = [
    { value: 100, label: 'Maximum (100%)' },
    { value: 90, label: 'High (90%)' },
    { value: 80, label: 'Good (80%)' },
    { value: 70, label: 'Medium (70%)' },
    { value: 50, label: 'Low (50%)' }
  ];

  const hasFiles = files?.length > 0;
  const hasConvertedFiles = convertedFiles?.length > 0;
  const allConverted = hasFiles && convertedFiles?.length === files?.length;

  if (!hasFiles) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Batch Processing
          </h3>
          <p className="text-sm text-gray-600">
            {files?.length} image{files?.length !== 1 ? 's' : ''} ready for conversion
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Trash2"
          iconPosition="left"
          onClick={onClearAll}
          disabled={isProcessing}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear All
        </Button>
      </div>
      {/* Batch Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Convert all to"
          options={formatOptions}
          value={batchFormat}
          onChange={onBatchFormatChange}
          disabled={isProcessing}
          placeholder="Select format"
        />

        <Select
          label="Quality"
          options={qualityOptions}
          value={batchQuality}
          onChange={onBatchQualityChange}
          disabled={isProcessing || batchFormat === 'svg' || batchFormat === 'pdf'}
          placeholder="Select quality"
        />
      </div>
      {/* Quality Note */}
      {batchFormat === 'svg' && (
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
          <Icon name="Info" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            Quality settings don't apply to SVG format
          </span>
        </div>
      )}
      {batchFormat === 'pdf' && (
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
          <Icon name="Info" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            Converts all selected images to a single PDF file
          </span>
        </div>
      )}
      {/* Action Buttons with Black variant */}
      <div className="flex flex-col sm:flex-row gap-3">
        {allConverted ? (
          <Button
            variant="black"
            size="lg"
            iconName="Download"
            iconPosition="left"
            onClick={onBatchDownload}
            className="flex-1"
          >
            Download All ({convertedFiles?.length})
          </Button>
        ) : (
          <Button
            variant="black"
            size="lg"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onBatchConvert}
            disabled={isProcessing || !batchFormat}
            loading={isProcessing}
            className="flex-1"
          >
            Convert All Images
          </Button>
        )}

        {hasConvertedFiles && !allConverted && (
          <Button
            variant="outline"
            size="lg"
            iconName="Download"
            iconPosition="left"
            onClick={onBatchDownload}
            className="flex-1 sm:flex-none border-black text-black hover:bg-gray-50"
          >
            Download Ready ({convertedFiles?.length})
          </Button>
        )}
      </div>
      {/* Progress Summary */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Processing batch...
            </span>
            <span className="text-sm text-text-secondary">
              {convertedFiles?.length} of {files?.length} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(convertedFiles?.length / files?.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Conversion Stats */}
      {hasConvertedFiles && (
        <div className="flex items-center space-x-4 p-3 bg-success/10 rounded-lg">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <div>
            <p className="text-sm font-medium text-success">
              {convertedFiles?.length} image{convertedFiles?.length !== 1 ? 's' : ''} converted successfully
            </p>
            <p className="text-xs text-success/80">
              Ready for download
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchControls;