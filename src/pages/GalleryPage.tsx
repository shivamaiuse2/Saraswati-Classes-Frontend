import { useState, useEffect } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import Layout from "@/components/Layout";
import { GalleryItem } from "@/services/galleryService";
import { useApp } from "@/context/AppContext";

const GalleryPage = () => {
  const { galleryItems: items, loadingGallery: loading } = useApp();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Handle closing lightbox with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explore moments, achievements, and events from Saraswati Classes. Experience the vibrant learning environment we provide.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Images Yet</h3>
            <p className="text-gray-500">Check back later for new photos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 bg-white"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Gallery image"}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 max-w-full">
                    {item.title && (
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-gray-200 text-sm line-clamp-3">{item.description}</p>
                    )}
                    {!item.title && !item.description && (
                      <ImageIcon className="h-8 w-8 text-white/50 mx-auto" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <div
              className="max-w-5xl w-full max-h-[90vh] flex flex-col rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking image container
            >
              <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || "Expanded image"}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
              {(selectedImage.title || selectedImage.description) && (
                <div className="bg-black/80 backdrop-blur-md p-6 border-t border-white/10">
                  {selectedImage.title && (
                    <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-300 text-sm">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GalleryPage;