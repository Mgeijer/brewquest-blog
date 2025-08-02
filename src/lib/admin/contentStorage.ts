// Shared in-memory storage for admin content management
// In production, this would be replaced with database operations

export type ContentStatus = 'pending' | 'approved' | 'rejected'

// Storage for content approval status
const contentApprovalStatus = new Map<string, ContentStatus>()

// Storage for edited content
const editedContent = new Map<string, string>()

export const AdminStorage = {
  // Approval status methods
  getApprovalStatus: (contentId: string): ContentStatus => {
    return contentApprovalStatus.get(contentId) || 'pending'
  },
  
  setApprovalStatus: (contentId: string, status: ContentStatus): void => {
    contentApprovalStatus.set(contentId, status)
  },
  
  bulkSetApprovalStatus: (contentIds: string[], status: ContentStatus): void => {
    contentIds.forEach(id => {
      contentApprovalStatus.set(id, status)
    })
  },
  
  getAllApprovalStatus: (): Map<string, ContentStatus> => {
    return new Map(contentApprovalStatus)
  },
  
  // Content editing methods
  getEditedContent: (contentId: string): string | undefined => {
    return editedContent.get(contentId)
  },
  
  setEditedContent: (contentId: string, content: string): void => {
    editedContent.set(contentId, content)
  },
  
  getAllEditedContent: (): Map<string, string> => {
    return new Map(editedContent)
  },
  
  // Reset methods for testing/development
  resetApprovalStatus: (): void => {
    contentApprovalStatus.clear()
  },
  
  resetEditedContent: (): void => {
    editedContent.clear()
  },
  
  resetAll: (): void => {
    contentApprovalStatus.clear()
    editedContent.clear()
  }
}