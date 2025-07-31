/**
 * Real-time Testing Page
 * 
 * Demo page for testing and showcasing real-time progress updates
 * functionality in the Hop Harrison beer blog project.
 */

import { RealtimeTestPage } from '@/components/realtime/RealtimeTestPage'

export const metadata = {
  title: 'Real-time Integration Test | Hop Harrison',
  description: 'Test and demonstrate real-time progress updates for the beer journey tracking system',
}

export default function TestRealtimePage() {
  return <RealtimeTestPage />
}