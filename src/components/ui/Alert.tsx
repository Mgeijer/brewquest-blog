'use client'

import React from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  className?: string
}

interface AlertDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${getVariantStyles()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      {children}
    </div>
  )
}

export default Alert