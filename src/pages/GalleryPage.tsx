import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import contentService from "@/services/contentService";

type GalleryCategory = "Classroom Photos" | "Topper Achievements" | "Events";

interface GalleryItem {
  id: string;
  category: GalleryCategory;
  title: string;
  image: string;
}

const categories: GalleryCategory[] = [
  "Classroom Photos",
  "Topper Achievements",
  "Events",
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory | "All">("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load gallery items from backend
  useState(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await contentService.getGalleryItems(1, 100);
        if (response.success) {
          setItems(response.data.map(item => ({
            id: item.id,
            category: item.category as GalleryCategory,
            title: item.title,
            image: item.image
          })));
        } else {
          throw new Error(response.message || "Failed to load gallery items");
        }
      } catch (error: any) {
        console.error("Error loading gallery items:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load gallery items",
          variant: "destructive",
        });
        // Set empty array as fallback
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  });

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Gallery
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              A glimpse into classrooms, achievements and events at Saraswati
              Classes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No gallery items available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <Card
                  key={img.id}
                  className="group cursor-pointer overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md"
                  onClick={() => setSelected(img)}
                >
                  <CardContent className="p-0 relative">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="h-32 sm:h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Set a fallback image if the image fails to load
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/0ea5e9/ffffff?text=Gallery+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-medium text-white line-clamp-1">
                        {img.title}
                      </p>
                      <p className="text-[10px] text-white/70">
                        {img.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-4xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
                >
                  <X className="h-8 w-8" />
                </button>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/20" />
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      // Set a fallback image if the image fails to load
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/0ea5e9/ffffff?text=Gallery+Image";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between text-sm text-white">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        {selected.title}
                      </p>
                      <p className="text-xs text-white/80">
                        {selected.category}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default GalleryPage;