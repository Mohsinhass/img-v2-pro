import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewPanel = ({ 
  image, 
  zoom, 
  onZoomChange, 
  cropMode, 
  cropArea, 
  onCropAreaChange,
  rotation,
  flipHorizontal,
  flipVertical 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200];

  useEffect(() => {
    if (image && canvasRef?.current) {
      drawImage();
    }
  }, [image, zoom, rotation, flipHorizontal, flipVertical, panOffset]);

  const drawImage = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    
    if (!image || !ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      // Save context state
      ctx?.save();
      
      // Move to center
      ctx?.translate(canvas?.width / 2, canvas?.height / 2);
      
      // Apply transformations
      ctx?.rotate((rotation * Math.PI) / 180);
      ctx?.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      ctx?.scale(zoom / 100, zoom / 100);
      
      // Apply pan offset
      ctx?.translate(panOffset?.x, panOffset?.y);
      
      // Draw image centered
      ctx?.drawImage(img, -img?.width / 2, -img?.height / 2);
      
      // Restore context state
      ctx?.restore();
      
      // Draw crop overlay if in crop mode
      if (cropMode && cropArea) {
        drawCropOverlay(ctx);
      }
    };
    img.src = image?.src;
  };

  const drawCropOverlay = (ctx) => {
    const canvas = canvasRef?.current;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx?.fillRect(0, 0, canvas?.width, canvas?.height);
    
    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out';
    ctx?.fillRect(cropArea?.x, cropArea?.y, cropArea?.width, cropArea?.height);
    ctx.globalCompositeOperation = 'source-over';
    
    // Crop border
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx?.setLineDash([5, 5]);
    ctx?.strokeRect(cropArea?.x, cropArea?.y, cropArea?.width, cropArea?.height);
    ctx?.setLineDash([]);
    
    // Corner handles
    const handleSize = 8;
    const handles = [
      { x: cropArea?.x - handleSize/2, y: cropArea?.y - handleSize/2 },
      { x: cropArea?.x + cropArea?.width - handleSize/2, y: cropArea?.y - handleSize/2 },
      { x: cropArea?.x - handleSize/2, y: cropArea?.y + cropArea?.height - handleSize/2 },
      { x: cropArea?.x + cropArea?.width - handleSize/2, y: cropArea?.y + cropArea?.height - handleSize/2 }
    ];
    
    ctx.fillStyle = '#2563EB';
    handles?.forEach(handle => {
      ctx?.fillRect(handle?.x, handle?.y, handleSize, handleSize);
    });
  };

  const handleMouseDown = (e) => {
    if (!cropMode) {
      setIsDragging(true);
      setDragStart({ x: e?.clientX, y: e?.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !cropMode) {
      const deltaX = e?.clientX - dragStart?.x;
      const deltaY = e?.clientY - dragStart?.y;
      setPanOffset(prev => ({
        x: prev?.x + deltaX * 0.5,
        y: prev?.y + deltaY * 0.5
      }));
      setDragStart({ x: e?.clientX, y: e?.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    const currentIndex = zoomLevels?.indexOf(zoom);
    if (currentIndex < zoomLevels?.length - 1) {
      onZoomChange(zoomLevels?.[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels?.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(zoomLevels?.[currentIndex - 1]);
    }
  };

  const handleFitToScreen = () => {
    onZoomChange(100);
    setPanOffset({ x: 0, y: 0 });
  };

  if (!image) {
    return (
      <div className="flex-1 bg-surface rounded-lg border-2 border-dashed border-border flex items-center justify-center">
        <div className="text-center">
          <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Image Selected</h3>
          <p className="text-text-secondary">
            Upload an image from the conversion hub to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= zoomLevels?.[0]}
          className="h-8 w-8"
        >
          <Icon name="ZoomOut" size={16} />
        </Button>
        
        <span className="text-sm font-medium text-text-primary min-w-[3rem] text-center">
          {zoom}%
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= zoomLevels?.[zoomLevels?.length - 1]}
          className="h-8 w-8"
        >
          <Icon name="ZoomIn" size={16} />
        </Button>
        
        <div className="w-px h-4 bg-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitToScreen}
          className="text-xs"
        >
          Fit
        </Button>
      </div>
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-4 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="max-w-full max-h-full border border-border rounded shadow-sm"
          style={{ cursor: cropMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      {/* Crop Mode Indicator */}
      {cropMode && (
        <div className="absolute top-4 right-4 z-10 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
          <Icon name="Crop" size={14} className="inline mr-1" />
          Crop Mode
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;