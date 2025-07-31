'use client'

import React, { useEffect } from 'react'
import { getStateByCode } from '@/lib/data/stateProgress'

export default function USMapSimple() {
  useEffect(() => {
    console.log('🗺️ USMapSimple component mounted')
    console.log('✅ Alabama state data:', getStateByCode('AL'))
  }, [])

  const handleStateClick = (stateCode: string) => {
    console.log('🎯 State clicked:', stateCode)
    const state = getStateByCode(stateCode)
    console.log('State data:', state)
    alert(`Clicked on ${state?.name || stateCode}!`)
  }

  const handleStateHover = (stateCode: string, isEntering: boolean) => {
    console.log(`👆 State ${isEntering ? 'hovered' : 'left'}:`, stateCode)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-center">Simplified Interactive Map Test</h3>
        
        <svg 
          viewBox="0 0 1100 650" 
          className="w-full h-auto border"
          role="img"
          aria-label="Simplified US Map Test"
        >
          <title>US States Beer Journey Test Map</title>
          
          {/* Alabama path - simplified test */}
          <path
            d="M823.25,403.55L831.37,431.02L838.53,452.95L842.13,459.7L844.3,463.54L841.61,467.9L841.4,475.24L842.96,479.38L842.96,483.45L842.88,487.23L844.46,489.98L845.75,492.54L805.82,497.08L794.73,499.45L794.58,501.21L799.58,506.33L798.97,510.92L797.83,514.18L780.04,513.21L776.52,478.48L776.84,441.91L777.66,412.26L775.95,407.99L799.35,405.82z"
            className="fill-beer-cream hover:fill-beer-amber cursor-pointer transition-colors duration-300 stroke-white stroke-2"
            onClick={() => handleStateClick('AL')}
            onMouseEnter={() => handleStateHover('AL', true)}
            onMouseLeave={() => handleStateHover('AL', false)}
            data-state="AL"
            aria-label="Alabama - Click to explore"
          />
          
          {/* Texas path - simplified test */}
          <path
            d="M658.64,445.06L659.67,446.53L663.36,446.16L667.77,446.16L666.94,459.1L668.65,483.45L671.9,485.95L673.07,489.45L674.87,494.7L677.27,499.84L679.1,502.91L677.42,511.32L676.22,513.83L674.63,519.34L676.12,520.83L676.18,525.4L673.27,528.5L671.32,531.91L673.04,534.9L656.02,540.04L637.82,557.24L617.61,567.14L606.35,578.03L601.48,588.34L601.04,604.28L601.91,615.41L605.78,623.36L597.58,623.93L582.8,618.52L566.71,610.86L561.26,599.79L557.33,583.46L545.79,569.82L539.4,556.02L530.11,539.78L516.53,529.83L500.18,529.18L486.19,546.32L470.08,538.07L460.36,530.23L456.6,517.21L451.21,504.67L440.58,493.46L431.39,485.2L425.23,476.34L423.48,472.47L423.5,470.51L440.89,472.47L475.73,475.87L493.71,477.35L497.01,434.63L501.59,375.32L519.86,376.63L538.16,377.73L556.46,378.64L555.49,400.85L554.53,422.51L558.91,425.14L561.9,427.12L566.91,425.79L569.54,430.6L575.82,432.43L581.41,433.82L590.23,433.51L592.59,439.04L598.33,436.88L603.58,440.5L608.74,442.04L611.74,438.79L614.58,442.61L620.93,441.42L623.71,442.55L626.89,441.61L630.14,439.76L634.09,439.72L640.76,439.93L645.06,438.36L650.4,440.72z"
            className="fill-gray-200 hover:fill-gray-300 cursor-pointer transition-colors duration-300 stroke-white stroke-2"
            onClick={() => handleStateClick('TX')}
            onMouseEnter={() => handleStateHover('TX', true)}
            onMouseLeave={() => handleStateHover('TX', false)}
            data-state="TX"
            aria-label="Texas - Click to explore"
          />
          
          {/* California path - simplified test */}
          <path
            d="M227.74,202.25L209.97,267.9L234.88,306L259.69,342.73L283.94,377.49L283.9,379.56L284.28,382.78L284.99,386.99L286.51,391.67L289.13,396.66L282.58,400.09L279,409.98L274.3,414.34L274.45,418.47L274.42,421.95L277.1,425.71L274.1,429.74L271.6,429.19L247.2,426.36L225.43,423.15L225.09,414.45L219.96,401.1L203.57,383L196.4,380.28L190.28,371.27L176.35,365.7L172.7,360.88L173.84,348.28L162.81,321.41L157.2,286.87L159.32,282.02L153.91,272.55L146.38,250.33L149.63,231.97L144.55,217.34L153.92,200.58L159.29,181.87z"
            className="fill-gray-200 hover:fill-gray-300 cursor-pointer transition-colors duration-300 stroke-white stroke-2"
            onClick={() => handleStateClick('CA')}
            onMouseEnter={() => handleStateHover('CA', true)}
            onMouseLeave={() => handleStateHover('CA', false)}
            data-state="CA"
            aria-label="California - Click to explore"
          />
        </svg>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>🎯 Click on Alabama (cream colored), Texas, or California to test interactions</p>
          <p>👆 Hover over states to test hover events</p>
          <p>📝 Check browser console for debug output</p>
        </div>
      </div>
    </div>
  )
}