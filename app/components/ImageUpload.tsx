import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (file: File, previewUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onImageUpload(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  }, [handleImage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleImage(e.target.files[0]);
    }
  }, [handleImage]);

  const startCamera = useCallback(async () => {
    setShowCamera(true);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
            handleImage(file);
          }
        }, 'image/jpeg');
      }
    }
    setShowCamera(false);
  }, [handleImage]);

  return (
    <div className="space-y-4">
      {!showCamera ? (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <p className="text-lg mb-2">Drag and drop your image here or click to select</p>
              <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
            </label>
          </div>
          <button
            onClick={startCamera}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Use Camera
          </button>
        </>
      ) : (
        <div className="relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          <button
            onClick={captureImage}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Capture Image
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" width="640" height="480" />
      {preview && (
        <div className="mt-4">
          <p className="text-lg font-semibold mb-2">Image Preview:</p>
          <div className="relative w-full h-64">
            <Image
              src={preview}
              alt="Uploaded plant"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;