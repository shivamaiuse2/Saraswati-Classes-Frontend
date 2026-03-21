import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";

const Blog = () => {
  const { blogs, loadingBlogs } = useApp();

  return (
    <Layout>
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A]">
              Student Learning Blog
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Helpful articles, exam tips, and preparation strategies for
              students preparing for board and competitive exams.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingBlogs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[300px] bg-slate-100 animate-pulse rounded-xl" />
              ))
            ) : blogs.length > 0 ? (
              blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-[#0F172A] mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground flex-grow">{post.date}</p>
                    <div className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                      Read Article →
                    </div>
                  </div>
                </Link>
              ))
            ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No blog posts available at the moment.
                </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;