// ===================================================================
// BREWQUEST CHRONICLES IMAGE MANAGEMENT SERVICE
// ===================================================================
// Comprehensive image handling for blog posts, beer reviews, and social media

import { supabase } from '@/lib/supabase/client'
import { createClient } from '@supabase/supabase-js'

// Image types for the brewing blog
export type ImageType = 
  | 'beer_bottle' | 'beer_can' | 'beer_glass' 
  | 'brewery_exterior' | 'brewery_interior' | 'brewery_logo'
  | 'state_culture' | 'hop_harrison' | 'social_media' 
  | 'blog_featured' | 'blog_inline'

export type ContentCategory = 
  | 'blog_post' | 'beer_review' | 'social_media' 
  | 'brewery_profile' | 'state_feature' | 'brand_asset' | 'stock_photo'

export type ImageRole = 
  | 'featured_image' | 'hero_image' | 'gallery_image' | 'inline_image'
  | 'thumbnail' | 'social_media' | 'background' | 'logo'

export interface ImageAsset {
  id: string
  filename: string
  original_filename: string
  file_path: string
  public_url: string
  alt_text?: string
  caption?: string
  image_type: ImageType
  content_category: ContentCategory
  state_code?: string
  week_number?: number
  brewery_name?: string
  beer_name?: string
  file_size_bytes: number
  width_pixels: number
  height_pixels: number
  format: 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'
  storage_bucket: string
  is_optimized: boolean
  optimization_settings: Record<string, any>
  usage_rights?: string
  source_attribution?: string
  created_at: string
  updated_at: string
  created_by?: string
  metadata: Record<string, any>
}

export interface ContentImage {
  id: string
  image_asset_id: string
  content_type: 'blog_post' | 'beer_review' | 'social_post' | 'brewery_feature'
  content_id: string
  image_role: ImageRole
  display_order: number
  is_primary: boolean
  crop_settings: Record<string, any>
  created_at: string
}

export interface ImageUploadOptions {
  imageType: ImageType
  contentCategory: ContentCategory
  stateCode?: string
  weekNumber?: number
  breweryName?: string
  beerName?: string
  altText?: string
  caption?: string
  usageRights?: string
  sourceAttribution?: string
  metadata?: Record<string, any>
}

export interface ImageOptimizationSettings {
  quality: number
  format: 'webp' | 'jpg' | 'png'
  sizes: {
    thumbnail: { width: number; height: number }
    medium: { width: number; height: number }
    large: { width: number; height: number }
    hero: { width: number; height: number }
  }
  socialMedia: {
    instagram: { width: number; height: number }
    twitter: { width: number; height: number }
    facebook: { width: number; height: number }
  }
}

class ImageManagementService {
  private supabase = supabase
  private storageBucket = 'brewquest-images'

  // Default optimization settings for different image types
  private optimizationSettings: Record<ImageType, ImageOptimizationSettings> = {
    beer_bottle: {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 150, height: 200 },
        medium: { width: 400, height: 600 },
        large: { width: 800, height: 1200 },
        hero: { width: 1200, height: 1800 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    brewery_exterior: {
      quality: 90,
      format: 'webp',
      sizes: {
        thumbnail: { width: 200, height: 150 },
        medium: { width: 600, height: 400 },
        large: { width: 1200, height: 800 },
        hero: { width: 1920, height: 1080 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    // Add more specific settings for each image type...
    beer_can: {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 150, height: 200 },
        medium: { width: 400, height: 600 },
        large: { width: 800, height: 1200 },
        hero: { width: 1200, height: 1800 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    beer_glass: {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 150, height: 200 },
        medium: { width: 400, height: 600 },
        large: { width: 800, height: 1200 },
        hero: { width: 1200, height: 1800 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    brewery_interior: {
      quality: 90,
      format: 'webp',
      sizes: {
        thumbnail: { width: 200, height: 150 },
        medium: { width: 600, height: 400 },
        large: { width: 1200, height: 800 },
        hero: { width: 1920, height: 1080 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    brewery_logo: {
      quality: 95,
      format: 'png',
      sizes: {
        thumbnail: { width: 100, height: 100 },
        medium: { width: 300, height: 300 },
        large: { width: 600, height: 600 },
        hero: { width: 1000, height: 1000 }
      },
      socialMedia: {
        instagram: { width: 500, height: 500 },
        twitter: { width: 400, height: 400 },
        facebook: { width: 500, height: 500 }
      }
    },
    state_culture: {
      quality: 90,
      format: 'webp',
      sizes: {
        thumbnail: { width: 200, height: 150 },
        medium: { width: 600, height: 400 },
        large: { width: 1200, height: 800 },
        hero: { width: 1920, height: 1080 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    hop_harrison: {
      quality: 95,
      format: 'webp',
      sizes: {
        thumbnail: { width: 150, height: 150 },
        medium: { width: 400, height: 400 },
        large: { width: 800, height: 800 },
        hero: { width: 1200, height: 1200 }
      },
      socialMedia: {
        instagram: { width: 500, height: 500 },
        twitter: { width: 400, height: 400 },
        facebook: { width: 500, height: 500 }
      }
    },
    social_media: {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 200, height: 200 },
        medium: { width: 600, height: 600 },
        large: { width: 1080, height: 1080 },
        hero: { width: 1200, height: 1200 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    blog_featured: {
      quality: 90,
      format: 'webp',
      sizes: {
        thumbnail: { width: 300, height: 200 },
        medium: { width: 800, height: 450 },
        large: { width: 1200, height: 675 },
        hero: { width: 1920, height: 1080 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    },
    blog_inline: {
      quality: 85,
      format: 'webp',
      sizes: {
        thumbnail: { width: 200, height: 150 },
        medium: { width: 600, height: 400 },
        large: { width: 800, height: 600 },
        hero: { width: 1200, height: 900 }
      },
      socialMedia: {
        instagram: { width: 1080, height: 1080 },
        twitter: { width: 1200, height: 675 },
        facebook: { width: 1200, height: 630 }
      }
    }
  }

  /**
   * Upload an image file to Supabase Storage with metadata
   */
  async uploadImage(
    file: File,
    options: ImageUploadOptions
  ): Promise<ImageAsset> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const cleanName = this.sanitizeFilename(file.name)
      const filename = `${options.stateCode?.toLowerCase() || 'misc'}-${options.weekNumber || 'week'}-${timestamp}-${cleanName}`
      
      // Create file path based on content organization
      const filePath = this.generateFilePath(options, filename)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(this.storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.storageBucket)
        .getPublicUrl(filePath)

      // Get image dimensions
      const dimensions = await this.getImageDimensions(file)
      
      // Create image asset record
      const imageAsset: Omit<ImageAsset, 'id' | 'created_at' | 'updated_at'> = {
        filename,
        original_filename: file.name,
        file_path: filePath,
        public_url: publicUrl,
        alt_text: options.altText,
        caption: options.caption,
        image_type: options.imageType,
        content_category: options.contentCategory,
        state_code: options.stateCode,
        week_number: options.weekNumber,
        brewery_name: options.breweryName,
        beer_name: options.beerName,
        file_size_bytes: file.size,
        width_pixels: dimensions.width,
        height_pixels: dimensions.height,
        format: (fileExt?.toLowerCase() || 'jpg') as ImageAsset['format'],
        storage_bucket: this.storageBucket,
        is_optimized: false,
        optimization_settings: this.optimizationSettings[options.imageType] || {},
        usage_rights: options.usageRights,
        source_attribution: options.sourceAttribution,
        metadata: options.metadata || {}
      }

      // Insert into database
      const { data: dbData, error: dbError } = await this.supabase
        .from('image_assets')
        .insert(imageAsset)
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await this.supabase.storage
          .from(this.storageBucket)
          .remove([filePath])
        throw new Error(`Database insert failed: ${dbError.message}`)
      }

      return dbData as ImageAsset
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  /**
   * Link an image to specific content
   */
  async linkImageToContent(
    imageAssetId: string,
    contentType: ContentImage['content_type'],
    contentId: string,
    imageRole: ImageRole,
    options: {
      isPrimary?: boolean
      displayOrder?: number
      cropSettings?: Record<string, any>
    } = {}
  ): Promise<ContentImage> {
    const contentImage = {
      image_asset_id: imageAssetId,
      content_type: contentType,
      content_id: contentId,
      image_role: imageRole,
      display_order: options.displayOrder || 1,
      is_primary: options.isPrimary || false,
      crop_settings: options.cropSettings || {}
    }

    const { data, error } = await this.supabase
      .from('content_images')
      .insert(contentImage)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to link image to content: ${error.message}`)
    }

    return data as ContentImage
  }

  /**
   * Get all images for a specific beer review
   */
  async getBeerReviewImages(reviewId: string): Promise<{
    image_url: string
    alt_text: string | null
    image_role: string
    is_primary: boolean
  }[]> {
    const { data, error } = await this.supabase
      .rpc('get_beer_review_images', { review_id: reviewId })

    if (error) {
      throw new Error(`Failed to get beer review images: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get images by state and week for content planning
   */
  async getStateWeekImages(
    stateCode: string,
    weekNumber: number
  ): Promise<ImageAsset[]> {
    const { data, error } = await this.supabase
      .from('image_assets')
      .select('*')
      .eq('state_code', stateCode)
      .eq('week_number', weekNumber)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get state week images: ${error.message}`)
    }

    return data as ImageAsset[]
  }

  /**
   * Generate optimized image variants for social media
   */
  async generateSocialMediaVariants(
    imageAssetId: string,
    platforms: ('instagram' | 'twitter' | 'facebook')[]
  ): Promise<{ [platform: string]: string }> {
    // This would integrate with image processing service
    // For now, return the original URL with query parameters for resizing
    const { data: asset, error } = await this.supabase
      .from('image_assets')
      .select('public_url, image_type')
      .eq('id', imageAssetId)
      .single()

    if (error || !asset) {
      throw new Error('Image asset not found')
    }

    const baseUrl = asset.public_url
    const settings = this.optimizationSettings[asset.image_type as ImageType]
    const variants: { [platform: string]: string } = {}

    platforms.forEach(platform => {
      const dimensions = settings.socialMedia[platform]
      // Add transformation parameters (this would depend on your CDN/image service)
      variants[platform] = `${baseUrl}?width=${dimensions.width}&height=${dimensions.height}&format=webp&quality=85`
    })

    return variants
  }

  /**
   * Search images by brewery or beer name
   */
  async searchImages(query: string, filters?: {
    imageType?: ImageType
    contentCategory?: ContentCategory
    stateCode?: string
    weekNumber?: number
  }): Promise<ImageAsset[]> {
    let queryBuilder = this.supabase
      .from('image_assets')
      .select('*')

    // Add text search
    if (query) {
      queryBuilder = queryBuilder.or(`brewery_name.ilike.%${query}%,beer_name.ilike.%${query}%,alt_text.ilike.%${query}%`)
    }

    // Add filters
    if (filters?.imageType) {
      queryBuilder = queryBuilder.eq('image_type', filters.imageType)
    }
    if (filters?.contentCategory) {
      queryBuilder = queryBuilder.eq('content_category', filters.contentCategory)
    }
    if (filters?.stateCode) {
      queryBuilder = queryBuilder.eq('state_code', filters.stateCode)
    }
    if (filters?.weekNumber) {
      queryBuilder = queryBuilder.eq('week_number', filters.weekNumber)
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Image search failed: ${error.message}`)
    }

    return data as ImageAsset[]
  }

  /**
   * Get image usage analytics
   */
  async getImageUsageAnalytics(imageAssetId: string): Promise<{
    total_usage: number
    usage_by_content_type: { [key: string]: number }
    linked_content: Array<{
      content_type: string
      content_id: string
      image_role: string
    }>
  }> {
    const { data, error } = await this.supabase
      .from('content_images')
      .select('content_type, content_id, image_role')
      .eq('image_asset_id', imageAssetId)

    if (error) {
      throw new Error(`Failed to get image usage: ${error.message}`)
    }

    const usage = data || []
    const usageByType = usage.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    return {
      total_usage: usage.length,
      usage_by_content_type: usageByType,
      linked_content: usage
    }
  }

  /**
   * Bulk upload images with metadata from CSV/JSON
   */
  async bulkUploadImages(
    files: File[],
    metadata: ImageUploadOptions[]
  ): Promise<{ successful: ImageAsset[]; failed: { file: string; error: string }[] }> {
    const results = {
      successful: [] as ImageAsset[],
      failed: [] as { file: string; error: string }[]
    }

    for (let i = 0; i < files.length; i++) {
      try {
        const asset = await this.uploadImage(files[i], metadata[i])
        results.successful.push(asset)
      } catch (error) {
        results.failed.push({
          file: files[i].name,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  // Helper methods
  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private generateFilePath(options: ImageUploadOptions, filename: string): string {
    const { imageType, stateCode, weekNumber } = options
    
    // Organize files by content type and state
    const basePath = `${imageType.replace('_', '-')}`
    const statePath = stateCode ? `/${stateCode.toLowerCase()}` : '/misc'
    const weekPath = weekNumber ? `/week-${weekNumber}` : ''
    
    return `${basePath}${statePath}${weekPath}/${filename}`
  }

  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        resolve({ width: 800, height: 600 }) // Default dimensions
      }
      img.src = URL.createObjectURL(file)
    })
  }
}

// Export singleton instance
export const imageService = new ImageManagementService()

// Utility functions for common image operations
export const imageUtils = {
  /**
   * Get the primary image for a beer review
   */
  async getPrimaryBeerImage(reviewId: string): Promise<string | null> {
    const images = await imageService.getBeerReviewImages(reviewId)
    const primaryImage = images.find(img => img.is_primary) || images[0]
    return primaryImage?.image_url || null
  },

  /**
   * Generate alt text for beer images
   */
  generateBeerAltText(beerName: string, breweryName: string, imageType: ImageType): string {
    const typeDescriptions = {
      beer_bottle: 'bottle',
      beer_can: 'can',
      beer_glass: 'glass',
      brewery_exterior: 'brewery exterior',
      brewery_interior: 'brewery interior',
      brewery_logo: 'logo'
    }

    const description = typeDescriptions[imageType as keyof typeof typeDescriptions] || 'image'
    return `${beerName} by ${breweryName} - ${description}`
  },

  /**
   * Validate image file before upload
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File must be JPEG, PNG, or WebP format' }
    }

    return { isValid: true }
  }
}