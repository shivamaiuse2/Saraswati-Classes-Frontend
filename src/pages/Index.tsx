import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero1.png";
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
import StudentSlider from "@/components/StudentSlider";
import PopupBanner from "@/components/PopupBanner";
import AboutOverview from "@/components/AboutOverview";
import HomeBannerCarousel from "@/components/banner/HomeBannerCarousel";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials as staticTestimonials } from "@/data/testimonials";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar?: string;
  rating?: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const Index = () => {
  const {
    testSeries,
    courses,
    testimonials: apiTestimonials,
    loadingTestimonials,
    loadingCourses,
    loadingTestSeries,
  } = useApp();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState("");

  const displayTestimonials =
    apiTestimonials.length > 0
      ? apiTestimonials
      : staticTestimonials;

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
  }, [emblaApi, startAutoplay, stopAutoplay, displayTestimonials]);

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
              <h1 className="text-[clamp(28px,5vw,48px)] font-semibold leading-tight text-[#1E293B] mb-4 max-w-[650px]">
                A Focused Coaching Institute For{" "}
                <span className="text-[#3BA3F5] font-semibold">
                  Academic Excellence
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
                ⭐ 100% Success Rate
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      <HomeBannerCarousel />

      {/* Student Slider */}
      <StudentSlider />

      {/* Programs We Offer */}
      <motion.section
        className="py-12 md:py-16 bg-background"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
          <motion.div className="text-center space-y-2" variants={scrollReveal}>
            <h2 className="text-2xl font-semibold">Programs We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured programs across foundation, science streams and
              competitive exam preparation designed for consistent, year-long
              performance.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" variants={staggerContainer}>
            {/* Card 1: Class 8th to 10th */}
            <motion.div
              variants={scrollReveal}
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-blue-100 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Class 8th to 10th
                </h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>SSC Board</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>CBSC Board</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Maths & Science</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    View More
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Card 2: JEE Preparation */}
            <motion.div
              variants={scrollReveal}
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(254, 243, 224, 0.8) 0%, rgba(253, 230, 197, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-amber-100 text-amber-700">
                    <Monitor className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  11th & 12th Science
                </h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>11th–12th PCMB Program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>JEE Exam Pattern Focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Strong MHT-CET Foundation</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    View More
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Card 3: NEET Preparation */}
            <motion.div
              variants={scrollReveal}
              className="relative flex flex-col h-full rounded-[20px] p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(243, 232, 255, 0.8) 0%, rgba(230, 204, 255, 0.6) 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col flex-1">
                {/* Icon Container */}
                <div className="mb-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-purple-100 text-purple-600">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  MHT-CET Course
                </h3>

                {/* Description as Bullet List */}
                <ul className="text-sm text-slate-600 space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>PCM & PCB Oriented Curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Multiple Test Series</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>Exam Focused</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to="/courses" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full font-medium"
                  >
                    View More
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Explore Courses */}
      <motion.section
        className="py-12 md:py-16 bg-secondary/40"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" variants={scrollReveal}>
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
          </motion.div>

          {/* Cards */}
          <motion.div 
            key={loadingCourses ? "loading" : "loaded"}
            className="grid md:grid-cols-3 gap-6 justify-items-center" 
            variants={staggerContainer}
          >
            {loadingCourses ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={scrollReveal}
                  className="w-full max-w-[320px] h-[320px] bg-slate-100 animate-pulse rounded-3xl"
                />
              ))
            ) : courses.length > 0 ? (
              courses.slice(0, 3).map((course, index) => {
                const cardColors = [
                  "bg-blue-100",
                  "bg-yellow-100",
                  "bg-purple-100",
                ];

                return (
                  <motion.div
                    key={course.id}
                    variants={scrollReveal}
                    className={`rounded-3xl p-7 min-h-[320px] flex flex-col justify-between transition hover:shadow-xl w-full max-w-[300px] ${cardColors[index]}`}
                  >
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
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No courses available at the moment.
              </p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Test Series Highlight */}

      <motion.section
        className="py-12 md:py-16 bg-secondary/40"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" variants={scrollReveal}>
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
          </motion.div>

          {/* Cards */}
          <motion.div 
            key={loadingTestSeries ? "loading" : "loaded"}
            className="grid md:grid-cols-3 gap-6 justify-items-center" 
            variants={staggerContainer}
          >
            {loadingTestSeries ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={scrollReveal}
                  className="w-full max-w-[320px] h-[320px] bg-slate-100 animate-pulse rounded-2xl"
                />
              ))
            ) : testSeries.length > 0 ? (
              testSeries.slice(0, 3).map((ts) => (
                <motion.div key={ts.id} variants={scrollReveal} className="w-full max-w-[300px]">
                  <Card className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full">
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
                      <h3 className="font-semibold text-lg mb-2">{ts.title}</h3>

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
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No test series available at the moment.
              </p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* About Overview */}
      <motion.div
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AboutOverview />
      </motion.div>

      {/* Testimonials */}
      <motion.section
        className="py-20 bg-[#F8FAFC]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="max-w-[1200px] mx-auto px-4">

          {/* Heading */}
          <motion.div className="text-center mb-12" variants={scrollReveal}>
            <h2 className="relative inline-block text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
              What Our Students Say

              <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 
        w-[95%] h-[10px] 
        bg-gradient-to-r from-[#2563EB] to-[#2EA7FF] 
        opacity-30 
        rounded-[50px] 
        blur-[1px]">
              </span>
            </h2>

            <p className="text-[#64748B] max-w-xl mx-auto mt-4">
              Real feedback shared by parents and students about their learning experience.
            </p>
          </motion.div>

          {/* Carousel */}
          <motion.div className="relative" variants={scrollReveal}>

            {/* LEFT ARROW */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 
        bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
            >
              ‹
            </button>

            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex">

                {displayTestimonials.map((t, i) => (
                  <div
                    key={i}
                    className="embla__slide flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_40%] px-4"
                  >
                    <div className="bg-white rounded-2xl shadow-md p-8 transition hover:shadow-lg">

                      {/* ⭐ STARS */}
                      <div className="flex mb-4 text-base">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={idx < (t.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
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
                ))}

              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 
        bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
            >
              ›
            </button>

          </motion.div>

          {/* DOTS */}
          <motion.div className="flex justify-center mt-8 gap-3" variants={scrollReveal}>
            {displayTestimonials.map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-slate-300"
              />
            ))}
          </motion.div>

        </div>
      </motion.section>

      {/* CTA */}

      {/* Map section above footer */}
      <motion.section
        className="py-12 md:py-16 bg-background"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6">

          <motion.div className="space-y-2 text-center" variants={scrollReveal}>
            <h2 className="relative inline-block text-2xl md:text-3xl font-semibold text-[#0F172A]">
              Visit Our Centre

              {/* Sloppy underline */}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 
        w-[95%] h-[8px] 
        bg-gradient-to-r from-[#2563EB] to-[#2EA7FF] 
        opacity-30 
        rounded-[50px] 
        blur-[1px] rotate-[-1deg]">
              </span>
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
              Saraswati Classes is conveniently located for students across Pune.
              Use the map below to get directions to our coaching centre.
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={scrollReveal}>

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
                href="https://maps.app.goo.gl/quZfN1tDNubyfYEM9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2">
                  Get Directions
                </Button>
              </a>
            </div>

          </motion.div>

        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
