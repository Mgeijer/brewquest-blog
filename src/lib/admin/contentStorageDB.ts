// Database-backed content storage for admin content management
// Replaces in-memory storage to persist approvals across deployments

import { supabase } from '@/lib/supabase/client'

export type ContentStatus = 'pending' | 'approved' | 'rejected'

export interface ContentApproval {
  id: string
  content_id: string
  content_type: string
  status: ContentStatus
  approved_by?: string
  approved_at?: string
  rejected_by?: string
  rejected_at?: string
  rejection_reason?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface ContentEdit {
  id: string
  content_id: string
  original_content?: string
  edited_content: string
  edited_by?: string
  edit_reason?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const AdminStorageDB = {
  // Approval status methods
  getApprovalStatus: async (contentId: string): Promise<ContentStatus> => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select('status')
        .eq('content_id', contentId)
        .single()
      
      if (error) {
        console.log(`No approval record for ${contentId}, defaulting to pending`)
        return 'pending'
      }
      
      return data.status as ContentStatus
    } catch (error) {
      console.error('Error getting approval status:', error)
      return 'pending'
    }
  },
  
  setApprovalStatus: async (contentId: string, status: ContentStatus, adminUser?: string): Promise<boolean> => {
    try {
      const updateData: any = {
        content_id: contentId,
        status,
        updated_at: new Date().toISOString()
      }
      
      // Set appropriate timestamps and user info
      if (status === 'approved') {
        updateData.approved_by = adminUser || 'admin'
        updateData.approved_at = new Date().toISOString()
        updateData.rejected_by = null
        updateData.rejected_at = null
        updateData.rejection_reason = null
      } else if (status === 'rejected') {
        updateData.rejected_by = adminUser || 'admin'
        updateData.rejected_at = new Date().toISOString()
        updateData.approved_by = null
        updateData.approved_at = null
      }
      
      const { error } = await supabase
        .from('content_approvals')
        .upsert(updateData, { 
          onConflict: 'content_id',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Error setting approval status:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error setting approval status:', error)
      return false
    }
  },
  
  bulkSetApprovalStatus: async (contentIds: string[], status: ContentStatus, adminUser?: string): Promise<boolean> => {
    try {
      const timestamp = new Date().toISOString()
      const updates = contentIds.map(contentId => {
        const updateData: any = {
          content_id: contentId,
          status,
          updated_at: timestamp
        }
        
        if (status === 'approved') {
          updateData.approved_by = adminUser || 'admin'
          updateData.approved_at = timestamp
          updateData.rejected_by = null
          updateData.rejected_at = null
          updateData.rejection_reason = null
        } else if (status === 'rejected') {
          updateData.rejected_by = adminUser || 'admin'
          updateData.rejected_at = timestamp
          updateData.approved_by = null
          updateData.approved_at = null
        }
        
        return updateData
      })
      
      const { error } = await supabase
        .from('content_approvals')
        .upsert(updates, { 
          onConflict: 'content_id',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Error bulk setting approval status:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error bulk setting approval status:', error)
      return false
    }
  },
  
  getAllApprovalStatus: async (): Promise<Map<string, ContentStatus>> => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select('content_id, status')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error getting all approval status:', error)
        return new Map()
      }
      
      const statusMap = new Map<string, ContentStatus>()
      data?.forEach(item => {
        statusMap.set(item.content_id, item.status as ContentStatus)
      })
      
      return statusMap
    } catch (error) {
      console.error('Error getting all approval status:', error)
      return new Map()
    }
  },

  getContentApproval: async (contentId: string): Promise<ContentApproval | null> => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select('*')
        .eq('content_id', contentId)
        .single()
      
      if (error) {
        return null
      }
      
      return data as ContentApproval
    } catch (error) {
      console.error('Error getting content approval:', error)
      return null
    }
  },

  getPendingApprovals: async (): Promise<ContentApproval[]> => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error getting pending approvals:', error)
        return []
      }
      
      return data as ContentApproval[]
    } catch (error) {
      console.error('Error getting pending approvals:', error)
      return []
    }
  },
  
  // Content editing methods
  getEditedContent: async (contentId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('content_edits')
        .select('edited_content')
        .eq('content_id', contentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) {
        return null
      }
      
      return data.edited_content
    } catch (error) {
      console.error('Error getting edited content:', error)
      return null
    }
  },
  
  setEditedContent: async (contentId: string, content: string, adminUser?: string, editReason?: string, originalContent?: string): Promise<boolean> => {
    try {
      // Mark any existing edits as inactive
      await supabase
        .from('content_edits')
        .update({ is_active: false })
        .eq('content_id', contentId)
      
      // Insert new edit
      const { error } = await supabase
        .from('content_edits')
        .insert({
          content_id: contentId,
          edited_content: content,
          edited_by: adminUser || 'admin',
          edit_reason: editReason,
          original_content: originalContent,
          is_active: true
        })
      
      if (error) {
        console.error('Error setting edited content:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error setting edited content:', error)
      return false
    }
  },
  
  getAllEditedContent: async (): Promise<Map<string, string>> => {
    try {
      const { data, error } = await supabase
        .from('content_edits')
        .select('content_id, edited_content')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error getting all edited content:', error)
        return new Map()
      }
      
      const contentMap = new Map<string, string>()
      data?.forEach(item => {
        contentMap.set(item.content_id, item.edited_content)
      })
      
      return contentMap
    } catch (error) {
      console.error('Error getting all edited content:', error)
      return new Map()
    }
  },

  // Analytics and reporting methods
  getApprovalStats: async (): Promise<{
    pending: number
    approved: number
    rejected: number
    total: number
  }> => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .select('status')
      
      if (error) {
        console.error('Error getting approval stats:', error)
        return { pending: 0, approved: 0, rejected: 0, total: 0 }
      }
      
      const stats = { pending: 0, approved: 0, rejected: 0, total: data.length }
      data.forEach(item => {
        stats[item.status as ContentStatus]++
      })
      
      return stats
    } catch (error) {
      console.error('Error getting approval stats:', error)
      return { pending: 0, approved: 0, rejected: 0, total: 0 }
    }
  },

  // Migration helper - create approval record if it doesn't exist
  ensureApprovalRecord: async (contentId: string, contentType: string = 'social_post'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('content_approvals')
        .upsert({
          content_id: contentId,
          content_type: contentType,
          status: 'pending'
        }, { 
          onConflict: 'content_id',
          ignoreDuplicates: true 
        })
      
      if (error) {
        console.error('Error ensuring approval record:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error ensuring approval record:', error)
      return false
    }
  }
}

// Legacy compatibility - provide both old and new interfaces
export const AdminStorage = {
  // Legacy methods that delegate to DB versions
  getApprovalStatus: (contentId: string): Promise<ContentStatus> => 
    AdminStorageDB.getApprovalStatus(contentId),
  
  setApprovalStatus: (contentId: string, status: ContentStatus): Promise<boolean> => 
    AdminStorageDB.setApprovalStatus(contentId, status),
  
  bulkSetApprovalStatus: (contentIds: string[], status: ContentStatus): Promise<boolean> => 
    AdminStorageDB.bulkSetApprovalStatus(contentIds, status),
  
  getAllApprovalStatus: (): Promise<Map<string, ContentStatus>> => 
    AdminStorageDB.getAllApprovalStatus(),
  
  getEditedContent: (contentId: string): Promise<string | null> => 
    AdminStorageDB.getEditedContent(contentId),
  
  setEditedContent: (contentId: string, content: string): Promise<boolean> => 
    AdminStorageDB.setEditedContent(contentId, content),
  
  getAllEditedContent: (): Promise<Map<string, string>> => 
    AdminStorageDB.getAllEditedContent(),
  
  // These methods are no longer needed with DB persistence, but kept for compatibility
  resetApprovalStatus: (): void => {
    console.warn('resetApprovalStatus is deprecated with database storage')
  },
  
  resetEditedContent: (): void => {
    console.warn('resetEditedContent is deprecated with database storage')
  },
  
  resetAll: (): void => {
    console.warn('resetAll is deprecated with database storage')
  }
}