import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, loadingBlogs } = useApp();

  const blog = blogs.find(b => b.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  if (loadingBlogs) {
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground italic">Loading blog post...</p>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="py-16 md:py-20 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-semibold text-[#0F172A]">Blog not found</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Blog Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl mb-8"
          />

          {/* Blog Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4">
            {blog.title}
          </h1>

          {/* Blog Date */}
          <p className="text-muted-foreground mb-8">
            {formatDate(blog.date)}
          </p>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default BlogDetailPage;