import { Link } from "react-router-dom";
import { Image as ImageIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const scrollReveal: any = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const HomeGallery = () => {
  const { galleryItems, loadingGallery } = useApp();
  const items = galleryItems ? galleryItems.slice(0, 4) : [];

  return (
    <motion.section
      className="py-12 md:py-16 bg-white"
      variants={staggerContainer}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          variants={scrollReveal}
        >
          <div className="space-y-2">
            <h2 className="relative inline-block text-2xl md:text-3xl font-semibold text-[#0F172A]">
              Glimpse into Saraswati Classes
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-[95%] h-[8px] bg-gradient-to-r from-[#2563EB] to-[#2EA7FF] opacity-30 rounded-[50px] blur-[1px] rotate-[-1deg]"
              ></span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3">
              Explore moments, achievements, and the learning environment.
            </p>
          </div>

          <Link to="/gallery">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              View Entire Gallery
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {loadingGallery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full aspect-[4/3] bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={scrollReveal}
                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white cursor-pointer"
              >
                <Link to="/gallery">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Gallery image"}
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Overlay designed like other modules */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                      {item.title && (
                        <h3 className="text-white font-bold mb-1 line-clamp-2 text-lg">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-gray-200 text-xs line-clamp-2">{item.description}</p>
                      )}
                      {!item.title && !item.description && (
                        <ImageIcon className="h-8 w-8 text-white/50 mx-auto" />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No gallery items available at the moment.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default HomeGallery;
