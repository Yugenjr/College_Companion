import React from "react";
import { BookOpen, Rocket, Users, Shield, Zap, Code } from "lucide-react";

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">College Companion Documentation</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to integrate and build with College Companion's platform.
          Get started with our guides, tutorials, and API references.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <a href="#getting-started" className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
          <Rocket className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Getting Started →</h3>
          <p className="text-gray-600">Quick setup guide and first steps</p>
        </a>
        <a href="#guides" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition">
          <BookOpen className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Guides →</h3>
          <p className="text-gray-600">In-depth tutorials and best practices</p>
        </a>
        <a href="#api-reference" className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
          <Code className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">API Reference →</h3>
          <p className="text-gray-600">Complete API documentation</p>
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-4 top-4 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Getting Started Section */}
      <section id="getting-started" className="mb-16 scroll-mt-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Rocket className="w-8 h-8 mr-3 text-blue-600" />
          Getting Started
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Start */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">5-Minute Quick Start</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-medium">Create an account</p>
                  <p className="text-gray-600 text-sm">Sign up at dashboard.collegecompanion.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-medium">Get your API key</p>
                  <p className="text-gray-600 text-sm">Navigate to Settings → API Keys</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-medium">Make your first request</p>
                  <p className="text-gray-600 text-sm">Use the API key to authenticate</p>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>
                  {`curl -X GET https://api.collegecompanion.com/v1/students \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </code>
              </pre>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-gray-600">All requests require Bearer token authentication</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Rate Limits</h4>
                <p className="text-sm text-gray-600">1000 requests per hour per API key</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Pagination</h4>
                <p className="text-sm text-gray-600">List endpoints return paginated results</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium">Webhooks</h4>
                <p className="text-sm text-gray-600">Real-time updates for events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section id="guides" className="mb-16 scroll-mt-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-green-600" />
          Popular Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guide Card 1 */}
          <div className="border rounded-lg hover:shadow-lg transition overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Student Management API</h3>
              <p className="text-gray-600 mb-4">Learn how to create, read, update, and delete student records efficiently.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">15 min read</span>
                <a href="#" className="text-blue-600 hover:underline">Read Guide →</a>
              </div>
            </div>
          </div>

          {/* Guide Card 2 */}
          <div className="border rounded-lg hover:shadow-lg transition overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Course Enrollment Workflow</h3>
              <p className="text-gray-600 mb-4">Implement a complete course enrollment system with our APIs.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">20 min read</span>
                <a href="#" className="text-blue-600 hover:underline">Read Guide →</a>
              </div>
            </div>
          </div>

          {/* Guide Card 3 */}
          <div className="border rounded-lg hover:shadow-lg transition overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Real-time Updates with Webhooks</h3>
              <p className="text-gray-600 mb-4">Set up webhooks to receive instant notifications about events.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">10 min read</span>
                <a href="#" className="text-blue-600 hover:underline">Read Guide →</a>
              </div>
            </div>
          </div>

          {/* Guide Card 4 */}
          <div className="border rounded-lg hover:shadow-lg transition overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Analytics Integration</h3>
              <p className="text-gray-600 mb-4">Track and analyze student performance with our analytics endpoints.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">12 min read</span>
                <a href="#" className="text-blue-600 hover:underline">Read Guide →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Step-by-Step Tutorials</h2>

        <div className="space-y-4">
          <details className="border rounded-lg group">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Building a Student Dashboard with React</h3>
              </div>
              <span className="text-blue-600 group-hover:underline">View Tutorial</span>
            </summary>
            <div className="px-6 pb-6 pt-2 border-t">
              <p className="text-gray-600 mb-4">
                Learn how to build a complete student management dashboard using React and our API.
                This tutorial covers authentication, data fetching, and real-time updates.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What you'll learn:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Setting up React with our API</li>
                  <li>Implementing authentication flow</li>
                  <li>Building data tables and forms</li>
                  <li>Handling real-time updates</li>
                </ul>
              </div>
            </div>
          </details>

          <details className="border rounded-lg group">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Secure Authentication Implementation</h3>
              </div>
              <span className="text-blue-600 group-hover:underline">View Tutorial</span>
            </summary>
            <div className="px-6 pb-6 pt-2 border-t">
              <p className="text-gray-600 mb-4">
                Implement secure authentication in your application using our OAuth2 flow
                and JWT tokens.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Topics covered:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>OAuth2 authorization flow</li>
                  <li>Token management and refresh</li>
                  <li>Role-based access control</li>
                  <li>Security best practices</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">How do I get an API key?</h3>
            <p className="text-gray-600">
              After creating an account, visit the Dashboard → API Keys section to generate your first API key.
              Each key can be configured with specific permissions and rate limits.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">What are the rate limits?</h3>
            <p className="text-gray-600">
              Free tier: 1000 requests per hour. Premium tier: 10,000 requests per hour.
              Rate limit headers are included in all responses to help you track usage.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Do you offer webhooks?</h3>
            <p className="text-gray-600">
              Yes! Webhooks are available for real-time notifications. Configure webhook URLs
              in your dashboard to receive updates about student enrollments, grades, and more.
            </p>
          </div>
        </div>
      </section>

      {/* SDKs & Tools */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">SDKs & Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-6 text-center hover:bg-gray-50 transition">
            <span className="text-4xl mb-3 block">📦</span>
            <h3 className="font-semibold mb-2">JavaScript/TypeScript</h3>
            <p className="text-sm text-gray-600 mb-3">Official Node.js client</p>
            <a href="#" className="text-blue-600 text-sm hover:underline">npm install @collegecompanion/api →</a>
          </div>

          <div className="border rounded-lg p-6 text-center hover:bg-gray-50 transition">
            <span className="text-4xl mb-3 block">🐍</span>
            <h3 className="font-semibold mb-2">Python</h3>
            <p className="text-sm text-gray-600 mb-3">Official Python client</p>
            <a href="#" className="text-blue-600 text-sm hover:underline">pip install collegecompanion →</a>
          </div>

          <div className="border rounded-lg p-6 text-center hover:bg-gray-50 transition">
            <span className="text-4xl mb-3 block">📱</span>
            <h3 className="font-semibold mb-2">Postman Collection</h3>
            <p className="text-sm text-gray-600 mb-3">Pre-configured API calls</p>
            <a href="#" className="text-blue-600 text-sm hover:underline">Download Collection →</a>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions about integration,
            billing, or technical issues.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Contact Support
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Join Discord Community
            </button>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <div>
          <span className="text-sm text-gray-500">Previous</span>
          <div className="font-medium">← Getting Started Guide</div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Next</span>
          <div className="font-medium">API Reference →</div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;