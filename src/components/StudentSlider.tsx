import s1 from "@/assets/s1.png";
import s2 from "@/assets/s2.png";
import s3 from "@/assets/s3.png";
import s4 from "@/assets/s4.png";
import s5 from "@/assets/s5.png";
import s6 from "@/assets/s6.png";
import s7 from "@/assets/s7.png";
import s8 from "@/assets/s8.png";
import s9 from "@/assets/s9.png";

const StudentSlider = () => {
  const images = [
    { src: s1, color: "border-purple-500" },
    { src: s2, color: "border-orange-500" },
    { src: s3, color: "border-green-500" },
    { src: s4, color: "border-red-500" },
    { src: s5, color: "border-purple-500" },
    { src: s6, color: "border-orange-500" },
    { src: s7, color: "border-green-500" },
    { src: s8, color: "border-red-500" },
    { src: s9, color: "border-purple-500" },
  ];

  const sliderImages = [...images, ...images];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Our Students
          </h2>
          <p className="text-muted-foreground text-base">
            Meet some of our exceptional students who achieved outstanding results
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="relative overflow-hidden group">

          {/* Slider Track */}
          <div className="flex gap-6 slider-track group-hover:[animation-play-state:paused]">

            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-40 h-[200px] border-r-4 ${image.color} rounded-[18px] overflow-hidden shadow-sm`}
              >
                <img
                  src={image.src}
                  alt={`Student ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover grayscale rounded-[16px]"
                />
              </div>
            ))}

          </div>

          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

        </div>
      </div>
    </section>
  );
};

export default StudentSlider;