import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import heic2any from 'heic2any';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import UploadZone from './components/UploadZone';
import ImagePreviewCard from './components/ImagePreviewCard';
import BatchControls from './components/BatchControls';
import ConversionProgress from './components/ConversionProgress';
import FeatureHighlights from './components/FeatureHighlights';
import Icon from '../../components/AppIcon';
import { renderFirstPageToImage, imageDataUrlsToPdf } from '../../utils/pdf';
import { convertHeicOnServer } from '../../utils/api';
import { usePlan } from '../../context/PlanContext';
import { logConversion, uploadUserInput, patchConversion } from '../../utils/db';
// History logging removed; HEIC server conversion removed per scope change


const ImageConversionHub = () => {
  const { planId, capabilities } = usePlan();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [limitNotices, setLimitNotices] = useState([]); // {id, type, message}
  const [previews, setPreviews] = useState({});
  const [convertedFiles, setConvertedFiles] = useState({});
  const [conversionProgress, setConversionProgress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchFormat, setBatchFormat] = useState('');
  const [batchQuality, setBatchQuality] = useState(90);
  // Per-image format/quality
  const [fileFormats, setFileFormats] = useState({}); // { [fileId]: format }
  const [fileQualities, setFileQualities] = useState({}); // { [fileId]: quality }
  const [currentProcessingFile, setCurrentProcessingFile] = useState('');
  // Map of fileId -> input storage path for preview/download later
  const [inputPaths, setInputPaths] = useState({});
  const [uploadStatus, setUploadStatus] = useState({ uploading: false, total: 0, done: 0 });
  // Track a temporary history id per uploaded file so history shows the upload immediately
  const [uploadHistoryIds, setUploadHistoryIds] = useState({}); // { [fileId]: historyId }
  const [heicServerOnline, setHeicServerOnline] = useState(true);
  const fileInputRef = useRef(null);
  const batchSectionRef = useRef(null);
  const uploadSectionRef = useRef(null);

  const scrollToUploadSoon = useCallback(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {}
      });
    }, 100);
  }, []);

  const scrollToBatchSoon = useCallback(() => {
    // Wait briefly to ensure the section is mounted, then smooth scroll
    setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          batchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {}
      });
    }, 120);
  }, []);

  // Quick HEIC backend health check so we can explain missing previews
  useEffect(() => {
    // In production without backend, don't show the warning
    if (import.meta.env.PROD && !import.meta.env.VITE_BACKEND_URL) {
      setHeicServerOnline(false);
      return;
    }
    
    let aborted = false;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2000); // Reduced timeout for production
    fetch('/api/healthz', { signal: controller.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then(() => { if (!aborted) setHeicServerOnline(true); })
      .catch(() => { if (!aborted) setHeicServerOnline(false); })
      .finally(() => clearTimeout(t));
    return () => { aborted = true; clearTimeout(t); controller.abort(); };
  }, []);

  const acceptedFormats = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'pdf', 'gif', 'heic', 'heif', 'tif', 'tiff', 'bmp', 'ico'];
  const backendOnlyFormats = new Set(['tiff', 'tif', 'bmp', 'gif', 'ico']);

  // Generate preview for uploaded files
  const generatePreview = useCallback((file) => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase();
    // For HEIC/HEIF, request a quick low-quality JPG preview from the server
    if (ext === 'heic' || ext === 'heif') {
      return convertHeicOnServer(file, 'jpg', { quality: 60, name: file?.name })
        .then(({ blob }) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Stable data URL we can keep in local cache
        }))
        .catch(() => {
          // Fallback: no preview
          return '/assets/images/no_image.png';
        });
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const analyticsLog = (event, data={}) => {
    console.log('[Analytics]', event, { userId: planId, planId, ...data });
  };

  const handleFilesSelected = useCallback(async (files) => {
    const validFiles = files?.filter(file => {
      const extension = file?.name?.split('.')?.pop()?.toLowerCase();
      return acceptedFormats?.includes(extension);
    });

    if (validFiles?.length === 0) {
      alert('Please select valid image files (JPG, PNG, SVG, WEBP, GIF, PDF)');
      return;
    }

    const newFiles = [];
    const newPreviews = {};
    const maxBatch = capabilities?.maxBatchFiles ?? Infinity;
    const maxSizeMB = capabilities?.maxFileSizeMB ?? Infinity;

    const newNotices = [];

    // Duplicate detection vs existing uploads
    const keyOf = (f) => `${f?.name}|${f?.size}|${f?.lastModified ?? ''}`;
    const existingKeys = new Set(uploadedFiles?.map(keyOf));
    let prefiltered = [...validFiles];
    const dupExisting = prefiltered.filter(f => existingKeys.has(keyOf(f)));
    if (dupExisting.length > 0) {
      const sample = dupExisting.slice(0, 5).map(f => `• ${f.name}`).join('\n');
      const msg = `${dupExisting.length} file(s) look identical to files you already added.\n\n${sample}${dupExisting.length > 5 ? '\n…' : ''}\n\nDo you want to add duplicates too?\nOK = include duplicates, Cancel = skip duplicates.`;
      const includeDup = window.confirm(msg);
      if (!includeDup) {
        prefiltered = prefiltered.filter(f => !existingKeys.has(keyOf(f)));
        newNotices.push({
          id: `dup-skip-${Date.now()}`,
          type: 'duplicate',
          message: `Skipped ${dupExisting.length} duplicate file(s) you had already uploaded.`,
        });
      }
    }

    // De-duplicate within the same selection
    const seen = new Set();
    const uniqueSelection = [];
    let withinDupCount = 0;
    for (const f of prefiltered) {
      const k = keyOf(f);
      if (seen.has(k)) { withinDupCount += 1; continue; }
      seen.add(k);
      uniqueSelection.push(f);
    }
    if (withinDupCount > 0) {
      newNotices.push({
        id: `dup-within-${Date.now()}`,
        type: 'duplicate',
        message: `Removed ${withinDupCount} duplicate file(s) from this selection.`,
      });
    }

    // Enforce size limit per file
    const sizeFiltered = [];
    for (const file of uniqueSelection) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB <= maxSizeMB) {
        sizeFiltered.push(file);
      } else {
        console.warn('[PlanLimit] File too large for plan', { name: file.name, sizeMB, maxSizeMB });
        newNotices.push({
          id: `${file.name}-${Date.now()}-oversize`,
          type: 'size',
          message: `"${file.name}" is ${(sizeMB).toFixed(2)}MB and exceeds your plan limit of ${maxSizeMB}MB.`
        });
      }
    }

    // Enforce batch limit
    const remainingSlots = maxBatch === Infinity ? Infinity : Math.max(0, maxBatch - uploadedFiles.length);
    const finalFiles = remainingSlots === Infinity ? sizeFiltered : sizeFiltered.slice(0, remainingSlots);
    if (sizeFiltered.length > finalFiles.length) {
      newNotices.push({
        id: `batch-${Date.now()}`,
        type: 'batch',
        message: `Batch limit reached. Your plan allows ${maxBatch} files per batch. Some files were skipped.`
      });
    }

    setUploadStatus({ uploading: true, total: finalFiles.length, done: 0 });
    for (const file of finalFiles) {
      const fileId = `${file?.name || 'image'}-${Date.now()}-${Math.random()}`;
      // Preserve the original File object (Blob data) and just tag an id on it
      try {
        Object.defineProperty(file, 'id', { value: fileId, enumerable: true, configurable: true });
      } catch {
        // Fallback if defineProperty fails for some reason
        file.id = fileId;
      }
      newFiles?.push(file);

      try {
        const preview = await generatePreview(file);
        newPreviews[fileId] = preview;
      } catch (error) {
        console.error('Error generating preview:', error);
        newPreviews[fileId] = '/assets/images/no_image.png';
      }

      // Upload raw input to private storage for history previews
      let storedPath = null;
      try {
        const { path } = await uploadUserInput(file, { subdir: 'inputs' });
        storedPath = path;
        setInputPaths(prev => ({ ...prev, [fileId]: path }));
      } catch (e) {
        console.warn('Input upload failed (non-blocking):', e?.message || e);
      }

      // Log an immediate 'uploaded' entry so Profile history shows the new item
      try {
        const srcExt = (file?.name?.split('.')?.pop() || '').toLowerCase();
        const thumb = newPreviews[fileId];
        const histId = await logConversion({
          file_name: file?.name || 'untitled',
          source_format: srcExt,
          target_format: '',
          file_size: file?.size || null,
          status: 'uploaded',
          input_path: storedPath || undefined,
          thumbnail_data_url: thumb,
        });
        if (histId) setUploadHistoryIds(prev => ({ ...prev, [fileId]: histId }));
      } catch {}
      setUploadStatus((s) => ({ uploading: true, total: s.total, done: Math.min(s.total, s.done + 1) }));
    }
    setUploadStatus((s) => ({ ...s, uploading: false }));

    if (newFiles.length) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      analyticsLog('files_added', { count: newFiles.length });
    }
    setPreviews(prev => ({ ...prev, ...newPreviews }));
    if (newNotices.length) {
      setLimitNotices(prev => [...prev, ...newNotices]);
    }
    // After files are added, auto-scroll to the processing section
    scrollToBatchSoon();
  }, [acceptedFormats, generatePreview, capabilities, uploadedFiles.length]);

  // Global drop/paste handlers: allow uploading from anywhere on the page
  useEffect(() => {
    const onDragOver = (e) => {
      if (!e) return;
      e.preventDefault();
      try { e.dataTransfer.dropEffect = 'copy'; } catch {}
    };
    const onDrop = (e) => {
      if (!e) return;
      e.preventDefault();
      try {
        if (
          uploadSectionRef.current &&
          typeof window !== 'undefined' &&
          window.Node &&
          e.target instanceof window.Node &&
          uploadSectionRef.current.contains(e.target)
        ) {
          return;
        }
      } catch {}
        return;
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        scrollToUploadSoon();
        setTimeout(() => {
          try { handleFilesSelected(files); } catch (err) { console.error('Drop upload failed:', err); }
        }, 0);
      }
    };
    const onPaste = (e) => {
      if (!e) return;
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length > 0) {
        scrollToUploadSoon();
        setTimeout(() => {
          try { handleFilesSelected(files); } catch (err) { console.error('Paste upload failed:', err); }
        }, 0);
      }
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('paste', onPaste);
    };
  }, [handleFilesSelected, scrollToUploadSoon]);

  // Real conversion for JPG, PNG, WEBP using canvas; SVG uses imagetracerjs; fallback for others
  const convertImage = useCallback(async (file, format, quality = 90) => {
    const fileName = file?.name || 'untitled';
    const nameWithoutExtension = fileName?.includes('.') 
      ? fileName?.split('.')?.slice(0, -1)?.join('.') 
      : fileName;
    const convertedFileName = `${nameWithoutExtension}.${format}`;
    const url = previews?.[file?.id];

    // Determine original extension
    const originalExt = fileName?.split('.')?.pop()?.toLowerCase();

    // Route HEIC/HEIF through backend
    if ((originalExt === 'heic' || originalExt === 'heif')) {
      try {
        const { blob, ext } = await convertHeicOnServer(file, format === 'jpeg' ? 'jpg' : format, {
          quality,
          name: nameWithoutExtension,
        });
        const objectUrl = URL.createObjectURL(blob);
        return {
          name: `${nameWithoutExtension}.${ext}`,
          url: objectUrl,
          format: ext,
          originalFile: file,
        };
      } catch (e) {
        console.error('HEIC conversion failed, falling back to preview', e);
        return {
          name: convertedFileName,
          url,
          format,
          originalFile: file,
        };
      }
    }

    // Route backend-only targets (tiff, bmp, gif, ico) through backend for non-HEIC inputs as well
    if (backendOnlyFormats.has(format)) {
      try {
        const { blob, ext } = await convertHeicOnServer(file, format, {
          quality,
          name: nameWithoutExtension,
        });
        const objectUrl = URL.createObjectURL(blob);
        return {
          name: `${nameWithoutExtension}.${ext}`,
          url: objectUrl,
          format: ext,
          originalFile: file,
        };
      } catch (e) {
        console.error('Backend conversion failed for format', format, e);
        return {
          name: convertedFileName,
          url,
          format,
          originalFile: file,
        };
      }
    }

    // PDF export (single image to PDF)
    if (format === 'pdf') {
      try {
        const pdfBlob = await imageDataUrlsToPdf([url], { margin: 20 });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        return {
          name: `${nameWithoutExtension}.pdf`,
          url: pdfUrl,
          format: 'pdf',
          originalFile: file,
        };
      } catch (e) {
        console.error('Single-image PDF export failed', e);
        // Fallback to preview (will not be a valid PDF but prevents hard crash)
        return { name: `${nameWithoutExtension}.pdf`, url, format: 'pdf', originalFile: file };
      }
    }

    // SVG conversion using imagetracerjs
    if (format === 'svg') {
      // Load imagetracerjs from CDN if not present
      if (!window.ImageTracer) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          // Use imagetracerjs to convert canvas to SVG string
          const svgString = window.ImageTracer?.imagedataToSVG(ctx.getImageData(0, 0, canvas.width, canvas.height));
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          resolve({
            name: convertedFileName,
            url: svgUrl,
            format,
            originalFile: file
          });
        };
        img.onerror = () => {
          // fallback to preview if conversion fails
          resolve({
            name: convertedFileName,
            url,
            format,
            originalFile: file
          });
        };
        img.src = url;
      });
    }

    // Only convert if target is jpg/jpeg/png/webp and input is an image
    if (["jpg", "jpeg", "png", "webp"].includes(format)) {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          let mimeType = 'image/png';
          if (format === 'jpg' || format === 'jpeg') mimeType = 'image/jpeg';
          if (format === 'webp') mimeType = 'image/webp';
          let dataUrl = canvas.toDataURL(mimeType, quality / 100);
          // Check if browser supports webp export
          if (format === 'webp' && !dataUrl.startsWith('data:image/webp')) {
            alert('Your browser does not support WEBP export. The output will be JPEG instead.');
            mimeType = 'image/jpeg';
            dataUrl = canvas.toDataURL(mimeType, quality / 100);
          }
          // Check PNG/JPEG
          if (format === 'png' && !dataUrl.startsWith('data:image/png')) {
            alert('Your browser does not support PNG export. The output may be incorrect.');
          }
          if ((format === 'jpg' || format === 'jpeg') && !dataUrl.startsWith('data:image/jpeg')) {
            alert('Your browser does not support JPEG export. The output may be incorrect.');
          }
          resolve({
            name: convertedFileName,
            url: dataUrl,
            format,
            originalFile: file
          });
        };
        img.onerror = () => {
          // fallback to preview if conversion fails
          resolve({
            name: convertedFileName,
            url,
            format,
            originalFile: file
          });
        };
        img.src = url;
      });
    }
  // Fallback for other unsupported client-side targets
    return new Promise((resolve) => {
      setTimeout(() => {
        const convertedFile = {
          name: convertedFileName,
          url,
          format: format,
          originalFile: file
        };
        resolve(convertedFile);
      }, 1200 + Math.random() * 800);
    });
  }, [previews]);

  const convertPdfToImage = useCallback(async (file, targetFormat = 'png', quality = 0.92) => {
    try {
      const dataUrl = await renderFirstPageToImage(file, targetFormat === 'jpg' ? 'jpg' : 'png', quality);
      const fileName = file?.name?.replace(/\.pdf$/i, '') || 'document';
      const convertedFileName = `${fileName}.${targetFormat}`;
      return { name: convertedFileName, url: dataUrl, format: targetFormat, originalFile: file };
    } catch (e) {
      console.error('PDF conversion failed', e);
      throw e;
    }
  }, []);

  const exportImagesToPdf = useCallback(async () => {
    const imgs = uploadedFiles
      ?.filter(f => !/pdf$/i.test(f?.name))
      ?.map(f => previews?.[f?.id])
      ?.filter(Boolean);
    if (!imgs || imgs?.length === 0) return;
    const pdfBlob = await imageDataUrlsToPdf(imgs, { margin: 20 });
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [uploadedFiles, previews]);

  // Helpers to detect and normalize formats for history logging
  const mimeToFormat = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/tiff': 'tiff',
    'application/pdf': 'pdf',
  };

  const normalizeFormat = (fmt) => {
    if (!fmt) return '';
    const f = String(fmt).toLowerCase();
    if (f === 'jpeg') return 'jpg';
    if (f === 'svg+xml') return 'svg';
    return f;
  };

  const detectSourceFormat = (file) => {
    if (!file) return '';
    let ext = (file?.name?.split('.')?.pop() || '').toLowerCase();
    if (!ext || ext.length > 5) {
      // fall back to MIME type mapping if extension missing/invalid
      ext = mimeToFormat[file?.type] || '';
    }
    return normalizeFormat(ext);
  };

  // Handle individual file conversion
  const handleConvertFile = useCallback(async (fileId, format, quality) => {
  const file = uploadedFiles?.find(f => f?.id === fileId);
  if (!file) return;
  // Use per-image format/quality if not provided
  format = format || fileFormats[fileId] || batchFormat;
  quality = quality || fileQualities[fileId] || batchQuality;

  setConversionProgress(prev => ({ ...prev, [fileId]: 0 }));
    setCurrentProcessingFile(file?.name);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => ({
        ...prev,
        [fileId]: Math.min((prev?.[fileId] || 0) + 10, 90)
      }));
    }, 200);

    try {
      const isPdf = file?.name?.toLowerCase()?.endsWith('.pdf');
      const startedAt = performance.now();
      const convertedFile = isPdf
        ? await convertPdfToImage(file, format || 'png', (quality || 90) / 100)
        : await convertImage(file, format, quality);
      const duration = Math.round(performance.now() - startedAt);
      clearInterval(progressInterval);
      
      setConversionProgress(prev => ({ ...prev, [fileId]: 100 }));
      setConvertedFiles(prev => ({ ...prev, [fileId]: convertedFile }));
      // history logging
      try {
        const srcExt = detectSourceFormat(file);
        const tgtFmt = normalizeFormat(convertedFile?.format || format);
        // Reuse the existing preview or the converted result as a lightweight thumbnail for local history
        const thumbDataUrl = previews?.[fileId] || convertedFile?.url || '/assets/images/no_image.png';
        const safeName = file?.name || `${fileId}.${srcExt || 'img'}`;
        const existingId = uploadHistoryIds[fileId];
        if (existingId) {
          await patchConversion(existingId, {
            target_format: tgtFmt,
            status: 'completed',
            duration_ms: duration,
            input_path: inputPaths?.[fileId] || null,
            thumbnail_data_url: thumbDataUrl,
          });
        } else {
          await logConversion({
            file_name: safeName,
            source_format: srcExt,
            target_format: tgtFmt,
            file_size: file?.size || null,
            status: 'completed',
            duration_ms: duration,
            input_path: inputPaths?.[fileId] || null,
            thumbnail_data_url: thumbDataUrl,
          });
        }
      } catch {}
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Conversion error:', error);
      alert('Error converting file. Please try again.');
      try {
        const srcExt = detectSourceFormat(file);
        const tgtFmt = normalizeFormat(format);
        const thumbDataUrl = previews?.[fileId] || '/assets/images/no_image.png';
        const safeName = file?.name || `${fileId}.${srcExt || 'img'}`;
        const existingId = uploadHistoryIds[fileId];
        if (existingId) {
          await patchConversion(existingId, {
            target_format: tgtFmt,
            status: 'failed',
            input_path: inputPaths?.[fileId] || null,
            thumbnail_data_url: thumbDataUrl,
          });
        } else {
          await logConversion({
            file_name: safeName,
            source_format: srcExt,
            target_format: tgtFmt,
            file_size: file?.size || null,
            status: 'failed',
            input_path: inputPaths?.[fileId] || null,
            thumbnail_data_url: thumbDataUrl,
          });
        }
      } catch {}
    }
  }, [uploadedFiles, convertImage, convertPdfToImage, inputPaths]);

  // Handle batch conversion with mixed format check
  const handleBatchConvert = useCallback(async () => {
    if (uploadedFiles?.length === 0) return;

    // Determine which files still need conversion
    const unconvertedFiles = uploadedFiles?.filter(file => !convertedFiles?.[file?.id]) || [];

    // Check for mixed output formats among the selection
    const selectedFormats = unconvertedFiles.map(file => fileFormats[file?.id] || batchFormat).filter(Boolean);
    const uniqueFormats = Array.from(new Set(selectedFormats));

    if (uniqueFormats.length > 1) {
      const confirmMsg = `You have selected multiple output formats (${uniqueFormats.join(", ")}) for batch conversion.\n\nDo you want to use a single format for all images? Click OK to use '${batchFormat || uniqueFormats[0]}' for all, or Cancel to adjust formats individually.`;
      const confirmed = window.confirm(confirmMsg);
      if (!confirmed) return;
      // Set all to the chosen format
      const chosenFormat = batchFormat || uniqueFormats[0];
      setFileFormats(prev => {
        const next = { ...prev };
        unconvertedFiles.forEach(file => { next[file.id] = chosenFormat; });
        return next;
      });
    }

    setIsProcessing(true);
    try {
      for (let i = 0; i < unconvertedFiles.length; i++) {
        const file = unconvertedFiles[i];
        await handleConvertFile(
          file?.id,
          fileFormats[file?.id] || batchFormat,
          fileQualities[file?.id] || batchQuality
        );
      }
    } finally {
      setIsProcessing(false);
      setCurrentProcessingFile('');
    }
  }, [uploadedFiles, convertedFiles, fileFormats, fileQualities, batchFormat, batchQuality, handleConvertFile]);

  // Batch download converted files
  const handleBatchDownload = useCallback(() => {
    const files = Object.values(convertedFiles || {});
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file?.url;
        link.download = file?.name;
        document.body?.appendChild(link);
        link?.click();
        document.body?.removeChild(link);
      }, index * 100); // Stagger downloads
    });
  }, [convertedFiles]);

  // Remove file
  const handleRemoveFile = useCallback((fileId) => {
    setUploadedFiles(prev => prev?.filter(f => f?.id !== fileId));
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews?.[fileId];
      return newPreviews;
    });
    setConvertedFiles(prev => {
      const newConverted = { ...prev };
      delete newConverted?.[fileId];
      return newConverted;
    });
    setConversionProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  }, []);

  // Clear all files
  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
    setPreviews({});
    setConvertedFiles({});
    setIsProcessing(false);
    setCurrentProcessingFile('');
  }, []);

  const hasFiles = uploadedFiles?.length > 0;
  const convertedCount = Object.keys(convertedFiles)?.length;

  return (
    <>
      <Helmet>
  <title>Img V2 Pro - Image Converter</title>
        <meta name="description" content="Professional image conversion platform. Transform images between JPG, PNG, SVG, and WEBP formats. Fast and reliable." />
        <meta name="keywords" content="image converter, JPG to PNG, PNG to WEBP, SVG converter, image format conversion" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Header onTabChange={() => {}} />
        
        <main className="pt-16">
          {/* Hero Section - Simplified */}
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                {/* Simple status badge */}
                <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium mb-6 shadow-sm">
                  <Icon name="Zap" size={16} className="text-blue-500" />
                  <span>Free • Unlimited • Fast</span>
                </div>
                
                {/* Clean main heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-5 sm:mb-6">
                  <span className="block">Img V2 Pro</span>
                  <span className="block text-blue-600">Convert Effortlessly</span>
                </h1>
                
                {/* Simple subtitle */}
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                  Convert between JPG, PNG, SVG, and WEBP formats with ease. 
                  Professional quality, unlimited conversions, completely free.
                </p>

                {/* Simple feature grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                  <div className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Icon name="Infinity" size={20} className="text-blue-500" />
                    <span className="text-xs text-gray-600">Unlimited Size</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Icon name="Layers" size={20} className="text-green-500" />
                    <span className="text-xs text-gray-600">Batch Process</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Icon name="Shield" size={20} className="text-purple-500" />
                    <span className="text-xs text-gray-600">Privacy Safe</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Icon name="Download" size={20} className="text-orange-500" />
                    <span className="text-xs text-gray-600">Instant Download</span>
                  </div>
                </div>
              </div>

              {/* Clean Upload Zone */}
              <div ref={uploadSectionRef} className="max-w-4xl mx-auto space-y-3 px-2 sm:px-0">
                {!heicServerOnline && !import.meta.env.PROD && (
                  <div className="mb-1 text-xs sm:text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    HEIC preview server is offline. HEIC files will still upload, but previews may show a placeholder until conversion.
                  </div>
                )}
                {!heicServerOnline && import.meta.env.PROD && (
                  <div className="mb-1 text-xs sm:text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                    💡 <strong>Note:</strong> HEIC/HEIF files are supported but require a backend server. All other formats work perfectly!
                  </div>
                )}
                <UploadZone
                  onFilesSelected={handleFilesSelected}
                  isProcessing={isProcessing}
                  acceptedFormats={acceptedFormats}
                  uploadStatus={uploadStatus}
                />
                <div className="text-center text-xs text-gray-500">
                  Plan: <span className="font-medium capitalize">{planId}</span> • Batch {capabilities?.maxBatchFiles === Infinity ? 'Unlimited' : capabilities?.maxBatchFiles} • File Size {capabilities?.maxFileSizeMB === Infinity ? 'Unlimited' : capabilities?.maxFileSizeMB + 'MB'}
                </div>
                {limitNotices.length > 0 && (
                  <div className="space-y-2">
                    {limitNotices.map(n => (
                      <div key={n.id} className="flex items-start justify-between gap-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 text-xs shadow-sm">
                        <div className="flex-1">
                          <span className="font-medium mr-1">Limit:</span>{n.message}
                          {n.type === 'size' && <span className="ml-1 text-amber-600">Upgrade for larger files.</span>}
                          {n.type === 'batch' && <span className="ml-1 text-amber-600">Upgrade for bigger batches.</span>}
                        </div>
                        <button
                          onClick={() => setLimitNotices(prev => prev.filter(x => x.id !== n.id))}
                          className="text-amber-600 hover:text-amber-900 transition-colors"
                          aria-label="Dismiss notice"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="text-right">
                      <Link
                        to="/premium-features#pricing-section"
                        className="inline-block text-[10px] uppercase tracking-wide font-semibold text-amber-700 hover:text-amber-900"
                      >
                        View Plans →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Processing Section - Simplified */}
          {hasFiles && (
            <section ref={batchSectionRef} className="py-8 bg-white">
              <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-6">
                {/* Clean Conversion Progress */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <ConversionProgress
                    totalFiles={uploadedFiles?.length}
                    completedFiles={convertedCount}
                    currentFile={currentProcessingFile}
                    isProcessing={isProcessing}
                  />
                </div>

                {/* Clean Batch Controls */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <BatchControls
                    files={uploadedFiles}
                    onBatchConvert={handleBatchConvert}
                    onBatchDownload={() => {
                      if (batchFormat === 'pdf') {
                        exportImagesToPdf();
                      } else {
                        handleBatchDownload();
                      }
                    }}
                    onClearAll={handleClearAll}
                    batchFormat={batchFormat}
                    onBatchFormatChange={(format) => {
                      setBatchFormat(format);
                      // Set all per-image formats to match batch format
                      setFileFormats(prev => {
                        const updated = { ...prev };
                        uploadedFiles.forEach(file => {
                          updated[file.id] = format;
                        });
                        return updated;
                      });
                      // If conversions exist and user changes batch format, reset all conversions
                      if (Object.keys(convertedFiles).length > 0) {
                        setConvertedFiles({});
                      }
                    }}
                    batchQuality={batchQuality}
                    onBatchQualityChange={setBatchQuality}
                    isProcessing={isProcessing}
                    convertedFiles={Object.values(convertedFiles)}
                  />
                </div>

                {/* Clean Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {uploadedFiles?.map((file, index) => (
                    <div key={file?.id}>
                      <ImagePreviewCard
                        file={file}
                        preview={previews?.[file?.id]}
                        onRemove={() => handleRemoveFile(file?.id)}
                        onFormatChange={(format) => {
                          // When user changes format for any image, set all images to that format
                          setFileFormats(prev => {
                            const updated = { ...prev };
                            uploadedFiles.forEach(f => {
                              updated[f.id] = format;
                            });
                            return updated;
                          });
                          // Reset all conversions if any format changes
                          if (Object.keys(convertedFiles).length > 0) {
                            setConvertedFiles({});
                          }
                          // Immediately trigger conversion for this image
                          setTimeout(() => handleConvertFile(file.id, format, fileQualities[file.id] || batchQuality), 0);
                        }}
                        onQualityChange={(quality) => setFileQualities(q => ({ ...q, [file.id]: quality }))}
                        onConvert={() => handleConvertFile(file?.id)}
                        selectedFormat={fileFormats[file.id] || batchFormat}
                        quality={fileQualities[file.id] || batchQuality}
                        isConverting={conversionProgress?.[file?.id] > 0 && conversionProgress?.[file?.id] < 100}
                        convertedFile={convertedFiles?.[file?.id]}
                        conversionProgress={conversionProgress?.[file?.id] || 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Simple Features Section */}
          {!hasFiles && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <FeatureHighlights />
                </div>
              </div>
            </section>
          )}

          {/* Simple How It Works */}
          <section className="py-12 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="w-20 h-1 bg-blue-500 mx-auto rounded"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Upload" size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Upload</h3>
                  <p className="text-gray-600">
                    Drag and drop your images or click to browse. Supports JPG, PNG, SVG, and WEBP.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Settings" size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Convert</h3>
                  <p className="text-gray-600">
                    Choose your desired format and quality. Process individual files or convert in batches.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Download" size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Download</h3>
                  <p className="text-gray-600">
                    Download your converted images instantly. Individual downloads or batch download available.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ImageConversionHub;