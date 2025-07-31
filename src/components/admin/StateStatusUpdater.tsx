'use client'

/**
 * State Status Updater Component
 * 
 * Advanced interface for updating individual state details and performing
 * bulk operations with comprehensive form controls and validation.
 */

import React, { useState, useCallback, useEffect } from 'react'
import { StateProgress } from '@/lib/supabase/functions/stateProgressFunctions'
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin, 
  Star,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download
} from 'lucide-react'

// ==================================================
// Type Definitions
// ==================================================

interface StateStatusUpdaterProps {
  selectedStates: string[]
  onUpdate: (stateCode: string, updates: Partial<StateProgress>) => Promise<void>
  onBulkUpdate: (bulkUpdate: any) => Promise<void>
  className?: string
}

interface StateFormData {
  state_code: string
  state_name: string
  status: 'upcoming' | 'current' | 'completed'
  week_number: number
  description: string
  featured_breweries: string[]
  total_breweries: number
  difficulty_rating: number
  research_hours: number
  journey_highlights: string[]
}

interface BulkUpdateForm {
  status?: 'upcoming' | 'current' | 'completed'
  difficulty_rating?: number
  add_featured_breweries?: string[]
  remove_featured_breweries?: string[]
  append_description?: string
  research_hours_increment?: number
}

// ==================================================
// Individual State Editor
// ==================================================

function StateEditor({ 
  stateCode, 
  onUpdate, 
  onClose 
}: { 
  stateCode: string
  onUpdate: (stateCode: string, updates: Partial<StateProgress>) => Promise<void>
  onClose: () => void 
}) {
  const [formData, setFormData] = useState<Partial<StateFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = useCallback((field: keyof StateFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const handleArrayAdd = useCallback((field: 'featured_breweries' | 'journey_highlights', value: string) => {
    if (!value.trim()) return
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }))
    setHasChanges(true)
  }, [])

  const handleArrayRemove = useCallback((field: 'featured_breweries' | 'journey_highlights', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }))
    setHasChanges(true)
  }, [])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (formData.week_number && (formData.week_number < 1 || formData.week_number > 50)) {
      newErrors.week_number = 'Week number must be between 1 and 50'
    }

    if (formData.difficulty_rating && (formData.difficulty_rating < 1 || formData.difficulty_rating > 5)) {
      newErrors.difficulty_rating = 'Difficulty rating must be between 1 and 5'
    }

    if (formData.total_breweries && formData.total_breweries < 0) {
      newErrors.total_breweries = 'Total breweries cannot be negative'
    }

    if (formData.research_hours && formData.research_hours < 0) {
      newErrors.research_hours = 'Research hours cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSave = useCallback(async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '' && value !== null)
      )
      
      await onUpdate(stateCode, cleanedData)
      setHasChanges(false)
      onClose()
    } catch (error) {
      console.error('Failed to update state:', error)
      setErrors({ general: 'Failed to save changes. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }, [formData, stateCode, onUpdate, onClose, validateForm])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Edit State: {stateCode}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{errors.general}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status...</option>
              <option value="upcoming">Upcoming</option>
              <option value="current">Current</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Number
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.week_number || ''}
              onChange={(e) => handleInputChange('week_number', parseInt(e.target.value) || undefined)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.week_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="1-50"
            />
            {errors.week_number && (
              <p className="text-sm text-red-600 mt-1">{errors.week_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Breweries
            </label>
            <input
              type="number"
              min="0"
              value={formData.total_breweries || ''}
              onChange={(e) => handleInputChange('total_breweries', parseInt(e.target.value) || undefined)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.total_breweries ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Number of breweries"
            />
            {errors.total_breweries && (
              <p className="text-sm text-red-600 mt-1">{errors.total_breweries}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Rating (1-5)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.difficulty_rating || ''}
                onChange={(e) => handleInputChange('difficulty_rating', parseFloat(e.target.value) || undefined)}
                className={`flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.difficulty_rating ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1.0 - 5.0"
              />
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleInputChange('difficulty_rating', rating)}
                    className={`w-6 h-6 ${
                      (formData.difficulty_rating || 0) >= rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    } hover:text-yellow-400`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            {errors.difficulty_rating && (
              <p className="text-sm text-red-600 mt-1">{errors.difficulty_rating}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the state's craft beer scene..."
          />
        </div>

        {/* Featured Breweries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Breweries
          </label>
          <div className="space-y-2">
            {(formData.featured_breweries || []).map((brewery, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={brewery}
                  onChange={(e) => {
                    const newBreweries = [...(formData.featured_breweries || [])]
                    newBreweries[index] = e.target.value
                    handleInputChange('featured_breweries', newBreweries)
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brewery name"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('featured_breweries', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd('featured_breweries', '')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Brewery</span>
            </button>
          </div>
        </div>

        {/* Journey Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Journey Highlights
          </label>
          <div className="space-y-2">
            {(formData.journey_highlights || []).map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...(formData.journey_highlights || [])]
                    newHighlights[index] = e.target.value
                    handleInputChange('journey_highlights', newHighlights)
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Journey highlight"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('journey_highlights', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd('journey_highlights', '')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Highlight</span>
            </button>
          </div>
        </div>

        {/* Research Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Research Hours
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.research_hours || ''}
            onChange={(e) => handleInputChange('research_hours', parseFloat(e.target.value) || undefined)}
            className={`w-full md:w-1/3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.research_hours ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Hours spent researching"
          />
          {errors.research_hours && (
            <p className="text-sm text-red-600 mt-1">{errors.research_hours}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <div className="text-sm text-gray-500">
          {hasChanges && <span className="text-orange-600">You have unsaved changes</span>}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================================================
// Bulk Operations Form
// ==================================================

function BulkOperationsForm({ 
  selectedStates, 
  onBulkUpdate 
}: { 
  selectedStates: string[]
  onBulkUpdate: (bulkUpdate: any) => Promise<void>
}) {
  const [bulkForm, setBulkForm] = useState<BulkUpdateForm>({})
  const [isLoading, setIsLoading] = useState(false)
  const [newBrewery, setNewBrewery] = useState('')

  const handleBulkSubmit = useCallback(async () => {
    if (selectedStates.length === 0) return

    setIsLoading(true)
    try {
      await onBulkUpdate({
        statesCodes: selectedStates,
        updates: bulkForm,
        options: { trigger_realtime: true, send_notifications: true }
      })
      setBulkForm({})
    } catch (error) {
      console.error('Bulk update failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedStates, bulkForm, onBulkUpdate])

  const addBreweryToBulk = useCallback((action: 'add' | 'remove') => {
    if (!newBrewery.trim()) return

    const field = action === 'add' ? 'add_featured_breweries' : 'remove_featured_breweries'
    setBulkForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newBrewery.trim()]
    }))
    setNewBrewery('')
  }, [newBrewery])

  if (selectedStates.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Select states to perform bulk operations</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Bulk Operations ({selectedStates.length} states)
      </h3>

      <div className="space-y-4">
        {/* Status Update */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          <select
            value={bulkForm.status || ''}
            onChange={(e) => setBulkForm(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Don't change</option>
            <option value="upcoming">Set to Upcoming</option>
            <option value="current">Set to Current</option>
            <option value="completed">Set to Completed</option>
          </select>
        </div>

        {/* Difficulty Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set Difficulty Rating
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={bulkForm.difficulty_rating || ''}
            onChange={(e) => setBulkForm(prev => ({ ...prev, difficulty_rating: parseFloat(e.target.value) || undefined }))}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.0 - 5.0"
          />
        </div>

        {/* Research Hours Increment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Research Hours
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={bulkForm.research_hours_increment || ''}
            onChange={(e) => setBulkForm(prev => ({ ...prev, research_hours_increment: parseFloat(e.target.value) || undefined }))}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hours to add"
          />
        </div>

        {/* Append Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Append to Description
          </label>
          <textarea
            value={bulkForm.append_description || ''}
            onChange={(e) => setBulkForm(prev => ({ ...prev, append_description: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Text to append to all selected state descriptions..."
          />
        </div>

        {/* Brewery Management */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brewery Management
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newBrewery}
              onChange={(e) => setNewBrewery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brewery name"
            />
            <button
              type="button"
              onClick={() => addBreweryToBulk('add')}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              Add to All
            </button>
            <button
              type="button"
              onClick={() => addBreweryToBulk('remove')}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              Remove from All
            </button>
          </div>

          {/* Show planned changes */}
          {(bulkForm.add_featured_breweries?.length || bulkForm.remove_featured_breweries?.length) && (
            <div className="text-sm space-y-1">
              {bulkForm.add_featured_breweries?.length && (
                <div>
                  <span className="font-medium text-green-700">Will add:</span> {bulkForm.add_featured_breweries.join(', ')}
                </div>
              )}
              {bulkForm.remove_featured_breweries?.length && (
                <div>
                  <span className="font-medium text-red-700">Will remove:</span> {bulkForm.remove_featured_breweries.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleBulkSubmit}
            disabled={isLoading || Object.keys(bulkForm).length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Applying Changes...' : 'Apply Bulk Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================================================
// Main State Status Updater
// ==================================================

export default function StateStatusUpdater({ 
  selectedStates, 
  onUpdate, 
  onBulkUpdate, 
  className = '' 
}: StateStatusUpdaterProps) {
  const [editingState, setEditingState] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'bulk' | 'individual'>('bulk')

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'bulk'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bulk Operations
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'individual'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Individual Editor
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'bulk' ? (
            <BulkOperationsForm 
              selectedStates={selectedStates}
              onBulkUpdate={onBulkUpdate}
            />
          ) : (
            <div>
              {editingState ? (
                <StateEditor
                  stateCode={editingState}
                  onUpdate={onUpdate}
                  onClose={() => setEditingState(null)}
                />
              ) : (
                <div className="text-center py-12">
                  <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Select a state from the grid above to edit</p>
                  <p className="text-sm text-gray-500">Click on any state card to open the detailed editor</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}