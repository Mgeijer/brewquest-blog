/**
 * Progress Notification Component
 * 
 * Comprehensive UI notification system for real-time progress updates
 * with toast notifications, milestone celebrations, and visual feedback.
 * 
 * Features:
 * - Toast notification system with different types
 * - Milestone celebration animations and effects
 * - Progress status indicators
 * - Connection state feedback
 * - Error handling and retry UI
 * - Customizable notification themes
 * - Sound effects and haptic feedback
 * - Accessibility support
 */

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useStateProgress } from '@/hooks/useStateProgress'
import { StateProgress, JourneyMilestone } from '@/lib/supabase/functions/stateProgressFunctions'
import { ConnectionState } from '@/lib/realtime/stateProgressSubscription'

// ==================================================
// Type Definitions
// ==================================================

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'celebration'

export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actionLabel?: string
  actionHandler?: () => void
  metadata?: Record<string, any>
  timestamp: Date
}

export interface ProgressNotificationProps {
  // Configuration
  enableToasts?: boolean
  enableCelebrations?: boolean
  enableSounds?: boolean
  enableHaptics?: boolean
  
  // Positioning and styling
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  maxNotifications?: number
  defaultDuration?: number
  
  // Filtering
  stateFilter?: string[]
  milestoneFilter?: string[]
  celebrationLevels?: ('minor' | 'major' | 'epic')[]
  
  // Theming
  theme?: 'light' | 'dark' | 'auto'
  className?: string
  
  // Event handlers
  onNotification?: (notification: NotificationData) => void
  onCelebration?: (milestone: JourneyMilestone) => void
  onError?: (error: Error) => void
}

interface ToastState {
  notifications: NotificationData[]
  celebrating: boolean
  celebratingMilestone?: JourneyMilestone
}

// ==================================================
// Notification Templates
// ==================================================

const NOTIFICATION_TEMPLATES = {
  stateCompleted: (state: StateProgress) => ({
    type: 'success' as const,
    title: `${state.state_name} Complete! 🍺`,
    message: `Successfully explored the craft beer scene in ${state.state_name}. On to the next adventure!`,
    duration: 8000,
    metadata: { stateCode: state.state_code, type: 'state_completion' }
  }),
  
  stateStarted: (state: StateProgress) => ({
    type: 'info' as const,
    title: `Welcome to ${state.state_name}! 🗺️`,
    message: `Beginning the craft beer journey through ${state.state_name}. Let's discover some amazing breweries!`,
    duration: 6000,
    metadata: { stateCode: state.state_code, type: 'state_start' }
  }),
  
  milestoneAchieved: (milestone: JourneyMilestone) => ({
    type: 'celebration' as const,
    title: milestone.title,
    message: milestone.description,
    duration: milestone.celebration_level === 'epic' ? 12000 : milestone.celebration_level === 'major' ? 8000 : 5000,
    persistent: milestone.celebration_level === 'epic',
    metadata: { milestoneId: milestone.id, type: 'milestone', level: milestone.celebration_level }
  }),
  
  connectionLost: () => ({
    type: 'warning' as const,
    title: 'Connection Lost',
    message: 'Lost connection to real-time updates. Attempting to reconnect...',
    persistent: true,
    actionLabel: 'Retry Now',
    metadata: { type: 'connection_error' }
  }),
  
  connectionRestored: () => ({
    type: 'success' as const,
    title: 'Connected',
    message: 'Real-time updates restored successfully!',
    duration: 4000,
    metadata: { type: 'connection_restored' }
  }),
  
  updateError: (error: Error) => ({
    type: 'error' as const,
    title: 'Update Failed',
    message: `Failed to update progress: ${error.message}`,
    persistent: true,
    actionLabel: 'Retry',
    metadata: { type: 'update_error', error: error.message }
  })
}

// ==================================================
// Toast Notification Component
// ==================================================

const ToastNotification: React.FC<{
  notification: NotificationData
  onDismiss: (id: string) => void
  onAction?: (id: string) => void
  theme: string
}> = ({ notification, onDismiss, onAction, theme }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    
    // Auto-dismiss timer
    if (!notification.persistent && notification.duration) {
      timeoutRef.current = setTimeout(() => {
        handleDismiss()
      }, notification.duration)
    }

    return () => {
      clearTimeout(timer)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [notification])

  const handleDismiss = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(notification.id), 300) // Match exit animation duration
  }, [notification.id, onDismiss])

  const handleAction = useCallback(() => {
    if (notification.actionHandler) {
      notification.actionHandler()
    }
    if (onAction) {
      onAction(notification.id)
    }
    handleDismiss()
  }, [notification, onAction, handleDismiss])

  const getTypeStyles = () => {
    const baseStyles = "rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300 transform"
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`
      case 'celebration':
        return `${baseStyles} bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500 text-purple-800`
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'celebration':
        return '🎉'
      default:
        return '📢'
    }
  }

  return (
    <div
      className={`
        ${getTypeStyles()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${notification.type === 'celebration' ? 'animate-pulse' : ''}
        max-w-sm w-full relative
      `}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss notification"
      >
        ×
      </button>

      {/* Content */}
      <div className="flex items-start space-x-3 pr-6">
        <span className="text-xl flex-shrink-0 mt-0.5" role="img" aria-label={notification.type}>
          {getIcon()}
        </span>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight mb-1">
            {notification.title}
          </h4>
          <p className="text-sm opacity-90 leading-relaxed">
            {notification.message}
          </p>
          
          {/* Action button */}
          {notification.actionLabel && (
            <button
              onClick={handleAction}
              className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for timed notifications */}
      {!notification.persistent && notification.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-30 transition-transform ease-linear"
            style={{
              transform: 'translateX(-100%)',
              animation: `toast-progress ${notification.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  )
}

// ==================================================
// Celebration Animation Component
// ==================================================

const CelebrationAnimation: React.FC<{
  milestone: JourneyMilestone
  onComplete: () => void
}> = ({ milestone, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, milestone.celebration_level === 'epic' ? 5000 : milestone.celebration_level === 'major' ? 3000 : 2000)

    return () => clearTimeout(timer)
  }, [milestone, onComplete])

  const getCelebrationStyles = () => {
    switch (milestone.celebration_level) {
      case 'epic':
        return 'animate-bounce text-6xl'
      case 'major':
        return 'animate-pulse text-4xl'
      case 'minor':
        return 'animate-ping text-2xl'
      default:
        return 'text-2xl'
    }
  }

  const getCelebrationEmoji = () => {
    switch (milestone.milestone_type) {
      case 'state_completion':
        return '🍺🎉'
      case 'region_completion':
        return '🗺️🎊'
      case 'brewery_milestone':
        return '🍻✨'
      case 'beer_milestone':
        return '🍺⭐'
      default:
        return '🎉🎊'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center animate-fadeIn">
        <div className={`mb-4 ${getCelebrationStyles()}`}>
          {getCelebrationEmoji()}
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">
          {milestone.title}
        </h2>
        <p className="text-white text-lg opacity-90 max-w-md">
          {milestone.description}
        </p>
      </div>
    </div>
  )
}

// ==================================================
// Connection Status Indicator
// ==================================================

const ConnectionStatusIndicator: React.FC<{
  connectionState: ConnectionState
  onClick?: () => void
}> = ({ connectionState, onClick }) => {
  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          color: 'bg-green-500',
          label: 'Live Updates Active',
          icon: '🟢'
        }
      case 'connecting':
        return {
          color: 'bg-yellow-500 animate-pulse',
          label: 'Connecting...',
          icon: '🟡'
        }
      case 'disconnected':
        return {
          color: 'bg-gray-500',
          label: 'Offline',
          icon: '⚫'
        }
      case 'error':
        return {
          color: 'bg-red-500',
          label: 'Connection Error',
          icon: '🔴'
        }
      default:
        return {
          color: 'bg-gray-500',
          label: 'Unknown',
          icon: '⚫'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`
        inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
        bg-white bg-opacity-90 shadow-sm border cursor-pointer hover:bg-opacity-100 transition-all
        ${onClick ? 'hover:shadow-md' : ''}
      `}
      onClick={onClick}
      title={config.label}
    >
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-gray-700">{config.label}</span>
    </div>
  )
}

// ==================================================
// Main Progress Notification Component
// ==================================================

export const ProgressNotification: React.FC<ProgressNotificationProps> = ({
  enableToasts = true,
  enableCelebrations = true,
  enableSounds = false,
  enableHaptics = false,
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000,
  stateFilter,
  milestoneFilter,
  celebrationLevels = ['minor', 'major', 'epic'],
  theme = 'auto',
  className = '',
  onNotification,
  onCelebration,
  onError
}) => {
  const [toastState, setToastState] = useState<ToastState>({
    notifications: [],
    celebrating: false
  })

  const { data, actions } = useStateProgress({
    enableRealtime: true,
    enableNotifications: true,
    notificationFilters: {
      states: stateFilter,
      milestoneTypes: milestoneFilter,
      celebrationLevels
    }
  })

  const audioRef = useRef<HTMLAudioElement>()
  const lastNotificationRef = useRef<string>()

  // ==================================================
  // Notification Management
  // ==================================================

  const addNotification = useCallback((notificationData: Omit<NotificationData, 'id' | 'timestamp'>) => {
    if (!enableToasts) return

    const notification: NotificationData = {
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      duration: defaultDuration,
      ...notificationData
    }

    setToastState(prev => {
      let notifications = [...prev.notifications, notification]
      
      // Limit number of notifications
      if (notifications.length > maxNotifications) {
        notifications = notifications.slice(-maxNotifications)
      }

      return { ...prev, notifications }
    })

    // Play sound if enabled
    if (enableSounds && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (user gesture required, etc.)
      })
    }

    // Trigger haptic feedback if enabled
    if (enableHaptics && navigator.vibrate) {
      navigator.vibrate(200)
    }

    // Call external notification handler
    if (onNotification) {
      onNotification(notification)
    }

    return notification.id
  }, [enableToasts, enableSounds, enableHaptics, defaultDuration, maxNotifications, onNotification])

  const dismissNotification = useCallback((id: string) => {
    setToastState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }))
  }, [])

  const handleNotificationAction = useCallback((id: string) => {
    const notification = toastState.notifications.find(n => n.id === id)
    if (!notification) return

    switch (notification.metadata?.type) {
      case 'connection_error':
        actions.reconnect()
        break
      case 'update_error':
        actions.retry()
        break
    }
  }, [toastState.notifications, actions])

  // ==================================================
  // Celebration Management
  // ==================================================

  const startCelebration = useCallback((milestone: JourneyMilestone) => {
    if (!enableCelebrations) return

    setToastState(prev => ({
      ...prev,
      celebrating: true,
      celebratingMilestone: milestone
    }))

    // Enhanced effects for epic celebrations
    if (milestone.celebration_level === 'epic' && enableHaptics && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200])
    }

    if (onCelebration) {
      onCelebration(milestone)
    }
  }, [enableCelebrations, enableHaptics, onCelebration])

  const endCelebration = useCallback(() => {
    setToastState(prev => ({
      ...prev,
      celebrating: false,
      celebratingMilestone: undefined
    }))
  }, [])

  // ==================================================
  // Effect Handlers
  // ==================================================

  // Monitor state changes for notifications
  useEffect(() => {
    if (!data.lastUpdated) return

    // Prevent duplicate notifications
    const notificationKey = `${data.lastUpdated.getTime()}`
    if (lastNotificationRef.current === notificationKey) return
    lastNotificationRef.current = notificationKey

    // Check for state completions
    const completedStates = data.states.filter(s => s.status === 'completed')
    // This is simplified - in a real implementation, you'd track which states were just completed
  }, [data.states, data.lastUpdated, addNotification])

  // Monitor milestones for celebrations
  useEffect(() => {
    data.milestones.forEach(milestone => {
      if (milestone.celebration_level && celebrationLevels.includes(milestone.celebration_level)) {
        // Check if this is a new milestone (simplified logic)
        const isNew = new Date(milestone.milestone_date).getTime() > (Date.now() - 10000) // Within last 10 seconds
        
        if (isNew) {
          startCelebration(milestone)
          addNotification(NOTIFICATION_TEMPLATES.milestoneAchieved(milestone))
        }
      }
    })
  }, [data.milestones, startCelebration, addNotification, celebrationLevels])

  // Monitor connection state
  useEffect(() => {
    if (data.connectionState === 'error' || data.connectionState === 'disconnected') {
      const template = NOTIFICATION_TEMPLATES.connectionLost()
      addNotification({
        ...template,
        actionHandler: actions.reconnect
      })
    } else if (data.connectionState === 'connected' && data.connectionError) {
      addNotification(NOTIFICATION_TEMPLATES.connectionRestored())
    }
  }, [data.connectionState, data.connectionError, addNotification, actions.reconnect])

  // Monitor errors
  useEffect(() => {
    if (data.error) {
      const template = NOTIFICATION_TEMPLATES.updateError(data.error)
      addNotification({
        ...template,
        actionHandler: actions.retry
      })
      
      if (onError) {
        onError(data.error)
      }
    }
  }, [data.error, addNotification, actions.retry, onError])

  // ==================================================
  // Position Styling
  // ==================================================

  const getPositionStyles = () => {
    const base = "fixed z-40 pointer-events-none"
    
    switch (position) {
      case 'top-left':
        return `${base} top-4 left-4`
      case 'top-right':
        return `${base} top-4 right-4`
      case 'bottom-left':
        return `${base} bottom-4 left-4`
      case 'bottom-right':
        return `${base} bottom-4 right-4`
      case 'top-center':
        return `${base} top-4 left-1/2 transform -translate-x-1/2`
      case 'bottom-center':
        return `${base} bottom-4 left-1/2 transform -translate-x-1/2`
      default:
        return `${base} top-4 right-4`
    }
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* Toast container */}
      <div className={`${getPositionStyles()} ${className}`}>
        <div className="space-y-2 pointer-events-auto">
          {/* Connection status indicator */}
          <ConnectionStatusIndicator
            connectionState={data.connectionState}
            onClick={data.connectionState === 'error' ? actions.reconnect : undefined}
          />
          
          {/* Toast notifications */}
          {toastState.notifications.map(notification => (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onDismiss={dismissNotification}
              onAction={handleNotificationAction}
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* Celebration overlay */}
      {toastState.celebrating && toastState.celebratingMilestone && (
        <CelebrationAnimation
          milestone={toastState.celebratingMilestone}
          onComplete={endCelebration}
        />
      )}

      {/* Audio element for sound effects */}
      {enableSounds && (
        <audio
          ref={audioRef}
          preload="auto"
          src="/sounds/notification.mp3" // You'll need to add this sound file
        />
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes toast-progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default ProgressNotification