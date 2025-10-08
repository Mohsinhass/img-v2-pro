// Lightweight PDF utilities using pdfjs-dist and jspdf
// Provides: renderFirstPageToImage, imageDataUrlsToPdf

import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Configure pdfjs worker from CDN to avoid bundling worker file
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

export async function renderFirstPageToImage(fileBlob, outputFormat = 'png', quality = 0.92) {
  const arrayBuffer = await fileBlob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;

  const mime = outputFormat === 'jpg' || outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mime, quality);
  return dataUrl;
}

export async function imageDataUrlsToPdf(imageDataUrls, options = {}) {
  const {
    orientation = 'portrait',
    unit = 'pt',
    format = 'a4',
    margin = 0,
  } = options;

  const doc = new jsPDF({ orientation, unit, format });

  for (let i = 0; i < imageDataUrls.length; i++) {
    if (i > 0) doc.addPage();
    const img = imageDataUrls[i];

    // Fit image into page maintaining aspect ratio
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;

    // Get image dimensions
    const dim = await getImageDimensions(img);
    const scale = Math.min(pageWidth / dim.width, pageHeight / dim.height);
    const renderWidth = dim.width * scale;
    const renderHeight = dim.height * scale;

    const x = (doc.internal.pageSize.getWidth() - renderWidth) / 2;
    const y = (doc.internal.pageSize.getHeight() - renderHeight) / 2;

    // Pick image type by data URL
    let imgType = 'JPEG';
    if (typeof img === 'string' && img.startsWith('data:image/png')) {
      imgType = 'PNG';
    } else if (typeof img === 'string' && img.startsWith('data:image/jpeg')) {
      imgType = 'JPEG';
    } else if (typeof img === 'string' && img.startsWith('data:image/webp')) {
      // jsPDF doesn’t support WEBP directly; convert via canvas
      const converted = await convertWebpToPng(img);
      doc.addImage(converted, 'PNG', x, y, renderWidth, renderHeight);
      continue;
    }
    doc.addImage(img, imgType, x, y, renderWidth, renderHeight);
  }

  return doc.output('blob');
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
}

async function convertWebpToPng(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}


