import React, { useState, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import PreviewPanel from './components/PreviewPanel';
import EditingSidebar from './components/EditingSidebar';
import MobileEditingSheet from './components/MobileEditingSheet';
import EditingHistory from './components/EditingHistory';

import Button from '../../components/ui/Button';

const ImageEditor = () => {
  const navigate = useNavigate();
  const { userId, planId } = usePlan();
  const analytics = (event, data={}) => console.log('[Analytics]', event, { userId, planId, ...data });
  const location = useLocation();
  
  // Get image from navigation state or localStorage
  const [currentImage, setCurrentImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  
  // Editing states
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState(null);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  
  // UI states
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // History management
  const [editingHistory, setEditingHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Mock image data for demonstration
  const mockImages = [
    {
      id: 1,
      name: 'sample-photo.jpg',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      size: '2.4 MB',
      format: 'JPEG',
      dimensions: '1920x1080'
    },
    {
      id: 2,
      name: 'landscape.png',
      src: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=800&h=600&fit=crop',
      size: '3.1 MB',
      format: 'PNG',
      dimensions: '2048x1365'
    }
  ];

  useEffect(() => {
    // Initialize with image from navigation state or mock data
    const imageFromState = location?.state?.image;
    const selectedImage = imageFromState || mockImages?.[0];
    
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        setCurrentImage(img);
        setOriginalImage(img);
        addToHistory('original', 'Original image loaded');
      };
      img.src = selectedImage?.src;
      img.alt = selectedImage?.name;
    }
  }, [location?.state]);

  const addToHistory = (action, description) => {
    const newHistoryItem = {
      action,
      description,
      timestamp: Date.now(),
      state: {
        rotation,
        flipHorizontal,
        flipVertical,
        outputFormat,
        quality
      }
    };

    setEditingHistory(prev => {
      const newHistory = prev?.slice(0, currentHistoryIndex + 1);
      newHistory?.push(newHistoryItem);
      return newHistory;
    });
    setCurrentHistoryIndex(prev => prev + 1);
  };

  const handleRotate = (degrees) => {
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);
    setHasChanges(true);
    addToHistory('rotate', `Rotated ${degrees > 0 ? '+' : ''}${degrees}°`);
  };

  const handleFlip = (direction) => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    addToHistory('flip', `Flipped ${flipHorizontal ? 'un' : ''}horizontally`);
    analytics('flip_horizontal');
    } else {
      setFlipVertical(!flipVertical);
    addToHistory('flip', `Flipped ${flipVertical ? 'un' : ''}vertically`);
    analytics('flip_vertical');
    }
    setHasChanges(true);
  };

  const handleToggleCropMode = () => {
    setCropMode(!cropMode);
    if (!cropMode) {
      // Initialize crop area to center 50% of image
      setCropArea({
        x: 100,
        y: 75,
        width: 600,
        height: 450
      });
    }
  };

  const handleCrop = (aspectRatio) => {
    if (!cropMode) return;
    
    // Apply crop with specified aspect ratio
    let newCropArea = { ...cropArea };
    
    if (aspectRatio) {
      const currentRatio = newCropArea?.width / newCropArea?.height;
      if (currentRatio !== aspectRatio) {
        // Adjust height to match aspect ratio
        newCropArea.height = newCropArea?.width / aspectRatio;
      }
    }
    
    setCropArea(newCropArea);
    setHasChanges(true);
    addToHistory('crop', `Applied ${aspectRatio ? aspectRatio?.toFixed(2) : 'free'} crop`);
  };

  const handleResize = ({ width, height, maintainAspectRatio }) => {
    // In a real implementation, this would resize the image
    setHasChanges(true);
    addToHistory('resize', `Resized to ${width}×${height}px`);
  };

  const handleFormatChange = (format) => {
    setOutputFormat(format);
    setHasChanges(true);
    addToHistory('format', `Changed format to ${format?.toUpperCase()}`);
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    setHasChanges(true);
    addToHistory('quality', `Set quality to ${newQuality}%`);
  };

  const handleApplyChanges = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setHasChanges(false);
    addToHistory('apply', 'Applied all changes');
  };

  const handleReset = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setCropMode(false);
    setCropArea(null);
    setOutputFormat('jpeg');
    setQuality(90);
    setHasChanges(false);
    
    // Reset to original image
    setCurrentImage(originalImage);
    addToHistory('reset', 'Reset to original');
  };

  const handleSaveAndConvert = async () => {
    setIsProcessing(true);
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would trigger download
    const link = document.createElement('a');
    link.download = `edited-image.${outputFormat}`;
    link.href = currentImage?.src || '';
    link?.click();
    
    setIsProcessing(false);
    addToHistory('save', `Saved as ${outputFormat?.toUpperCase()}`);
  };

  const handleHistoryChange = (index) => {
    if (index >= 0 && index < editingHistory?.length) {
      setCurrentHistoryIndex(index);
      const historyState = editingHistory?.[index]?.state;
      
      if (historyState) {
        setRotation(historyState?.rotation);
        setFlipHorizontal(historyState?.flipHorizontal);
        setFlipVertical(historyState?.flipVertical);
        setOutputFormat(historyState?.outputFormat);
        setQuality(historyState?.quality);
      }
      
      setHasChanges(index > 0);
    }
  };

  const handleClearHistory = () => {
    setEditingHistory([editingHistory?.[0]]); // Keep original
    setCurrentHistoryIndex(0);
    handleReset();
  };

  const handleBackToHub = () => {
    navigate('/image-conversion-hub');
  };

  return (
    <>
      <Helmet>
  <title>Image Editor - Img V2 Pro</title>
        <meta name="description" content="Edit and enhance your images with professional tools before conversion. Rotate, flip, crop, resize and adjust quality settings." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header onTabChange={() => {}} />
        
        <main className="pt-16">
          {/* Mobile Header */}
          <div className="md:hidden bg-background border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHub}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Hub
              </Button>
              
              <h1 className="text-lg font-semibold text-text-primary">Image Editor</h1>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileSheetOpen(true)}
                iconName="Edit3"
              >
                Edit
              </Button>
            </div>
          </div>

          <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Desktop Header */}
              <div className="hidden md:flex items-center justify-between bg-background border-b border-border px-6 py-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToHub}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Back to Conversion Hub
                  </Button>
                  
                  <div className="w-px h-6 bg-border"></div>
                  
                  <div>
                    <h1 className="text-xl font-semibold text-text-primary">Image Editor</h1>
                    <p className="text-sm text-text-secondary">
                      Edit your image before conversion
                    </p>
                  </div>
                </div>

                {isProcessing && (
                  <div className="flex items-center space-x-2 text-primary">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                )}
              </div>

              {/* Editor Content */}
              <div className="flex-1 flex">
                {/* Preview Panel */}
                <div className="flex-1 p-4 md:p-6">
                  <PreviewPanel
                    image={currentImage}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    cropMode={cropMode}
                    cropArea={cropArea}
                    onCropAreaChange={setCropArea}
                    rotation={rotation}
                    flipHorizontal={flipHorizontal}
                    flipVertical={flipVertical}
                  />
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                  <EditingSidebar
                    image={currentImage}
                    rotation={rotation}
                    flipHorizontal={flipHorizontal}
                    flipVertical={flipVertical}
                    onRotate={handleRotate}
                    onFlip={handleFlip}
                    cropMode={cropMode}
                    onToggleCropMode={handleToggleCropMode}
                    onCrop={handleCrop}
                    onResize={handleResize}
                    outputFormat={outputFormat}
                    onFormatChange={handleFormatChange}
                    quality={quality}
                    onQualityChange={handleQualityChange}
                    onApplyChanges={handleApplyChanges}
                    onReset={handleReset}
                    onSaveAndConvert={handleSaveAndConvert}
                    hasChanges={hasChanges}
                  />
                </div>
              </div>
            </div>

            {/* Desktop History Panel */}
            <div className="hidden lg:block w-64 border-l border-border p-4">
              <EditingHistory
                history={editingHistory}
                currentIndex={currentHistoryIndex}
                onHistoryChange={handleHistoryChange}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

          {/* Mobile Editing Sheet */}
          <MobileEditingSheet
            isOpen={isMobileSheetOpen}
            onClose={() => setIsMobileSheetOpen(false)}
            image={currentImage}
            rotation={rotation}
            flipHorizontal={flipHorizontal}
            flipVertical={flipVertical}
            onRotate={handleRotate}
            onFlip={handleFlip}
            cropMode={cropMode}
            onToggleCropMode={handleToggleCropMode}
            onCrop={handleCrop}
            onResize={handleResize}
            outputFormat={outputFormat}
            onFormatChange={handleFormatChange}
            quality={quality}
            onQualityChange={handleQualityChange}
            onApplyChanges={handleApplyChanges}
            onReset={handleReset}
            onSaveAndConvert={handleSaveAndConvert}
            hasChanges={hasChanges}
          />

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-background rounded-lg p-6 shadow-xl max-w-sm mx-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h3 className="font-medium text-text-primary">Processing Image</h3>
                    <p className="text-sm text-text-secondary">Applying your changes...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ImageEditor;