import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

import saraswatiImg from "@/assets/saraswati.png";
import aboutImg from "@/assets/about.png";
import shubhaImg from "@/assets/shubha.jpeg";
import pradnyaImg from "@/assets/Pradnya.jpeg";
import SuchitaImg from "@/assets/Suchita.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const highlight = "font-semibold text-slate-900";
const bulletBox =
  "flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-sm";

const AboutPage = () => {
  return (
    <Layout>
      <section className="max-w-[1100px] mx-auto px-4 py-10 space-y-12">

        {/* ABOUT */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-0 shadow-md">
            <CardContent className="p-6 md:p-8">

              <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* TEXT */}
                <div className="space-y-5 max-w-[520px] mx-auto md:mx-0 text-center md:text-left">

                  <h1 className="text-3xl md:text-4xl font-bold">
                    About Saraswati Classes
                  </h1>

                  <div className="space-y-4 text-base text-slate-600 leading-relaxed">

                    <p>
                      A <span className={highlight}>focused coaching institute</span>{" "}
                      building strong academic foundations in Mathematics & Science.
                    </p>

                    <p>
                      With <span className="text-blue-600 font-semibold">24+ years</span>,
                      we help students develop clarity, confidence and problem-solving skills.
                    </p>

                    <p>
                      Preparation for{" "}
                      <span className={highlight}>Boards, CET & JEE</span> — simple,
                      structured and result-driven.
                    </p>

                  </div>

                </div>

                {/* IMAGE */}
                <div className="flex justify-center md:justify-end">
                  <img
                    src={saraswatiImg}
                    className="w-[65%] max-w-[260px] md:max-w-[300px] h-auto object-contain rounded-2xl shadow-lg"
                  />
                </div>

              </div>

            </CardContent>
          </Card>
        </motion.div>


        {/* FOUNDER */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-gradient-to-br from-purple-50 to-white border-0 shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">

                <div className="flex justify-center">
                  <img src={shubhaImg} className="w-[230px] rounded-2xl shadow-lg" />
                </div>

                <div className="space-y-5">
                  <h2 className="text-2xl font-semibold">Our Founder</h2>

                  <p className="text-lg font-semibold">
                    Mrs. Shubha Bhamburkar
                  </p>
                  <p className="text-md font-semibold text-gray-500">
                    M.Sc Mathematics
                  </p>

                  <p className="text-base text-slate-600">
                    <span className="text-blue-600 font-semibold">24+ years experience</span>{" "}
                    mentoring thousands of students.
                  </p>

                  <div className="space-y-3 pt-2">
                    {[
                      "Concept clarity focused",
                      "Logical thinking development",
                      "Strong fundamentals",
                      "Consistent results",
                    ].map((item) => (
                      <div key={item} className={bulletBox}>
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-base font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        {/* APPROACH */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-gradient-to-br from-yellow-50 to-white border-0 shadow-md">
            <CardContent className="p-6 md:p-8 text-center space-y-6">

              <h2 className="text-3xl font-semibold">
                Our Teaching Approach
              </h2>

              <p className="text-base text-slate-600">
                <span className={highlight}>Understanding concepts</span> is more important than memorizing.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                {[
                  "Concept-based learning",
                  "Step-by-step problem solving",
                  "Regular tests",
                  "Personal attention",
                  "Board preparation",
                  "Time management",
                ].map((item) => (
                  <div key={item} className={bulletBox}>
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </motion.div>


        {/* INSTITUTE */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-gradient-to-br from-green-50 to-white border-0 shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Saraswati Classes</h2>

                  <p className="text-base text-slate-600">
                    Together we grow, learn and succeed
                  </p>

                  <p className="text-base">
                    <b>Established:</b>{" "}
                    <span className="text-blue-600 font-semibold">2002</span>
                  </p>

                  <div className="text-base text-slate-600">
                    Saraswati Classes,<br />
                    201, Chamanlal Complex, Above Bank of Maharashtra, Anand Nagar, Sinhgad Road, Pune 411051
                  </div>
                </div>

                <div className="flex justify-center">
                  <img src={aboutImg} className="w-[90%] max-w-[320px] rounded-2xl shadow-lg" />
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* MENTORS */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-gradient-to-br from-indigo-50 to-white border-0 shadow-md">
            <CardContent className="p-8 md:p-10 space-y-14">

              <h2 className="text-4xl text-center font-bold">
                Mentors
              </h2>

              {/* 1 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div className="flex justify-center">
                  <img
                    src={shubhaImg}
                    className="w-[280px] md:w-[320px] rounded-2xl shadow-xl"
                  />
                </div>

                <div className="space-y-5">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Mrs. Shubha Bhamburkar
                  </h3>

                  <p className="text-base text-slate-600">
                    <span className="font-medium text-indigo-600 text-lg">
                      M.Sc Mathematics
                    </span>
                  </p>

                  <p className="text-base text-slate-600">
                    <span className="font-semibold text-slate-900 text-lg">
                      24 years Experience
                    </span>
                  </p>
                </div>

              </div>


              {/* 2 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div className="space-y-5 md:order-1 flex flex-col justify-center md:items-end text-left md:text-right max-w-[450px] mx-auto md:mx-0">

                  <h3 className="text-2xl font-semibold text-slate-900">
                    Mrs. Pradnya Joshi
                  </h3>

                  <p className="text-base text-slate-600">
                    <span className="font-medium text-indigo-600 text-lg">
                      8th 9th 10th Mathematics & Science
                    </span>
                  </p>

                  <p className="text-base text-slate-600">
                    <span className="font-semibold text-slate-900 text-lg">
                      10 years Experience
                    </span>
                  </p>

                </div>

                <div className="flex justify-center md:order-2">
                  <img
                    src={pradnyaImg}
                    className="w-[280px] md:w-[320px] rounded-2xl shadow-xl"
                  />
                </div>

              </div>


              {/* 3 */}
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div className="flex justify-center">
                  <img
                    src={SuchitaImg}
                    className="w-[280px] md:w-[320px] rounded-2xl shadow-xl"
                  />
                </div>

                <div className="space-y-5">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Mrs. Suchita Gandhi
                  </h3>

                  <p className="text-base text-slate-600">
                    <span className="font-medium text-indigo-600 text-lg">
                      M.Sc Organic Chemistry • B.Ed
                    </span>
                  </p>

                  <p className="text-base text-slate-600">
                    <span className="font-medium text-indigo-600 text-lg">
                      11th & 12th Chemistry
                    </span>
                  </p>

                  <p className="text-base text-slate-600">
                    <span className="font-semibold text-slate-900 text-lg">
                      24 years Experience
                    </span>
                  </p>

                </div>

              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* TEACHERS */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Card className="bg-slate-50 border-0 shadow-md">
            <CardContent className="p-8 md:p-10">

              <h2 className="text-4xl text-center font-bold mb-10">
                Our Teachers
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Teacher 1 */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-0 shadow-md hover:shadow-lg transition">
                  <CardContent className="p-7 space-y-4">

                    <h3 className="font-semibold text-xl text-slate-900">
                      Mrs. Sucheta Gandhi
                    </h3>

                    <p className="text-base text-slate-600">
                      <span className="font-medium text-blue-600">
                        11th & 12th Chemistry
                      </span>
                    </p>

                    <p className="text-base text-slate-600">
                      <span className="font-semibold text-slate-900">
                        24 years Experience
                      </span>
                    </p>

                  </CardContent>
                </Card>


                {/* Teacher 2 */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-0 shadow-md hover:shadow-lg transition">
                  <CardContent className="p-7 space-y-4">

                    <h3 className="font-semibold text-xl text-slate-900">
                      Mr. Jagtap Sir
                    </h3>

                    <p className="text-base text-slate-600">
                      <span className="font-medium text-purple-600">
                        11th & 12th Physics
                      </span>
                    </p>

                    <p className="text-base text-slate-600">
                      <span className="font-semibold text-slate-900">
                        24 years Experience
                      </span>
                    </p>

                  </CardContent>
                </Card>


                {/* Teacher 3 */}
                <Card className="bg-gradient-to-br from-yellow-50 to-white border-0 shadow-md hover:shadow-lg transition">
                  <CardContent className="p-7 space-y-4">

                    <h3 className="font-semibold text-xl text-slate-900">
                      Mrs. Pradnya Joshi
                    </h3>

                    <p className="text-base text-slate-600">
                      <span className="font-medium text-yellow-600">
                        8th–10th SSC Mathematics & Science
                      </span>
                    </p>

                    <p className="text-base text-slate-600">
                      <span className="font-semibold text-slate-900">
                        10 years Experience
                      </span>
                    </p>

                  </CardContent>
                </Card>

              </div>

            </CardContent>
          </Card>
        </motion.div>

      </section>
    </Layout>
  );
};

export default AboutPage;