export const metadata = {
  title: 'About | Rongjie',
  description: 'Learn more about me, my background, and my interests.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hello there! 👋</h2>
          <p className="text-gray-600 mb-6">
            I&apos;m a engineering leader with 10+ years of development experience
            in cloud-native infrastructure, application, and developer experience,
            cooperating with international teams.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">My Background</h3>
          <p className="text-gray-600 mb-6">
            With a background in electronic engineering and years of hands-on experience,
            I specialize in cloud-native development. I enjoy working with modern technologies
            and frameworks, always staying up-to-date with the latest industry trends.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What I Do</h3>
          <p className="text-gray-600 mb-6">
            Currently, I work as a software engineer where I help build cloud-native
            platform services. I&apos;m particularly interested in:
          </p>
          
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Kubernetes operators development</li>
            <li>Cloud technologies and DevOps practices</li>
            <li>Software design and optimization</li>
            <li>AI infrastructure</li>
            <li>Software craftsmanship contributions and community building</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Beyond Coding</h3>
          <p className="text-gray-600 mb-6">
            When I&apos;m not coding, you can find me reading tech blogs, experimenting with new 
            technologies, or writing about my experiences and learnings. I believe in the power 
            of sharing knowledge and helping others grow in their tech journey.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Let&apos;s Connect</h3>
          <p className="text-gray-600">
            I&apos;m always open to interesting conversations and collaboration opportunities. 
            Feel free to reach out if you&apos;d like to discuss technology, share ideas, or 
            just say hello!
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills & Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Container</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Container Runtime</li>
                <li>Kubernetes</li>
                <li>GPU management</li>
                <li>Cloud-native</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Golang</li>
                <li>Python</li>
                <li>REST APIs</li>
                <li>Software Design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tools & Others</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Git & GitHub</li>
                <li>DevOps</li>
                <li>Cloud</li>
                <li>Linux</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}