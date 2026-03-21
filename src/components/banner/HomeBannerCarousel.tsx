import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const ROTATION_INTERVAL_MS = 5000;

const HomeBannerCarousel = () => {
  const { heroPosters: banners } = useApp();
  const [index, setIndex] = useState(0);

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
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <Link
          to={`/test-series/${banners[index].testSeriesId}`}
          className="block rounded-3xl overflow-hidden"
        >
          <div
            className="relative px-6 md:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6"
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

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HomeBannerCarousel;

