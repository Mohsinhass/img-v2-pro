import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MobileEditingSheet = ({
  isOpen,
  onClose,
  image,
  rotation,
  flipHorizontal,
  flipVertical,
  onRotate,
  onFlip,
  cropMode,
  onToggleCropMode,
  onCrop,
  onResize,
  outputFormat,
  onFormatChange,
  quality,
  onQualityChange,
  onApplyChanges,
  onReset,
  onSaveAndConvert,
  hasChanges
}) => {
  const [activeTab, setActiveTab] = useState('transform');
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'svg', label: 'SVG' }
  ];

  const cropPresets = [
    { label: 'Free', ratio: null },
    { label: '1:1', ratio: 1 },
    { label: '4:3', ratio: 4/3 },
    { label: '16:9', ratio: 16/9 },
    { label: '3:2', ratio: 3/2 }
  ];

  const tabs = [
    { id: 'transform', label: 'Transform', icon: 'RotateCw' },
    { id: 'crop', label: 'Crop', icon: 'Crop' },
    { id: 'resize', label: 'Resize', icon: 'Maximize2' },
    { id: 'format', label: 'Format', icon: 'FileImage' }
  ];

  const handleResizeApply = () => {
    if (resizeWidth && resizeHeight) {
      onResize({
        width: parseInt(resizeWidth),
        height: parseInt(resizeHeight),
        maintainAspectRatio
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl border-t border-border max-h-[80vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Edit Image</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors
                ${activeTab === tab?.id 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} className="mb-1" />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Rotation</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onRotate(-90)}
                    className="flex items-center justify-center py-3"
                  >
                    <Icon name="RotateCcw" size={18} className="mr-2" />
                    -90°
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onRotate(90)}
                    className="flex items-center justify-center py-3"
                  >
                    <Icon name="RotateCw" size={18} className="mr-2" />
                    +90°
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Flip</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={flipHorizontal ? "default" : "outline"}
                    onClick={() => onFlip('horizontal')}
                    className="flex items-center justify-center py-3"
                  >
                    <Icon name="FlipHorizontal" size={18} className="mr-2" />
                    Horizontal
                  </Button>
                  <Button
                    variant={flipVertical ? "default" : "outline"}
                    onClick={() => onFlip('vertical')}
                    className="flex items-center justify-center py-3"
                  >
                    <Icon name="FlipVertical" size={18} className="mr-2" />
                    Vertical
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crop' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary">Crop Tool</h3>
                <Button
                  variant={cropMode ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleCropMode}
                >
                  {cropMode ? 'Exit' : 'Enable'}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Aspect Ratios
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cropPresets?.map((preset) => (
                    <Button
                      key={preset?.label}
                      variant="outline"
                      size="sm"
                      onClick={() => onCrop(preset?.ratio)}
                      disabled={!cropMode}
                      className="text-xs"
                    >
                      {preset?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resize' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Resize Image</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Width"
                  type="number"
                  placeholder="800"
                  value={resizeWidth}
                  onChange={(e) => setResizeWidth(e?.target?.value)}
                />
                <Input
                  label="Height"
                  type="number"
                  placeholder="600"
                  value={resizeHeight}
                  onChange={(e) => setResizeHeight(e?.target?.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aspectRatioMobile"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e?.target?.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="aspectRatioMobile" className="text-sm text-text-secondary">
                  Maintain aspect ratio
                </label>
              </div>

              <Button
                variant="outline"
                onClick={handleResizeApply}
                disabled={!resizeWidth || !resizeHeight}
                fullWidth
              >
                Apply Resize
              </Button>
            </div>
          )}

          {activeTab === 'format' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Output Format</h3>
              
              <Select
                options={formatOptions}
                value={outputFormat}
                onChange={onFormatChange}
                placeholder="Select format"
              />

              {outputFormat !== 'svg' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-secondary">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={quality}
                    onChange={(e) => onQualityChange(parseInt(e?.target?.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Low Quality</span>
                    <span>High Quality</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border p-4 space-y-3">
          <Button
            variant="default"
            onClick={onApplyChanges}
            disabled={!hasChanges}
            fullWidth
            iconName="Check"
            iconPosition="left"
          >
            Apply Changes
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onReset}
              disabled={!hasChanges}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Reset
            </Button>
            
            <Button
              variant="success"
              onClick={onSaveAndConvert}
              disabled={!image}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEditingSheet;