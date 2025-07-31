export default function AdminSocialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Social Media Management</h2>
        <p className="text-gray-600">
          Schedule posts, track engagement, and manage your social media presence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Scheduled Posts</h3>
            <p className="text-gray-600">
              Social media scheduling will be implemented in Phase 2.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
            <div className="space-y-3">
              {[
                { platform: 'Instagram', followers: '2.3K' },
                { platform: 'Twitter', followers: '1.8K' },
                { platform: 'Facebook', followers: '956' },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{stat.platform}</span>
                  <span className="font-semibold">{stat.followers}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                Schedule Post
              </button>
              <button className="btn-primary w-full">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 