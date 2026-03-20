import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

import saraswatiImg from "@/assets/saraswati.png";
import aboutImg from "@/assets/about.png";
import shubhaImg from "@/assets/shubha.png";
import pradnyaImg from "@/assets/Pradnya.png";

const bulletClass = "flex items-start gap-2 text-sm text-muted-foreground";

const AboutPage = () => {
  return (
    <Layout>
      <section className="pt-10 pb-20 space-y-14">
        {/* ABOUT SECTION */}
        <Card className="bg-blue-50 border-none shadow-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                  About Saraswati Classes
                </h1>

                <p className="text-muted-foreground">
                  Saraswati Classes is a dedicated coaching institute focused on
                  building strong academic foundations in Mathematics and
                  Science for students of 8th to 12th standard.
                </p>

                <p className="text-muted-foreground">
                  With over 24 years of teaching experience, we have been
                  guiding students not only to score high marks but also to
                  develop clear concepts, logical thinking, and confidence in
                  problem solving.
                </p>

                <p className="text-muted-foreground">
                  Our goal is to make learning simple, structured, and
                  result-oriented, helping students succeed in Board Exams as
                  well as competitive exams like MHT-CET and JEE foundation
                  levels.
                </p>
              </div>

              <div className="flex justify-center">
                <img
                  src={saraswatiImg}
                  alt="Saraswati Classes"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FOUNDER SECTION */}
        <Card className="bg-purple-50 border-none shadow-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <img
                  src={shubhaImg}
                  alt="Founder"
                  className="max-w-sm rounded-xl shadow-md"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">About Our Founder</h2>

                <p className="font-semibold text-lg">Mrs. Shubha Bhamburkar</p>

                <p className="text-muted-foreground">
                  Saraswati Classes is led by Mrs. Shubha Bhamburkar, an
                  experienced educator with more than 24 years of teaching
                  experience in Mathematics and Science.
                </p>

                <p className="text-muted-foreground">
                  She has mentored thousands of students and helped them develop
                  strong conceptual understanding and exam confidence.
                </p>

                <ul className="space-y-2 pt-2">
                  {[
                    "Making complex topics easy to understand",
                    "Encouraging logical thinking",
                    "Building strong fundamentals",
                    "Helping students achieve academic excellence",
                  ].map((item) => (
                    <li key={item} className={bulletClass}>
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEACHING APPROACH */}
        <Card className="bg-yellow-50 border-none shadow-sm">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-3xl font-semibold">Our Teaching Approach</h2>

            <p className="text-muted-foreground max-w-3xl mx-auto">
              At Saraswati Classes we believe that understanding concepts is
              more important than memorizing formulas.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              {[
                "Concept-based learning",
                "Step-by-step problem solving techniques",
                "Regular practice and test series",
                "Personal attention to every student",
                "Board exam focused preparation",
                "Time management strategies for exams",
              ].map((item) => (
                <div key={item} className={bulletClass}>
                  <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* INSTITUTE DETAILS */}
        <Card className="bg-green-50 border-none shadow-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Saraswati Classes</h2>

                <p className="text-muted-foreground">
                  Together we grow, learn and succeed
                </p>

                <p className="text-sm">
                  <b>Established Year:</b> 2002
                </p>

                <div className="text-sm text-muted-foreground">
                  <p>Saraswati Classes</p>
                  <p>201, Chamanlal Complex</p>
                  <p>Above Bank of Maharashtra</p>
                  <p>Anand Nagar</p>
                  <p>Sinhgad Road</p>
                  <p>Pune</p>
                </div>
              </div>

              <div className="flex justify-center">
                <img
                  src={aboutImg}
                  alt="Institute"
                  className="max-w-sm rounded-xl shadow-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MENTORS */}
        <Card className="bg-indigo-50 border-none shadow-sm">
          <CardContent className="p-8 space-y-10">
            <h2 className="text-3xl text-center font-semibold">Mentors</h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <img
                  src={shubhaImg}
                  className="max-w-sm rounded-xl shadow-md"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Mrs. Shubha Bhamburkar
                </h3>
                <p className="text-muted-foreground">
                  M.Sc Mathematics • 24 years Experience
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl font-semibold">Mrs. Pradnya Joshi</h3>
                <p className="text-muted-foreground">
                  8th-10th SSC Mathematics & Science
                </p>
                <p className="text-muted-foreground">10 years Experience</p>
              </div>

              <div className="flex justify-center">
                <img
                  src={pradnyaImg}
                  className="max-w-sm rounded-xl shadow-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEACHERS */}
        <Card className="bg-slate-50 border-none shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-3xl text-center font-semibold mb-8">
              Our Teachers
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-blue-50 border-none shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">Mrs. Sucheta Gandhi</h3>
                  <p className="text-sm text-muted-foreground">
                    M.Sc Organic Chemistry • B.Ed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    24 years Experience
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Teaches XI & XII Chemistry
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-none shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">Mr. Jagtap Sir</h3>
                  <p className="text-sm text-muted-foreground">
                    XI & XII Physics
                  </p>
                  <p className="text-sm text-muted-foreground">
                    24 years Experience
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-none shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg">Mrs. Pradnya Joshi</h3>
                  <p className="text-sm text-muted-foreground">
                    8th-10th SSC Mathematics & Science
                  </p>
                  <p className="text-sm text-muted-foreground">
                    10 years Experience
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default AboutPage;
