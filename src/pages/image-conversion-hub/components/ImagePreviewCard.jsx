import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ImagePreviewCard = ({ 
  file, 
  preview, 
  onRemove, 
  onFormatChange, 
  onQualityChange, 
  onConvert,
  selectedFormat,
  quality,
  isConverting,
  convertedFile,
  conversionProgress
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isPdf = file?.name?.toLowerCase()?.endsWith('.pdf');
  const ext = file?.name?.split('.')?.pop()?.toLowerCase();
  const isHeif = ext === 'heic' || ext === 'heif';
  const baseFormats = [
    { value: 'jpg', label: 'JPG', description: 'Best for photos' },
    { value: 'png', label: 'PNG', description: 'Best for graphics with transparency' },
    { value: 'webp', label: 'WEBP', description: 'Modern format with better compression' },
    { value: 'svg', label: 'SVG', description: 'Vector format for scalable graphics' },
    { value: 'pdf', label: 'PDF', description: 'Export selected images to a PDF' },
  ];
  const backendFormats = [
    { value: 'tiff', label: 'TIFF', description: 'Lossless (backend conversion)' },
    { value: 'bmp', label: 'BMP', description: 'Bitmap (backend conversion)' },
    { value: 'gif', label: 'GIF', description: 'GIF image (backend conversion)' },
    { value: 'ico', label: 'ICO', description: 'Icon format (backend conversion)' },
  ];
  const formatOptions = isPdf
    ? [
        { value: 'jpg', label: 'JPG', description: 'Rasterize first page to JPG' },
        { value: 'png', label: 'PNG', description: 'Rasterize first page to PNG' }
      ]
    : isHeif
    ? [...baseFormats, ...backendFormats]
    : [...baseFormats, ...backendFormats];

  const qualityOptions = [
    { value: 100, label: 'Maximum (100%)', description: 'Highest quality, largest file' },
    { value: 90, label: 'High (90%)', description: 'Great quality, good balance' },
    { value: 80, label: 'Good (80%)', description: 'Good quality, smaller file' },
    { value: 70, label: 'Medium (70%)', description: 'Medium quality, much smaller' },
    { value: 50, label: 'Low (50%)', description: 'Lower quality, smallest file' }
  ];

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getOriginalFormat = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    return extension?.toUpperCase();
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile?.url;
      link.download = convertedFile?.name;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4 elevation-1">
      {/* Image Preview */}
      <div className="relative">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt={file?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Remove Button */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 w-8 h-8"
          onClick={onRemove}
          disabled={isConverting}
        >
          <Icon name="X" size={16} />
        </Button>

        {/* Format Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-background/90 text-text-primary text-xs font-medium rounded border border-border">
            {getOriginalFormat(file?.name)}
          </span>
        </div>
      </div>
      {/* File Info */}
      <div className="space-y-2">
        <h4 className="font-medium text-text-primary truncate" title={file?.name}>
          {file?.name}
        </h4>
        <p className="text-sm text-text-secondary">
          {getFileSize(file?.size)}
        </p>
      </div>
      {/* Conversion Controls */}
      <div className="space-y-3">
        {/* Format Selection */}
        <Select
          label="Convert to"
          options={formatOptions}
          value={selectedFormat}
          onChange={onFormatChange}
          disabled={isConverting}
          className="w-full"
        />

        {/* Advanced Options Toggle */}
        <Button
          variant="ghost"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between"
        >
          Advanced Options
        </Button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-border">
            <Select
              label="Quality"
              options={qualityOptions}
              value={quality}
              onChange={onQualityChange}
              disabled={isConverting || selectedFormat === 'svg' || selectedFormat === 'pdf'}
              className="w-full"
            />
            
            {(selectedFormat === 'svg' || selectedFormat === 'pdf') && (
              <p className="text-xs text-text-secondary">
                Quality settings don't apply to SVG/PDF format
              </p>
            )}
          </div>
        )}
      </div>
      {/* Conversion Progress */}
      {isConverting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Converting...</span>
            <span className="text-sm text-text-secondary">{conversionProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${conversionProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex gap-2">
        {convertedFile ? (
          <Button
            variant="success"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownload}
            className="flex-1"
          >
            Download
          </Button>
        ) : (
          <Button
            variant="default"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onConvert}
            disabled={isConverting || !selectedFormat}
            loading={isConverting}
            className="flex-1"
          >
            {isPdf && (selectedFormat === 'jpg' || selectedFormat === 'png') ? 'Convert (PDF→Image)' : selectedFormat === 'pdf' ? 'Export to PDF' : 'Convert'}
          </Button>
        )}
      </div>
      {/* Conversion Success */}
      {convertedFile && (
        <div className="flex items-center space-x-2 p-2 bg-success/10 rounded-lg">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm text-success font-medium">
            Converted successfully!
          </span>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewCard;