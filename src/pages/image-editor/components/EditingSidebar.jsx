import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { usePlan } from '../../../context/PlanContext';
import PlanGate from '../../../components/access/PlanGate';

const EditingSidebar = ({
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
  const [activeSection, setActiveSection] = useState('transform');
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const { hasFeature, planId } = usePlan();

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'svg', label: 'SVG' }
  ];

  const cropPresets = [
    { label: 'Free', ratio: null },
    { label: '1:1 Square', ratio: 1 },
    { label: '4:3 Standard', ratio: 4/3 },
    { label: '16:9 Widescreen', ratio: 16/9 },
    { label: '3:2 Photo', ratio: 3/2 }
  ];

  const sections = [
    { id: 'transform', label: 'Transform', icon: 'RotateCw' },
    { id: 'crop', label: hasFeature('cropResize') ? 'Crop' : 'Crop (Plus+)', icon: 'Crop', gated: !hasFeature('cropResize'), feature: 'cropResize' },
    { id: 'resize', label: hasFeature('cropResize') ? 'Resize' : 'Resize (Plus+)', icon: 'Maximize2', gated: !hasFeature('cropResize'), feature: 'cropResize' },
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

  const renderTransformSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-primary">Rotation</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotate(-90)}
          className="flex items-center justify-center"
        >
          <Icon name="RotateCcw" size={16} className="mr-1" />
          -90°
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotate(90)}
          className="flex items-center justify-center"
        >
          <Icon name="RotateCw" size={16} className="mr-1" />
          +90°
        </Button>
      </div>

      <h3 className="text-sm font-medium text-text-primary mt-6">Flip</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={flipHorizontal ? "default" : "outline"}
          size="sm"
          onClick={() => onFlip('horizontal')}
          className="flex items-center justify-center"
        >
          <Icon name="FlipHorizontal" size={16} className="mr-1" />
          H-Flip
        </Button>
        <Button
          variant={flipVertical ? "default" : "outline"}
          size="sm"
          onClick={() => onFlip('vertical')}
          className="flex items-center justify-center"
        >
          <Icon name="FlipVertical" size={16} className="mr-1" />
          V-Flip
        </Button>
      </div>

      <div className="text-xs text-text-secondary mt-4 p-2 bg-muted rounded">
        Current rotation: {rotation}°
        {flipHorizontal && <span className="block">Flipped horizontally</span>}
        {flipVertical && <span className="block">Flipped vertically</span>}
      </div>
    </div>
  );

  const renderCropSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">Crop Tool</h3>
        <Button
          variant={cropMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleCropMode}
          disabled={!hasFeature('cropResize')}
        >
          <Icon name="Crop" size={16} className="mr-1" />
          {cropMode ? 'Exit' : 'Enable'}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">Aspect Ratios</label>
        <div className="grid grid-cols-1 gap-1">
          {cropPresets?.map((preset) => (
            <Button
              key={preset?.label}
              variant="ghost"
              size="sm"
              onClick={() => onCrop(preset?.ratio)}
              disabled={!cropMode || !hasFeature('cropResize')}
              className="justify-start text-xs"
            >
              {preset?.label}
            </Button>
          ))}
        </div>
      </div>

      {cropMode && (
        <div className="text-xs text-primary p-2 bg-primary/10 rounded">
          <Icon name="Info" size={12} className="inline mr-1" />
          Click and drag on the image to define crop area
        </div>
      )}
    </div>
  );

  const renderResizeSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-primary">Resize Image</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Width"
            type="number"
            placeholder="800"
            value={resizeWidth}
            onChange={(e) => setResizeWidth(e?.target?.value)}
            className="text-sm"
            disabled={!hasFeature('cropResize')}
          />
          <Input
            label="Height"
            type="number"
            placeholder="600"
            value={resizeHeight}
            onChange={(e) => setResizeHeight(e?.target?.value)}
            className="text-sm"
            disabled={!hasFeature('cropResize')}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="aspectRatio"
            checked={maintainAspectRatio}
            onChange={(e) => setMaintainAspectRatio(e?.target?.checked)}
            className="rounded border-border"
            disabled={!hasFeature('cropResize')}
          />
          <label htmlFor="aspectRatio" className="text-xs text-text-secondary">
            Maintain aspect ratio
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResizeApply}
          disabled={!resizeWidth || !resizeHeight || !hasFeature('cropResize')}
          fullWidth
        >
          Apply Resize
        </Button>
      </div>
      {image && (
        <div className="text-xs text-text-secondary p-2 bg-muted rounded">
          Original: {image?.naturalWidth} × {image?.naturalHeight}px
        </div>
      )}
    </div>
  );

  const renderFormatSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-primary">Output Format</h3>
      <Select
        options={formatOptions}
        value={outputFormat}
        onChange={onFormatChange}
        placeholder="Select format"
      />
      {outputFormat !== 'svg' && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary">Quality: {quality}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => onQualityChange(parseInt(e?.target?.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}
      <div className="text-xs text-text-secondary p-2 bg-muted rounded">
        <Icon name="Info" size={12} className="inline mr-1" />
        Higher quality = larger file size
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col">
      {/* Section Tabs */}
      <div className="border-b border-border p-4 flex flex-wrap gap-2">
        {sections?.map((section) => (
          <Button
            key={section?.id}
            variant={activeSection === section?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection(section?.id)}
            className="flex items-center justify-center text-xs"
          >
            <Icon name={section?.icon} size={14} className="mr-1" />
            {section?.label}
          </Button>
        ))}
      </div>
      {/* Section Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeSection === 'transform' && renderTransformSection()}
        {activeSection === 'crop' && (
          hasFeature('cropResize') ? renderCropSection() : (
            <PlanGate feature="cropResize" />
          )
        )}
        {activeSection === 'resize' && (
          hasFeature('cropResize') ? renderResizeSection() : (
            <PlanGate feature="cropResize" />
          )
        )}
        {activeSection === 'format' && renderFormatSection()}
      </div>
      {/* Action Buttons */}
      <div className="border-t border-border p-4 space-y-2">
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
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasChanges}
          >
            <Icon name="RotateCcw" size={14} className="mr-1" />
            Reset
          </Button>
          
          <Button
            variant="success"
            size="sm"
            onClick={onSaveAndConvert}
            disabled={!image}
          >
            <Icon name="Download" size={14} className="mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditingSidebar;