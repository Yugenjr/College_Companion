import React from "react";
const APIReference: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-gray-600 mb-8">
        Complete documentation for the College Companion REST API. All endpoints return JSON responses
        and require authentication via API key.
      </p>

      {/* Base URL */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Base URL</h2>
        <code className="bg-gray-200 px-4 py-2 rounded block">
          https://api.collegecompanion.com/v1
        </code>
      </div>

      {/* Authentication */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <p className="mb-3">
          All API requests require an API key. Include your API key in the request headers:
        </p>
        <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
          <pre className="overflow-x-auto">
            <code>
              {`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
            </code>
          </pre>
        </div>
        <p className="text-sm text-gray-600">
          To get an API key, register at <a href="/dashboard" className="text-blue-600 hover:underline">dashboard</a>.
        </p>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Endpoints</h2>

        {/* GET Students */}
        <div className="mb-8 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-mono">GET</span>
            <h3 className="text-xl font-semibold font-mono">/students</h3>
          </div>
          <p className="text-gray-700 mb-3">Retrieve a list of all students.</p>
          
          <h4 className="font-semibold mt-3 mb-2">Query Parameters</h4>
          <table className="min-w-full mb-4 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Parameter</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">limit</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Maximum number of results (default: 50)</td>
              </tr>
              <tr>
                <td className="border p-2">offset</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Number of items to skip (default: 0)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-3 mb-2">Example Response</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="overflow-x-auto">
              <code>
{`{
  "status": "success",
  "data": [
    {
      "id": "12345",
      "name": "John Doe",
      "email": "john.doe@university.edu",
      "major": "Computer Science",
      "year": 3,
      "gpa": 3.8
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 50,
    "offset": 0
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* GET Student by ID */}
        <div className="mb-8 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-mono">GET</span>
            <h3 className="text-xl font-semibold font-mono">/students/{"{id}"}</h3>
          </div>
          <p className="text-gray-700 mb-3">Retrieve a specific student by ID.</p>
          
          <h4 className="font-semibold mt-3 mb-2">Path Parameters</h4>
          <table className="min-w-full mb-4 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Parameter</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Unique student identifier</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold mt-3 mb-2">Example Response</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="overflow-x-auto">
              <code>
{`{
  "status": "success",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "major": "Computer Science",
    "year": 3,
    "gpa": 3.8,
    "courses": ["CS101", "MATH202"],
    "enrollmentDate": "2023-09-01T00:00:00Z"
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* POST Create Student */}
        <div className="mb-8 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-mono">POST</span>
            <h3 className="text-xl font-semibold font-mono">/students</h3>
          </div>
          <p className="text-gray-700 mb-3">Create a new student record.</p>
          
          <h4 className="font-semibold mt-3 mb-2">Request Body</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
            <pre className="overflow-x-auto">
              <code>
{`{
  "name": "string (required)",
  "email": "string (required, unique)",
  "major": "string (required)",
  "year": "number (required, 1-5)",
  "gpa": "number (optional)"
}`}
              </code>
            </pre>
          </div>

          <h4 className="font-semibold mt-3 mb-2">Example Response</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="overflow-x-auto">
              <code>
{`{
  "status": "success",
  "message": "Student created successfully",
  "data": {
    "id": "12346",
    "name": "Jane Smith",
    "email": "jane.smith@university.edu",
    "major": "Engineering",
    "year": 2,
    "gpa": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* PUT Update Student */}
        <div className="mb-8 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-mono">PUT</span>
            <h3 className="text-xl font-semibold font-mono">/students/{"{id}"}</h3>
          </div>
          <p className="text-gray-700 mb-3">Update an existing student record.</p>
          
          <h4 className="font-semibold mt-3 mb-2">Example Response</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="overflow-x-auto">
              <code>
{`{
  "status": "success",
  "message": "Student updated successfully",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "major": "Data Science",
    "year": 4,
    "gpa": 3.9,
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* DELETE Student */}
        <div className="mb-8 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-mono">DELETE</span>
            <h3 className="text-xl font-semibold font-mono">/students/{"{id}"}</h3>
          </div>
          <p className="text-gray-700 mb-3">Delete a student record.</p>
          
          <h4 className="font-semibold mt-3 mb-2">Example Response</h4>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <pre className="overflow-x-auto">
              <code>
{`{
  "status": "success",
  "message": "Student deleted successfully"
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">400</td>
              <td className="border p-2">Bad Request - Invalid parameters</td>
            </tr>
            <tr>
              <td className="border p-2">401</td>
              <td className="border p-2">Unauthorized - Invalid or missing API key</td>
            </tr>
            <tr>
              <td className="border p-2">403</td>
              <td className="border p-2">Forbidden - Insufficient permissions</td>
            </tr>
            <tr>
              <td className="border p-2">404</td>
              <td className="border p-2">Not Found - Resource doesn't exist</td>
            </tr>
            <tr>
              <td className="border p-2">429</td>
              <td className="border p-2">Too Many Requests - Rate limit exceeded</td>
            </tr>
            <tr>
              <td className="border p-2">500</td>
              <td className="border p-2">Internal Server Error</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <p className="text-red-700">
            <strong>Error Response Format:</strong>
          </p>
          <pre className="bg-red-100 p-2 rounded mt-2">
{`{
  "status": "error",
  "code": 400,
  "message": "Invalid request parameters",
  "details": "The 'year' field must be between 1 and 5"
}`}
          </pre>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
        <p className="mb-3">
          API requests are limited to 1000 requests per hour per API key. 
          Rate limit headers are included in all responses:
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="overflow-x-auto">
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642173600`}
          </pre>
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
        
        <h3 className="font-semibold mb-2">JavaScript (Fetch)</h3>
        <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
          <pre className="overflow-x-auto">
            <code>
{`const API_KEY = 'your-api-key';
const response = await fetch('https://api.collegecompanion.com/v1/students', {
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
            </code>
          </pre>
        </div>

        <h3 className="font-semibold mb-2">Python</h3>
        <div className="bg-gray-900 text-white p-4 rounded-lg">
          <pre className="overflow-x-auto">
            <code>
{`import requests

API_KEY = 'your-api-key'
headers = {'Authorization': f'Bearer {API_KEY}'}
response = requests.get('https://api.collegecompanion.com/v1/students', headers=headers)
data = response.json()`}
            </code>
          </pre>
        </div>
      </section>

      {/* Support */}
      <section className="border-t pt-6">
        <h2 className="text-xl font-bold mb-2">Need Help?</h2>
        <p>
          Contact our API support at{' '}
          <a href="mailto:api@collegecompanion.com" className="text-blue-600 hover:underline">
            api@collegecompanion.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default APIReference;