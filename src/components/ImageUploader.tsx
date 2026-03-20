import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import apiClient from "@/lib/api";

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  folder?: string;
}

const ImageUploader = ({ onImageSelect, currentImage, folder = "results" }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setUploadError(null);
      
      try {
        // Upload to Cloudinary via backend
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        
        const response = await apiClient.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.success && response.data.data.url) {
          onImageSelect(response.data.data.url);
        } else {
          setUploadError('Failed to upload image. Please try again.');
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadError(error.response?.data?.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect(urlInput.trim());
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="text-gray-600">Uploading to Cloudinary...</div>
            </div>
          ) : (
            <div className="text-gray-600">
              📸 Drag and drop image here or click to upload
            </div>
          )}
          {currentImage && (
            <div className="mt-4">
              <img
                src={currentImage}
                alt="Preview"
                className="max-w-full max-h-32 mx-auto rounded"
              />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm">{uploadError}</div>
      )}

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
          disabled={isUploading}
        />
        <Button
          type="button"
          onClick={handleUrlSubmit}
          disabled={!urlInput.trim() || isUploading}
        >
          Use URL
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;