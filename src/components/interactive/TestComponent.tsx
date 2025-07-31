'use client'

import React from 'react'

export default function TestComponent() {
  console.log('✅ TestComponent loaded successfully')
  
  return (
    <div className="bg-yellow-200 p-4 rounded border">
      <h3>Test Component Loaded Successfully</h3>
      <p>If you see this, the dynamic import is working.</p>
    </div>
  )
}