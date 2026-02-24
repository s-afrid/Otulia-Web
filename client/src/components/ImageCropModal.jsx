import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropModal = ({ src, onCropComplete, onClose, isUploading }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    // Initial crop: 90% width, 90% height, centered, no aspect ratio lock
    const initialCrop = centerCrop(
      {
        unit: '%',
        width: 90,
        height: 90,
      },
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleCrop = () => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    // Use actual pixel dimensions for high quality
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(
      (blob) => {
        onCropComplete(blob);
      },
      'image/png',
      1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg h-full max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-sm text-gray-500">Crop Image</h2>
        <div className="flex-grow relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c, percentCrop) => setCrop(percentCrop)}
            onComplete={(c, percentCrop) => setCompletedCrop(c)}
            aspect={undefined}
            minWidth={10}
            minHeight={10}
            className="max-w-full max-h-full"
          >
            <img 
              ref={imgRef} 
              src={src} 
              onLoad={onImageLoad} 
              alt="Crop" 
              className="max-w-full max-h-full object-contain" 
            />
          </ReactCrop>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all" 
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop} 
            className="px-8 py-2.5 rounded-xl bg-[#D48D2A] text-white font-bold text-sm shadow-lg shadow-[#D48D2A]/20 hover:bg-[#B5751C] transition-all flex items-center" 
            disabled={isUploading}
          >
            {isUploading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            )}
            Save Changes
          </button>
        </div>
        <canvas ref={previewCanvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageCropModal;
