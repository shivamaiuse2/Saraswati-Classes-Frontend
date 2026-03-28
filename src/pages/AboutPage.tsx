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
              11th–12th Chemistry
            </span>
          </p>

          <p className="text-base text-slate-600">
            <span className="font-semibold text-slate-900 text-lg">
              24 years Experience
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
                XI & XII Chemistry
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
                XI & XII Physics
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



// import { CheckCircle2 } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import Layout from "@/components/Layout";

// import saraswatiImg from "@/assets/saraswati.png";
// import aboutImg from "@/assets/about.png";
// import shubhaImg from "@/assets/shubha.png";
// import pradnyaImg from "@/assets/Pradnya.png";

// const bulletClass = "flex items-start gap-2 text-sm text-muted-foreground";

// const AboutPage = () => {
//   return (
//     <Layout>
//       <section className="pt-10 pb-20 space-y-14">
//         {/* ABOUT SECTION */}
//         <Card className="bg-blue-50 border-none shadow-sm">
//           <CardContent className="p-8">
//             <div className="grid md:grid-cols-2 gap-10 items-center">
//               <div className="space-y-4">
//                 <h1 className="text-3xl md:text-4xl font-bold">
//                   About Saraswati Classes
//                 </h1>

//                 <p className="text-muted-foreground">
//                   Saraswati Classes is a dedicated coaching institute focused on
//                   building strong academic foundations in Mathematics and
//                   Science for students of 8th to 12th standard.
//                 </p>

//                 <p className="text-muted-foreground">
//                   With over 24 years of teaching experience, we have been
//                   guiding students not only to score high marks but also to
//                   develop clear concepts, logical thinking, and confidence in
//                   problem solving.
//                 </p>

//                 <p className="text-muted-foreground">
//                   Our goal is to make learning simple, structured, and
//                   result-oriented, helping students succeed in Board Exams as
//                   well as competitive exams like MHT-CET and JEE foundation
//                   levels.
//                 </p>
//               </div>

//               <div className="flex justify-center">
//                 <img
//                   src={saraswatiImg}
//                   alt="Saraswati Classes"
//                   className="w-full max-w-md rounded-xl shadow-md"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* FOUNDER SECTION */}
//         <Card className="bg-purple-50 border-none shadow-sm">
//           <CardContent className="p-8">
//             <div className="grid md:grid-cols-2 gap-10 items-center">
//               <div className="flex justify-center">
//                 <img
//                   src={shubhaImg}
//                   alt="Founder"
//                   className="max-w-sm rounded-xl shadow-md"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <h2 className="text-2xl font-semibold">About Our Founder</h2>

//                 <p className="font-semibold text-lg">Mrs. Shubha Bhamburkar</p>

//                 <p className="text-muted-foreground">
//                   Saraswati Classes is led by Mrs. Shubha Bhamburkar, an
//                   experienced educator with more than 24 years of teaching
//                   experience in Mathematics and Science.
//                 </p>

//                 <p className="text-muted-foreground">
//                   She has mentored thousands of students and helped them develop
//                   strong conceptual understanding and exam confidence.
//                 </p>

//                 <ul className="space-y-2 pt-2">
//                   {[
//                     "Making complex topics easy to understand",
//                     "Encouraging logical thinking",
//                     "Building strong fundamentals",
//                     "Helping students achieve academic excellence",
//                   ].map((item) => (
//                     <li key={item} className={bulletClass}>
//                       <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* TEACHING APPROACH */}
//         <Card className="bg-yellow-50 border-none shadow-sm">
//           <CardContent className="p-8 text-center space-y-6">
//             <h2 className="text-3xl font-semibold">Our Teaching Approach</h2>

//             <p className="text-muted-foreground max-w-3xl mx-auto">
//               At Saraswati Classes we believe that understanding concepts is
//               more important than memorizing formulas.
//             </p>

//             <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
//               {[
//                 "Concept-based learning",
//                 "Step-by-step problem solving techniques",
//                 "Regular practice and test series",
//                 "Personal attention to every student",
//                 "Board exam focused preparation",
//                 "Time management strategies for exams",
//               ].map((item) => (
//                 <div key={item} className={bulletClass}>
//                   <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* INSTITUTE DETAILS */}
//         <Card className="bg-green-50 border-none shadow-sm">
//           <CardContent className="p-8">
//             <div className="grid md:grid-cols-2 gap-10 items-center">
//               <div className="space-y-3">
//                 <h2 className="text-2xl font-semibold">Saraswati Classes</h2>

//                 <p className="text-muted-foreground">
//                   Together we grow, learn and succeed
//                 </p>

//                 <p className="text-sm">
//                   <b>Established Year:</b> 2002
//                 </p>

//                 <div className="text-sm text-muted-foreground">
//                   <p>Saraswati Classes</p>
//                   <p>201, Chamanlal Complex</p>
//                   <p>Above Bank of Maharashtra</p>
//                   <p>Anand Nagar</p>
//                   <p>Sinhgad Road</p>
//                   <p>Pune</p>
//                 </div>
//               </div>

//               <div className="flex justify-center">
//                 <img
//                   src={aboutImg}
//                   alt="Institute"
//                   className="max-w-sm rounded-xl shadow-md"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* MENTORS */}
//         <Card className="bg-indigo-50 border-none shadow-sm">
//           <CardContent className="p-8 space-y-10">
//             <h2 className="text-3xl text-center font-semibold">Mentors</h2>

//             <div className="grid md:grid-cols-2 gap-10 items-center">
//               <div className="flex justify-center">
//                 <img
//                   src={shubhaImg}
//                   className="max-w-sm rounded-xl shadow-md"
//                 />
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold">
//                   Mrs. Shubha Bhamburkar
//                 </h3>
//                 <p className="text-muted-foreground">
//                   M.Sc Mathematics • 24 years Experience
//                 </p>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-10 items-center">
//               <div>
//                 <h3 className="text-xl font-semibold">Mrs. Pradnya Joshi</h3>
//                 <p className="text-muted-foreground">
//                   8th-10th SSC Mathematics & Science
//                 </p>
//                 <p className="text-muted-foreground">10 years Experience</p>
//               </div>

//               <div className="flex justify-center">
//                 <img
//                   src={pradnyaImg}
//                   className="max-w-sm rounded-xl shadow-md"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* TEACHERS */}
//         <Card className="bg-slate-50 border-none shadow-sm">
//           <CardContent className="p-8">
//             <h2 className="text-3xl text-center font-semibold mb-8">
//               Our Teachers
//             </h2>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <Card className="bg-blue-50 border-none shadow-sm">
//                 <CardContent className="p-6 space-y-2">
//                   <h3 className="font-semibold text-lg">Mrs. Sucheta Gandhi</h3>
//                   <p className="text-sm text-muted-foreground">
//                     M.Sc Organic Chemistry • B.Ed
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     24 years Experience
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Teaches XI & XII Chemistry
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-purple-50 border-none shadow-sm">
//                 <CardContent className="p-6 space-y-2">
//                   <h3 className="font-semibold text-lg">Mr. Jagtap Sir</h3>
//                   <p className="text-sm text-muted-foreground">
//                     XI & XII Physics
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     24 years Experience
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-yellow-50 border-none shadow-sm">
//                 <CardContent className="p-6 space-y-2">
//                   <h3 className="font-semibold text-lg">Mrs. Pradnya Joshi</h3>
//                   <p className="text-sm text-muted-foreground">
//                     8th-10th SSC Mathematics & Science
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     10 years Experience
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </CardContent>
//         </Card>
//       </section>
//     </Layout>
//   );
// };

// export default AboutPage;
