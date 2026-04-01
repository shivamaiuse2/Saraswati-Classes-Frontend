import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Banner } from "@/types/banner";
import bannerService from "@/services/bannerService";
import { Button } from "@/components/ui/button";

const ROTATION_INTERVAL_MS = 6000;

const HomeBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await bannerService.getBanners();
        if (response.success && Array.isArray(response.data)) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (!banners.length || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (!banners.length) return null;

  const currentBanner = banners[index];
  const nextBanner = () => setIndex((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const getLink = () => {
    if (currentBanner.category === "COURSE") {
      return `/courses/${currentBanner.referenceId}`;
    }
    return `/test-series/${currentBanner.referenceId}`;
  };

  const getLabel = () => {
    if (currentBanner.category === "COURSE") {
      return "Featured Course";
    }
    return "Featured Test Series";
  };

  return (
    <section 
      className="py-10 md:py-16 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 relative">
        
        {/* Main Banner Container */}
        <div className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl group">
          
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105 group-hover:scale-100"
            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content Layer */}
          <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl text-white space-y-6">
            <div className="space-y-2 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
              <span className="px-4 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-xs font-bold uppercase tracking-widest border border-white/10">
                {getLabel()}
              </span>
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                {currentBanner.title}
              </h2>
              <p className="text-lg md:text-xl text-white/80 font-medium max-w-md">
                {currentBanner.subtitle}
              </p>
            </div>

            <div className="flex gap-4 translate-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-forwards delay-200">
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Link to={getLink()}>
                  Explore <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
            <button
              onClick={prevBanner}
              className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === i ? "w-8 bg-primary" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextBanner}
              className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HomeBannerCarousel;