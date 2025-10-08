import React, { useCallback, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesSelected, isProcessing, acceptedFormats, uploadStatus }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e?.dataTransfer?.items && e?.dataTransfer?.items?.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => {
      const next = prev - 1;
      if (next <= 0) setIsDragOver(false);
      return next;
    });
  }, [dragCounter]);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e?.dataTransfer?.files);
    // Accept all files matching acceptedFormats
    const accepted = acceptedFormats || [];
    const validFiles = files?.filter(file => {
      const ext = file?.name?.split('.')?.pop()?.toLowerCase();
      return accepted.includes(ext);
    });
    if (validFiles?.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  }, [onFilesSelected]);

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-5 sm:p-8 lg:p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Uploading badge */}
        {uploadStatus?.uploading && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-600 text-white text-xs shadow-sm">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Uploading {uploadStatus?.done || 0}/{uploadStatus?.total || 0}
          </div>
        )}

        {/* Upload Icon */}
        <div className={`
          mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-200
          ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
        `}>
          <Icon 
            name={isDragOver ? "Download" : "Upload"} 
            size={32} 
            strokeWidth={1.5}
          />
        </div>

        {/* Upload Text */}
        <div className="space-y-2 mb-5 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-text-primary">
            {isDragOver ? 'Drop your images here' : 'Upload your images'}
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm lg:text-base">
            Drag and drop your files or click to browse
          </p>
          {uploadStatus?.uploading && (
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-center text-[11px] sm:text-xs text-blue-600 font-medium mb-1">
                Uploading files {uploadStatus?.done ?? 0}/{uploadStatus?.total ?? 0}
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round(((uploadStatus?.done || 0) / Math.max(1, uploadStatus?.total || 1)) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Supported Formats */}
  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {acceptedFormats?.map((format) => (
            <span
              key={format}
              className="px-3 py-1 bg-surface text-text-secondary text-xs font-medium rounded-full border border-border"
            >
              {format?.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Browse Button */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.gif,.heic,.heif,.tiff,.tif,.bmp,.ico"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          <Button
            variant="default"
            size="sm"
            iconName="FolderOpen"
            iconPosition="left"
            disabled={isProcessing}
            className="pointer-events-none"
          >
            Browse Files
          </Button>
        </div>

        {/* No blocking overlay during upload/processing — only the small top-left badge is shown */}
      </div>
      {/* Upload Instructions */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-[10px] sm:text-xs text-text-secondary">
          Maximum file size: 10MB per image • Supported formats: JPG, PNG, SVG, WEBP
        </p>
      </div>
    </div>
  );
};

export default UploadZone;