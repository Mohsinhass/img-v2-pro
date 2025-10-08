import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HistoryCard = ({ entry, onRedownload, onDelete, onConvertAgain }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormatIcon = (format) => {
    const icons = {
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'svg': 'FileImage',
      'webp': 'Image'
    };
    return icons?.[format?.toLowerCase()] || 'File';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'processing':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {entry?.thumbnail ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <Image
                src={entry?.thumbnail}
                alt={entry?.originalName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              <Icon 
                name={getFormatIcon(entry?.sourceFormat)} 
                size={24} 
                className="text-text-secondary" 
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary truncate">
                {entry?.originalName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-text-secondary">
                  {entry?.sourceFormat?.toUpperCase()}
                </span>
                <Icon name="ArrowRight" size={12} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">
                  {entry?.targetFormat?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className={`text-xs font-medium ${getStatusColor(entry?.status)}`}>
              {entry?.status === 'completed' && <Icon name="CheckCircle" size={14} className="inline mr-1" />}
              {entry?.status === 'processing' && <Icon name="Clock" size={14} className="inline mr-1" />}
              {entry?.status === 'failed' && <Icon name="XCircle" size={14} className="inline mr-1" />}
              {entry?.status?.charAt(0)?.toUpperCase() + entry?.status?.slice(1)}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
            <span>{formatFileSize(entry?.fileSize)}</span>
            <span>{formatTimestamp(entry?.timestamp)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {entry?.status === 'completed' && (
              <Button
                variant="outline"
                size="xs"
                iconName="Download"
                iconPosition="left"
                onClick={() => onRedownload(entry)}
                className="text-xs"
              >
                Download
              </Button>
            )}
            <Button
              variant="ghost"
              size="xs"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => onConvertAgain(entry)}
              className="text-xs"
            >
              Convert Again
            </Button>
            <Button
              variant="ghost"
              size="xs"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => onDelete(entry)}
              className="text-xs text-error hover:text-error"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;