import BlogCard from '@/components/BlogCard';
import { getAllPostsMetadata } from '@/lib/blog';

export default function BlogPage() {
  const posts = getAllPostsMetadata().filter(post => post.published);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thoughts, insights, and tutorials on technology, programming, and personal growth.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts published yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}