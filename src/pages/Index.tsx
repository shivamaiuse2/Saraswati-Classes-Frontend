import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.png";
import {
  BookOpen,
  Monitor,
  ArrowRight,
  Stethoscope,
  Calculator,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";
import contentService from "@/services/contentService";
import HomeBannerCarousel from "@/components/banner/HomeBannerCarousel";
import StudentSlider from "@/components/StudentSlider";
import PopupBanner from "@/components/PopupBanner";
import AboutOverview from "@/components/AboutOverview";

import useEmblaCarousel from "embla-carousel-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { testSeries, courses } = useApp();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        // Assuming testimonials are stored as gallery items with category "Testimonials"
        const response = await contentService.getGalleryItems(1, 10, "Testimonials");
        const testimonialItems = response.data.map(item => ({
          id: item.id,
          name: item.title,
          text: item.image, // Using image field to store testimonial text (as gallery items might store text differently)
          avatar: item.image // Using image as avatar if it's an actual image URL
        }));
        setTestimonials(testimonialItems);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to a few default testimonials if API fails
        setTestimonials([
          {
            id: "1",
            name: "Kalyani Inamdar",
            text: "Best place to learn at, got immense support and guidance from all the teachers. Thank you so much.",
          },
          {
            id: "2",
            name: "Vaishnavi Rangade",
            text: "After joining Saraswati coaching classes my study level changed. Teachers motivate students and guide them properly.",
          },
        ]);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  const openEnroll = (target: string) => {
    setEnrollTarget(target);
    setEnrollOpen(true);
  };

  // Embla carousel setup for testimonials
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current || !emblaApi) return;
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (emblaApi) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [emblaApi, startAutoplay, stopAutoplay]);


  return (
    <Layout>
      <PopupBanner />
      
     {/* Modern Light EdTech Hero Section */}
<section
  className="relative overflow-hidden pt-8 pb-[80px] md:pt-10 md:pb-[90px]"
  style={{
    background: "linear-gradient(180deg, #F7FBFF 0%, #FFFFFF 100%)",
  }}
>
  <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">

      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Headline */}
        <h1 className="text-[32px] md:text-[46px] font-bold leading-[1.2] text-[#0F172A] mb-4">
          A focused coaching institute for{" "}
          <span className="text-[#2EA7FF]">
            serious school & competitive prep
          </span>
        </h1>

        {/* Description */}
        <p className="text-[16px] text-[#475569] max-w-[520px] mb-6">
          Saraswati Classes offers structured classroom programs, test series
          and personalised mentoring for students aiming for top scores in
          boards and entrance exams.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link to="/courses">
            <button className="px-6 py-3 bg-[#2EA7FF] text-white font-medium rounded-lg shadow-md hover:bg-[#0D9AE6] transition flex items-center gap-2">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>

          <Link to="/test-series">
            <button className="px-6 py-3 bg-white border border-[#E2E8F0] text-[#0F172A] font-medium rounded-lg hover:bg-[#F8FAFC] transition">
              View Test Series
            </button>
          </Link>
        </div>
      </motion.div>

      {/* RIGHT SIDE IMAGE */}
      <motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="relative flex items-center justify-center"
>

  {/* Glow Background */}
  <div className="absolute w-[420px] h-[420px] bg-[#2EA7FF]/20 rounded-full blur-3xl"></div>

  {/* Student Image */}
  <img
    src={heroImage}
    alt="Student"
    className="relative z-10 w-[400px] md:w-[440px] object-contain"
  />

  {/* Card 1 */}
  <div className="absolute z-20 top-6 left-0 bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 animate-float">
    📚 70+ Courses
  </div>

  {/* Card 2 */}
  <div className="absolute z-20 top-16 right-0 bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 animate-float-delay">
    👨‍🎓 10k+ Students
  </div>

  {/* Card 3 */}
  <div className="absolute z-20 bottom-20 left-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 animate-float">
    🎯 CET • NEET • JEE
  </div>

  {/* Card 4 */}
  <div className="absolute z-20 bottom-4 right-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 animate-float-delay">
    ⭐ 95% Success Rate
  </div>

</motion.div>

    </div>
  </div>
</section>

      <HomeBannerCarousel />

      {/* Student Slider */}
      <StudentSlider />

      {/* Programs We Offer */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">
              Programs We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured programs across foundation, science streams and
              competitive exam preparation designed for consistent, year-long
              performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1: Foundation Courses */}
            <div
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Step Number */}
                <div className="text-sm font-semibold text-slate-400 mb-4">01</div>

                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-blue-100 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Foundation Courses</h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>8th–10th CBSE & SSC programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Strong Maths & Science focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Structured fundamentals</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    View Foundation
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: JEE Preparation */}
            <div
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(254, 243, 224, 0.8) 0%, rgba(253, 230, 197, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Step Number */}
                <div className="text-sm font-semibold text-slate-400 mb-4">02</div>

                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-amber-100 text-amber-700">
                    <Monitor className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">JEE Preparation (via 11th–12th)</h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>11th–12th PCMB programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>JEE exam pattern focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Strong PCM foundation</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    JEE-Oriented Batches
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 3: NEET Preparation */}
            <div
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(243, 232, 255, 0.8) 0%, rgba(230, 204, 255, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Step Number */}
                <div className="text-sm font-semibold text-slate-400 mb-4">03</div>

                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-purple-100 text-purple-600">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">NEET Preparation (via 11th–12th)</h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Detailed Biology, Physics & Chemistry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>NEET-oriented curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Future NEET aspirants</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    NEET-Oriented Batches
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 4: CET Crash Course */}
            <div
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(254, 237, 224, 0.8) 0%, rgba(254, 214, 165, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Step Number */}
                <div className="text-sm font-semibold text-slate-400 mb-4">04</div>

                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-orange-100 text-orange-600">
                    <Calculator className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">CET Crash Course</h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>45–50 day intensive batch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Multiple mock tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>CET exam focused</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    View CET Crash
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Courses */}
<section className="py-12 md:py-16 bg-secondary/40">
  <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold">
          Explore Courses
        </h2>
        <p className="text-muted-foreground text-sm">
          A quick look at some of our key batches for this academic year.
        </p>
      </div>

      <Link to="/courses">
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          View All Courses
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-3 gap-6 justify-items-center">

      {courses.slice(0, 3).map((course, index) => {

        const cardColors = [
          "bg-blue-100",
          "bg-yellow-100",
          "bg-purple-100"
        ]

        return (
          <div
            key={course.id}
            className={`rounded-3xl p-7 min-h-[320px] flex flex-col justify-between transition hover:shadow-xl w-full max-w-[300px] ${cardColors[index]}`}
          >

            {/* Number */}
            <p className="text-gray-500 font-semibold text-sm mb-5">
              {String(index + 1).padStart(2, "0")}
            </p>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">
              {course.title}
            </h3>

            {/* Timing */}
            <p className="text-xs text-gray-600 mb-4">
              {course.timing} • {course.days}
            </p>

            {/* Description */}
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• {course.description}</li>
              <li>• {course.category}</li>
              <li>• {course.mode}</li>
            </ul>

            {/* Button */}
            <Link to={`/courses/${course.id}`} className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-3 rounded-full text-sm font-medium hover:bg-blue-900 transition">
                View Details
                <ArrowRight className="w-4 h-4"/>
              </button>
            </Link>

          </div>
        )

      })}

    </div>
  </div>
</section>

      {/* Test Series Highlight */}

<section className="py-12 md:py-16 bg-secondary/40">
  <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">


{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div className="space-y-1">
    <h2 className="text-2xl md:text-3xl font-semibold">
      Test Series Highlights
    </h2>
    <p className="text-muted-foreground text-sm">
      Practice with exam-pattern tests for CBSE and CET.
    </p>
  </div>

  <Link to="/test-series">
    <Button variant="outline" size="sm" className="gap-2 shrink-0">
      View All
      <ArrowRight className="h-4 w-4" />
    </Button>
  </Link>
</div>

{/* Cards */}
<div className="grid md:grid-cols-3 gap-6 justify-items-center">

  {testSeries.slice(0, 3).map((ts) => (
    <Card
      key={ts.id}
      className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full max-w-[300px]"
    >

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={ts.image}
          alt={ts.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <CardContent className="p-5 flex flex-col flex-1">

        <h3 className="font-semibold text-lg mb-2">
          {ts.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
          {ts.overview}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => openEnroll(ts.title)}
          >
            Enroll Now
          </Button>

          <Link to={`/test-series/${ts.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              Details
            </Button>
          </Link>
        </div>

      </CardContent>

    </Card>
  ))}

</div>


  </div>
</section>

      {/* About Overview */}
      <AboutOverview />

{/* Testimonials */}
<section className="py-20 bg-[#F8FAFC]">
  <div className="max-w-[1200px] mx-auto px-4">

    {/* Heading */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A]">
        What Our Students Say
      </h2>

      <p className="text-[#64748B] max-w-xl mx-auto mt-3">
        Real feedback shared by parents and students about their learning experience.
      </p>
    </div>

    {/* Loading state for testimonials */}
    {loadingTestimonials ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      /* Carousel */
      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          ‹
        </button>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="embla__slide flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_40%] px-4"
                >
                  <div className="bg-white rounded-2xl shadow-md p-8 transition hover:shadow-lg">

                    {/* Stars */}
                    <div className="flex text-yellow-400 mb-4 text-lg">
                      ⭐⭐⭐⭐⭐
                    </div>

                    {/* Review */}
                    <p className="text-[#475569] leading-relaxed mb-6">
                      {t.text}
                    </p>

                    {/* Name */}
                    <p className="font-semibold text-[#0F172A]">
                      {t.name}
                    </p>

                  </div>
                </div>
              ))
            ) : (
              <div className="embla__slide flex-[0_0_100%] px-4">
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <p className="text-[#475569]">No testimonials available at the moment.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          ›
        </button>
      </div>
    )}

    {/* DOTS */}
    {!loadingTestimonials && testimonials.length > 0 && (
      <div className="flex justify-center mt-8 gap-3">
        {testimonials.map((_,i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-slate-300"
          />
        ))}
      </div>
    )}

  </div>
</section>
      {/* CTA */}
      
{/* Map section above footer */}
<section className="py-12 md:py-16 bg-background">
  <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6">

    <div className="space-y-2 text-center">
      <h2 className="text-2xl font-semibold">Visit Our Centre</h2>

      <p className="text-muted-foreground max-w-2xl mx-auto">
        Saraswati Classes is conveniently located for students across Pune.
        Use the map below to get directions to our coaching centre.
      </p>
    </div>

    <div className="space-y-4">

      <div className="rounded-xl overflow-hidden border bg-muted">
        <iframe
          title="Saraswati Classes Location"
          src="https://www.google.com/maps?q=Saraswati+Classes+Sinhgad+Road+Pune&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-64 md:h-80 border-0"
        />
      </div>

      <div className="flex justify-center">
        <a
          href="https://maps.app.goo.gl/WPW2hZ4g7J4hd3ym9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="gap-2">
            Get Directions
          </Button>
        </a>
      </div>

    </div>

  </div>
</section>
    </Layout>
  );
};

export default Index;