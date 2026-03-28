import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types/banner";
import bannerService from "@/services/bannerService";

const ROTATION_INTERVAL_MS = 5000;

const HomeBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await bannerService.fetchBanners();
        if (response.success && Array.isArray(response.data)) {
          setBanners(response.data.map((b: any) => ({
            id: b.id,
            image: b.imageUrl || b.image || "",
            linkedTestSeriesId: b.testSeriesId || b.linkedTestSeriesId || ""
          })));
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 relative">

        {/* LEFT ARROW */}
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + banners.length) % banners.length)
          }
          className="absolute -left-5 md:-left-9 top-1/2 -translate-y-1/2 z-20 
          bg-black text-white shadow-xl 
          rounded-full p-3 md:p-3.5 
          hover:scale-110 transition-all duration-200"
        >
          <ChevronLeft size={22} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() =>
            setIndex((prev) => (prev + 1) % banners.length)
          }
          className="absolute -right-5 md:-right-9 top-1/2 -translate-y-1/2 z-20 
          bg-black text-white shadow-xl 
          rounded-full p-3 md:p-3.5 
          hover:scale-110 transition-all duration-200"
        >
          <ChevronRight size={22} />
        </button>

        {/* CARD */}
        <Link
          to={`/test-series/${banners[index].linkedTestSeriesId}`}
          className="block"
        >
          <div
            className="overflow-hidden rounded-3xl px-6 md:px-10 py-10 md:py-14 
            flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #0EA5E9 100%)",
            }}
          >
            <div className="space-y-3 text-center md:text-left text-white max-w-xl">
              
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] opacity-90">
                Featured Test Series
              </p>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                Practice with our rotating{" "}
                <span className="underline decoration-white/60">
                  premium test series
                </span>
              </h2>

              <p className="text-sm md:text-base text-white/90 max-w-lg mx-auto md:mx-0">
                Tap anywhere on this blue banner to open full details of the
                currently featured test series.
              </p>

            </div>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default HomeBannerCarousel;