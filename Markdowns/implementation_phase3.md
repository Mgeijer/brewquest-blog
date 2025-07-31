# Phase 3: Admin Dashboard & Content Management (Week 5-6)

## Step 11: Admin Dashboard Layout

### 11.1 Admin Layout with Sidebar
```typescript
// app/(dashboard)/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 11.2 Admin Sidebar Component
```typescript
// components/admin/AdminSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Beer, 
  Calendar, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Beer Reviews', href: '/admin/reviews', icon: Beer },
  { name: 'Social Media', href: '/admin/social', icon: Calendar },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-beer-dark">BrewQuest</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-beer-amber text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Stats (when expanded) */}
      {!collapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-beer-cream/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-beer-dark mb-2">
              Quick Stats
            </h3>
            <div className="space-y-1 text-sm text-beer-brown">
              <div>Published Posts: 12</div>
              <div>Scheduled Posts: 8</div>
              <div>Total Views: 15.2K</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Step 12: Blog Post Editor

### 12.1 Rich Text Editor Component
```typescript
// components/admin/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  ImageIcon,
  Link as LinkIcon
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-beer-amber hover:text-beer-gold underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('blockquote') ? 'bg-gray-200' : ''
          }`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

### 12.2 Blog Post Editor Page
```typescript
// app/(dashboard)/admin/blog/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { SEOOptimizer } from '@/components/admin/SEOOptimizer'
import { BlogPost } from '@/lib/types/blog'

interface BlogEditorPageProps {
  params: { id: string }
}

export default function BlogEditorPage({ params }: BlogEditorPageProps) {
  const router = useRouter()
  const isNewPost = params.id === 'new'
  
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    state: '',
    week_number: 1,
    read_time: 5,
    seo_meta_description: '',
    seo_keywords: [],
    is_featured: false,
  })
  
  const [loading, setLoading] = useState(!isNewPost)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNewPost) {
      loadPost()
    }
  }, [params.id])

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const savePost = async (status: 'draft' | 'published') => {
    setSaving(true)
    try {
      const postData = {
        ...post,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      if (isNewPost) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single()

        if (error) throw error
        router.push(`/admin/blog/${data.id}`)
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', params.id)

        if (error) throw error
      }

      alert(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`)
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNewPost ? 'Create New Post' : 'Edit Post'}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                placeholder="Enter post title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={post.slug || ''}
                onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                placeholder="url-slug"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={post.state || ''}
                onChange={(e) => setPost(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
              >
                <option value="">Select State</option>
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                {/* Add all states */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Number
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={post.week_number || 1}
                onChange={(e) => setPost(prev => ({ ...prev, week_number: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={post.excerpt || ''}
              onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
              placeholder="Brief description of the post..."
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Featured Image</h2>
          <ImageUploader
            currentImage={post.featured_image_url}
            onImageUpload={(url) => setPost(prev => ({ ...prev, featured_image_url: url }))}
          />
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Content</h2>
          <RichTextEditor
            content={post.content || ''}
            onChange={(content) => setPost(prev => ({ ...prev, content }))}
            placeholder="Start writing your blog post..."
          />
        </div>

        {/* SEO Optimization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          <SEOOptimizer
            post={post}
            onChange={(seoData) => setPost(prev => ({ ...prev, ...seoData }))}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          
          <div className="space-x-4">
            <button
              onClick={() => savePost('draft')}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => savePost('published')}
              disabled={saving}
              className="px-6 py-2 bg-beer-amber text-white rounded-md hover:bg-beer-gold disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Step 13: AI Content Generation Integration

### 13.1 Content Generator Service
```typescript
// lib/ai/contentGenerator.ts
interface BreweryData {
  name: string
  location: string
  flagship_beer: string
  style: string
  unique_feature?: string
  founded?: number
  story?: string
}

interface ContentGenerationRequest {
  state: string
  weekNumber: number
  breweries: BreweryData[]
}

interface GeneratedBlogPost {
  title: string
  content: string
  excerpt: string
  seoKeywords: string[]
  metaDescription: string
}

interface GeneratedBeerReview {
  breweryName: string
  beerName: string
  beerStyle: string
  tastingNotes: string
  uniqueFeature: string
  rating: number
  breweryStory: string
  socialPostContent: string
  hashtags: string[]
}

export class ContentGenerator {
  private anthropicApiKey: string

  constructor() {
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || ''
  }

  async generateWeeklyContent(request: ContentGenerationRequest) {
    try {
      const blogPost = await this.generateBlogPost(request)
      const beerReviews = await this.generateBeerReviews(request.breweries, request.state)
      
      return {
        blogPost,
        beerReviews,
        socialPosts: await this.generateSocialPosts(beerReviews)
      }
    } catch (error) {
      console.error('Error generating content:', error)
      throw error
    }
  }

  async generateBlogPost(request: ContentGenerationRequest): Promise<GeneratedBlogPost> {
    const prompt = `
Create a comprehensive beer blog post for ${request.state} following the Hop Harrison voice and style:

STATE: ${request.state}
WEEK: ${request.weekNumber}
BREWERIES: ${JSON.stringify(request.breweries, null, 2)}

REQUIREMENTS:
- 2000-2500 words total
- Engaging introduction highlighting state's unique beer culture
- Overview of the 7 featured breweries
- State brewing history section
- Personal, conversational tone like Hop Harrison
- SEO optimized with relevant keywords
- Include calls-to-action for social media engagement

VOICE: Hop Harrison - enthusiastic but approachable beer lover who bridges novices and experts

OUTPUT FORMAT: 
{
  "title": "Engaging title for the post",
  "content": "Full HTML content of the blog post",
  "excerpt": "150-200 word summary",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "metaDescription": "SEO meta description under 160 characters"
}

Generate only valid JSON with no additional text.
`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    })

    const data = await response.json()
    const responseText = data.content[0].text
    
    // Clean up response and parse JSON
    const cleanedResponse = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(cleanedResponse)
  }

  async generateBeerReviews(breweries: BreweryData[], state: string): Promise<GeneratedBeerReview[]> {
    const reviews = []
    
    for (let i = 0; i < breweries.length; i++) {
      const brewery = breweries[i]
      const dayOfWeek = i + 1
      
      const prompt = `
Create a detailed beer review for Day ${dayOfWeek} of ${state} week:

BREWERY: ${brewery.name}
LOCATION: ${brewery.location}
BEER: ${brewery.flagship_beer}
STYLE: ${brewery.style}
UNIQUE FEATURE: ${brewery.unique_feature || 'To be determined'}

REQUIREMENTS:
- 200-300 word tasting notes in Hop Harrison's voice
- Rating from 1-5 (be realistic, most should be 4-5)
- Brewery story highlighting what makes them special
- Social media post content for Instagram
- Relevant hashtags for beer style and location

VOICE: Hop Harrison - knowledgeable but accessible, focuses on stories and experience

OUTPUT FORMAT:
{
  "breweryName": "${brewery.name}",
  "beerName": "${brewery.flagship_beer}",
  "beerStyle": "${brewery.style}",
  "tastingNotes": "Detailed tasting notes with Hop's personal perspective",
  "uniqueFeature": "What makes this beer/brewery special",
  "rating": 4,
  "breweryStory": "Background about the brewery and its community impact",
  "socialPostContent": "Instagram-ready post content",
  "hashtags": ["#CraftBeer", "#${state}Beer", "#${brewery.style.replace(/\s+/g, '')}"]
}

Generate only valid JSON with no additional text.
`

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      })

      const data = await response.json()
      const responseText = data.content[0].text
      const cleanedResponse = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      
      reviews.push(JSON.parse(cleanedResponse))
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return reviews
  }

  async generateSocialPosts(beerReviews: GeneratedBeerReview[]) {
    // Generate platform-specific social media posts
    const socialPosts = []
    
    for (const review of beerReviews) {
      const platforms = ['instagram', 'twitter', 'facebook', 'tiktok']
      
      for (const platform of platforms) {
        const prompt = `
Create a ${platform} post for this beer review:

BEER: ${review.beerName} by ${review.breweryName}
STYLE: ${review.beerStyle}
UNIQUE FEATURE: ${review.uniqueFeature}

PLATFORM REQUIREMENTS:
${this.getPlatformRequirements(platform)}

TONE: Hop Harrison - enthusiastic but approachable beer lover
INCLUDE: Relevant hashtags optimized for ${platform}
CALL-TO-ACTION: Encourage engagement and sharing

OUTPUT: Platform-optimized post with hashtags and engagement hooks (plain text, no JSON)
`

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 500,
            messages: [{ role: "user", content: prompt }]
          })
        })

        const data = await response.json()
        
        socialPosts.push({
          beer_review_id: '', // Will be set when saving
          platform,
          content: data.content[0].text,
          hashtags: review.hashtags,
          status: 'draft'
        })
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    return socialPosts
  }

  private getPlatformRequirements(platform: string): string {
    const requirements = {
      instagram: `
- 2200 character limit
- Visual-focused content
- Use 5-10 relevant hashtags
- Include emoji for engagement
- Encourage story interactions`,
      twitter: `
- 280 character limit
- Concise and punchy
- Use 2-3 hashtags maximum
- Include thread potential
- Encourage retweets`,
      facebook: `
- Longer form content allowed
- Community-focused messaging
- Ask engaging questions
- Include call-to-action
- Use 1-2 hashtags`,
      tiktok: `
- Short, catchy hook
- Video content description
- Trending hashtags
- Generation Z friendly language
- Encourage duets/responses`
    }
    
    return requirements[platform] || requirements.instagram
  }
}
```

### 13.2 Content Generation API Route
```typescript
// app/api/generate/content/route.ts
import { NextResponse } from 'next/server'
import { ContentGenerator } from '@/lib/ai/contentGenerator'
import { supabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { state, weekNumber, breweries } = body

    if (!state || !weekNumber || !breweries || breweries.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const generator = new ContentGenerator()
    const generatedContent = await generator.generateWeeklyContent({
      state,
      weekNumber,
      breweries
    })

    // Save to database
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .insert([{
        title: generatedContent.blogPost.title,
        content: generatedContent.blogPost.content,
        excerpt: generatedContent.blogPost.excerpt,
        state,
        week_number: weekNumber,
        slug: generateSlug(generatedContent.blogPost.title),
        seo_meta_description: generatedContent.blogPost.metaDescription,
        seo_keywords: generatedContent.blogPost.seoKeywords,
        read_time: estimateReadTime(generatedContent.blogPost.content)
      }])
      .select()
      .single()

    if (blogError) throw blogError

    // Save beer reviews
    const beerReviewsData = generatedContent.beerReviews.map((review, index) => ({
      blog_post_id: blogPost.id,
      brewery_name: review.breweryName,
      beer_name: review.beerName,
      beer_style: review.beerStyle,
      rating: review.rating,
      tasting_notes: review.tastingNotes,
      unique_feature: review.uniqueFeature,
      brewery_story: review.breweryStory,
      day_of_week: index + 1
    }))

    const { data: beerReviews, error: reviewError } = await supabase
      .from('beer_reviews')
      .insert(beerReviewsData)
      .select()

    if (reviewError) throw reviewError

    // Save social posts
    const socialPostsData = generatedContent.socialPosts.map((post, index) => ({
      beer_review_id: beerReviews[Math.floor(index / 4)].id,
      platform: post.platform,
      content: post.content,
      hashtags: post.hashtags,
      status: 'draft'
    }))

    await supabase
      .from('social_posts')
      .insert(socialPostsData)

    return NextResponse.json({
      success: true,
      blogPostId: blogPost.id,
      message: 'Content generated successfully'
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
```

## Step 14: Content Generation UI

### 14.1 Content Generation Wizard
```typescript
// components/admin/ContentGenerationWizard.tsx
'use client'

import { useState } from 'react'
import { Wand2, Plus, Trash2, Upload } from 'lucide-react'

interface BreweryInput {
  name: string
  location: string
  flagship_beer: string
  style: string
  unique_feature: string
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', // ... full list
]

const BEER_STYLES = [
  'IPA', 'Pale Ale', 'Lager', 'Stout', 'Porter', 'Wheat Beer', 
  'Sour Ale', 'Belgian Ale', 'Pilsner', 'Amber Ale'
]

export function ContentGenerationWizard() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState('')
  const [weekNumber, setWeekNumber] = useState(1)
  const [breweries, setBreweries] = useState<BreweryInput[]>([
    { name: '', location: '', flagship_beer: '', style: '', unique_feature: '' }
  ])
  const [generating, setGenerating] = useState(false)

  const addBrewery = () => {
    if (breweries.length < 7) {
      setBreweries([...breweries, { 
        name: '', location: '', flagship_beer: '', style: '', unique_feature: '' 
      }])
    }
  }

  const removeBrewery = (index: number) => {
    setBreweries(breweries.filter((_, i) => i !== index))
  }

  const updateBrewery = (index: number, field: keyof BreweryInput, value: string) => {
    const updated = [...breweries]
    updated[index][field] = value
    setBreweries(updated)
  }

  const generateContent = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          weekNumber,
          breweries: breweries.filter(b => b.name && b.flagship_beer)
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Content generated successfully!')
        // Reset form or redirect
      } else {
        alert('Error generating content: ' + result.error)
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Content Generation
        </h1>
        <p className="text-gray-600">
          Generate a complete week of blog content for any state
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-beer-amber' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 1 ? 'border-beer-amber bg-beer-amber text-white' : 'border-gray-300'
          }`}>
            1
          </div>
          <span className="ml-2 font-medium">State & Week</span>
        </div>
        <div className="w-12 h-px bg-gray-300 mx-4" />
        <div className={`flex items-center ${step >= 2 ? 'text-beer-amber' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 2 ? 'border-beer-amber bg-beer-amber text-white' : 'border-gray-300'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Breweries</span>
        </div>
        <div className="w-12 h-px bg-gray-300 mx-4" />
        <div className={`flex items-center ${step >= 3 ? 'text-beer-amber' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 3 ? 'border-beer-amber bg-beer-amber text-white' : 'border-gray-300'
          }`}>
            3
          </div>
          <span className="ml-2 font-medium">Generate</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">State and Week Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
              >
                <option value="">Select State</option>
                {US_STATES.map(stateName => (
                  <option key={stateName} value={stateName}>{stateName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Number
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!state}
              className="btn-primary disabled:opacity-50"
            >
              Next: Add Breweries
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Breweries ({breweries.length}/7)</h2>
            <button
              onClick={addBrewery}
              disabled={breweries.length >= 7}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-beer-amber text-white rounded hover:bg-beer-gold disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Brewery</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {breweries.map((brewery, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Brewery #{index + 1}</h3>
                  {breweries.length > 1 && (
                    <button
                      onClick={() => removeBrewery(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Brewery Name"
                    value={brewery.name}
                    onChange={(e) => updateBrewery(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                  />
                  <input
                    type="text"
                    placeholder="Location (City, State)"
                    value={brewery.location}
                    onChange={(e) => updateBrewery(index, 'location', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                  />
                  <input
                    type="text"
                    placeholder="Featured Beer Name"
                    value={brewery.flagship_beer}
                    onChange={(e) => updateBrewery(index, 'flagship_beer', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                  />
                  <select
                    value={brewery.style}
                    onChange={(e) => updateBrewery(index, 'style', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                  >
                    <option value="">Select Style</option>
                    {BEER_STYLES.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="What makes this brewery/beer unique?"
                  value={brewery.unique_feature}
                  onChange={(e) => updateBrewery(index, 'unique_feature', e.target.value)}
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={breweries.filter(b => b.name && b.flagship_beer).length === 0}
              className="btn-primary disabled:opacity-50"
            >
              Next: Generate Content
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Content</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Content Preview:</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p><strong>State:</strong> {state}</p>
              <p><strong>Week:</strong> {weekNumber}</p>
              <p><strong>Breweries:</strong> {breweries.filter(b => b.name).length}</p>
              <p><strong>Will Generate:</strong></p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>1 comprehensive blog post (2000+ words)</li>
                <li>{breweries.filter(b => b.name).length} beer reviews</li>
                <li>{breweries.filter(b => b.name).length * 4} social media posts</li>
                <li>SEO optimization and meta data</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <button
              onClick={generateContent}
              disabled={generating}
              className="flex items-center space-x-2 btn-primary disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              <span>{generating ? 'Generating...' : 'Generate Content'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Cursor Prompts for Phase 3

### Prompt 1: Admin Dashboard Setup
```
Create a comprehensive admin dashboard with:

1. AdminSidebar with collapsible navigation
2. AdminHeader with user info and notifications
3. Dashboard overview with key metrics
4. Responsive design for mobile admin access
5. Quick action buttons for common tasks

Include proper TypeScript types and smooth animations.
```

### Prompt 2: Rich Text Editor Integration
```
Integrate TipTap rich text editor with:

1. Complete toolbar with formatting options
2. Image upload integration
3. Link insertion and management
4. Custom styling for beer blog content
5. Auto-save functionality
6. Content preview mode

Add proper error handling and loading states.
```

### Prompt 3: AI Content Generation System
```
Build AI content generation system with:

1. ContentGenerator class with Claude API integration
2. Multi-step wizard for brewery input
3. Batch content generation for multiple weeks
4. Quality validation and review workflow
5. Integration with database storage
6. Progress tracking and error handling

Include rate limiting and proper API error handling.
```

## Next Phase Preview
Phase 4 will cover:
- Social media automation system
- Analytics and performance tracking
- BrewMetrics integration points
- Testing and quality assurance
- Deployment and CI/CD setup