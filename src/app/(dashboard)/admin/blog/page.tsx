export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Blog Management</h2>
        <p className="text-gray-600">
          Create, edit, and manage your blog posts and beer reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
            <p className="text-gray-600">
              Blog post management will be implemented in Phase 2.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                New Blog Post
              </button>
              <button className="btn-primary w-full">
                New Beer Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 