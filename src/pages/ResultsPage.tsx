import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";

const cardColors = [
  "bg-blue-50",
  "bg-purple-50",
  "bg-yellow-50",
  "bg-green-50",
  "bg-pink-50",
  "bg-indigo-50",
];

const ResultsPage = () => {
  const { results, loadingResults } = useApp();

  return (
    <Layout>
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-12">

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A]">
              Our Topper Results
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are proud of our students who achieved outstanding results
              through hard work, dedication, and proper guidance.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingResults ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />
              ))
            ) : results.length > 0 ? (
              results.map((t, idx) => (
                <Card
                  key={idx}
                  className={`${
                    cardColors[idx % cardColors.length]
                  } rounded-xl border-none shadow-sm hover:shadow-lg transition flex flex-col items-center text-center p-6`}
                >

                  {/* Image */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow"
                  />

                  {/* Name */}
                  <h3 className="font-semibold text-lg text-[#0F172A]">
                    {t.name}
                  </h3>

                  {/* Exam */}
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.exam}
                  </p>

                  {/* Marks */}
                  <div className="mt-3 text-lg font-semibold text-blue-600">
                    {t.marks}
                  </div>

                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No results published yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResultsPage;