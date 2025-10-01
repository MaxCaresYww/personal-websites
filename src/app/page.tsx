import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { getAllPostsMetadata } from '@/lib/blog';

export default function Home() {
  const recentPosts = getAllPostsMetadata()
    .filter(post => post.published)
    .slice(0, 3); // Get 3 most recent posts

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Hello, I&apos;m <span className="text-blue-600">Rongjie Xu (Max)</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          I&apos;m a engineering leader with 10+ years of development experience
            in cloud-native infrastructure, application, and developer experience,
            cooperating with international teams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Read My Blog
          </Link>
          <Link
            href="/about"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            About Me
          </Link>
          <Link
            href="/contact"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                I&apos;m a software engineer with a passion for demystifying cloud-native technologies. 
                I love exploring new technologies and sharing my learning journey through writing.
              </p>
              <p className="text-gray-600 mb-4">
                When I&apos;m not coding, you can find me reading, learning about new technologies, 
                or working on personal projects that challenge me to grow.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Container', 'Kubernetes', 'Golang', 'Python', 'System Design', 'DevOps', 'Cloud Computing'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all posts →
          </Link>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
