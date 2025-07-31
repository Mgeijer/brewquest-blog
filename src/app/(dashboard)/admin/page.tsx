import { Calendar, FileText, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    name: 'Total Blog Posts',
    value: '42',
    change: '+2',
    changeType: 'increase' as const,
    icon: FileText,
  },
  {
    name: 'Newsletter Subscribers',
    value: '1,247',
    change: '+47',
    changeType: 'increase' as const,
    icon: Users,
  },
  {
    name: 'Monthly Views',
    value: '24,389',
    change: '+12.5%',
    changeType: 'increase' as const,
    icon: TrendingUp,
  },
  {
    name: 'States Covered',
    value: '8',
    change: '+1',
    changeType: 'increase' as const,
    icon: Calendar,
  },
];

const recentPosts = [
  {
    title: 'Exploring California\'s Craft Beer Scene',
    state: 'California',
    publishedAt: '2024-01-15',
    views: 1234,
  },
  {
    title: 'Texas BBQ and Beer: A Perfect Pairing',
    state: 'Texas',
    publishedAt: '2024-01-08',
    views: 2341,
  },
  {
    title: 'Colorado\'s Mountain Breweries',
    state: 'Colorado',
    publishedAt: '2024-01-01',
    views: 1876,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back, Hop!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your beer blog today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card p-6 rounded-lg border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">Recent Blog Posts</h3>
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.state} • {post.publishedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{post.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Create New Blog Post</div>
              <div className="text-sm text-muted-foreground">
                Start writing about this week's brewery visits
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Schedule Social Posts</div>
              <div className="text-sm text-muted-foreground">
                Plan your social media content for the week
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-muted-foreground">
                Check your blog performance and engagement
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">50-State Journey Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>States Completed</span>
            <span>8 of 50 (16%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: '16%' }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You're making great progress! 42 states to go. Keep up the amazing work documenting America's craft beer scene.
        </p>
      </div>
    </div>
  );
} 