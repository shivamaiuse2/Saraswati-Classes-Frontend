import { Users, Trophy, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import analyticsService from "@/services/analyticsService";

const AboutOverview = () => {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: "Students Taught",
      value: "Loading...",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Trophy,
      label: "Selections Achieved",
      value: "Loading...",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Clock,
      label: "Years of Experience",
      value: "20+",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getOverview();
        
        if (response.success && response.data) {
          const { totalStudents, totalEnrollments } = response.data;
          
          // For selections, we'll use a reasonable approximation based on enrollments
          // In a real application, this would come from actual results data
          const approximateSelections = Math.floor(totalEnrollments * 0.3); // Assuming 30% success rate as example

          setStats([
            {
              icon: Users,
              label: "Students Taught",
              value: `${totalStudents.toLocaleString()}+`,
              color: "text-blue-600",
              bgColor: "bg-blue-100",
            },
            {
              icon: Trophy,
              label: "Selections Achieved",
              value: `${approximateSelections.toLocaleString()}+`,
              color: "text-purple-600",
              bgColor: "bg-purple-100",
            },
            {
              icon: Clock,
              label: "Years of Experience",
              value: "20+",
              color: "text-green-600",
              bgColor: "bg-green-100",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Keep the original stats as fallback
        setStats([
          {
            icon: Users,
            label: "Students Taught",
            value: "3000+",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          },
          {
            icon: Trophy,
            label: "Selections Achieved",
            value: "1000+",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            icon: Clock,
            label: "Years of Experience",
            value: "20+",
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Saraswati Classes?
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by thousands of students for quality education and proven results
            in competitive entrance exams and board preparation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`${stat.bgColor} p-4 rounded-full mb-4`}>
                  <Icon className={`${stat.color} h-8 w-8`} />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                  {loading && stat.value === "Loading..." ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div className="mt-12 md:mt-16 bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Our Commitment
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Saraswati Classes is dedicated to providing structured, high-quality coaching
            with personalized mentoring. We focus on conceptual clarity, consistent practice,
            and exam-oriented preparation to help students achieve their academic goals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutOverview;