import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const ResourcesPage = () => {
  const { resources } = useApp();

  return (
    <Layout>
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Resources
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Study materials offered by the institute.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <Card
                key={res.id}
                className="rounded-xl shadow-sm hover:shadow-lg transition">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-semibold text-lg mb-2">
                    {res.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1 mb-4">
                    {res.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{res.price}</span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;

