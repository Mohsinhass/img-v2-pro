import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditingHistory = ({ history, currentIndex, onHistoryChange, onClearHistory }) => {
  if (!history || history?.length === 0) {
    return null;
  }

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history?.length - 1;

  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">History</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="text-xs"
        >
          Clear
        </Button>
      </div>
      {/* Undo/Redo Controls */}
      <div className="flex items-center space-x-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onHistoryChange(currentIndex - 1)}
          disabled={!canUndo}
          className="flex-1"
        >
          <Icon name="Undo" size={14} className="mr-1" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onHistoryChange(currentIndex + 1)}
          disabled={!canRedo}
          className="flex-1"
        >
          <Icon name="Redo" size={14} className="mr-1" />
          Redo
        </Button>
      </div>
      {/* History Timeline */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {history?.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryChange(index)}
            className={`
              w-full text-left px-2 py-1.5 rounded text-xs transition-colors
              ${index === currentIndex 
                ? 'bg-primary text-primary-foreground' 
                : index < currentIndex
                  ? 'bg-muted text-text-secondary' :'text-text-secondary hover:bg-muted'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <Icon 
                name={getActionIcon(item?.action)} 
                size={12} 
                className="flex-shrink-0"
              />
              <span className="truncate">{item?.description}</span>
            </div>
            <div className="text-xs opacity-75 mt-0.5">
              {new Date(item.timestamp)?.toLocaleTimeString()}
            </div>
          </button>
        ))}
      </div>
      {/* History Stats */}
      <div className="mt-3 pt-2 border-t border-border text-xs text-text-secondary">
        Step {currentIndex + 1} of {history?.length}
      </div>
    </div>
  );
};

const getActionIcon = (action) => {
  const iconMap = {
    'rotate': 'RotateCw',
    'flip': 'FlipHorizontal',
    'crop': 'Crop',
    'resize': 'Maximize2',
    'format': 'FileImage',
    'quality': 'Settings',
    'reset': 'RotateCcw',
    'original': 'Image'
  };
  
  return iconMap?.[action] || 'Edit';
};

export default EditingHistory;