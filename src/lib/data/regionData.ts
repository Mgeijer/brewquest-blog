import { type StateData } from './stateProgress'

// Regional groupings for better mobile navigation
export interface Region {
  id: string
  name: string
  description: string
  states: string[]
  color: string
  darkColor: string
}

export const regions: Region[] = [
  {
    id: 'northeast',
    name: 'Northeast',
    description: 'Historic brewing traditions meet modern innovation',
    states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
    color: '#3B82F6', // Blue
    darkColor: '#1E40AF'
  },
  {
    id: 'southeast',
    name: 'Southeast',
    description: 'Southern hospitality with bold brewing creativity',
    states: ['DE', 'MD', 'VA', 'WV', 'KY', 'TN', 'NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'AR', 'LA'],
    color: '#EF4444', // Red
    darkColor: '#B91C1C'
  },
  {
    id: 'midwest',
    name: 'Midwest',
    description: 'Heartland brewing with German-inspired traditions',
    states: ['OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
    color: '#10B981', // Emerald
    darkColor: '#047857'
  },
  {
    id: 'southwest',
    name: 'Southwest',
    description: 'Desert landscapes inspire unique brewing flavors',
    states: ['TX', 'OK', 'NM', 'AZ'],
    color: '#F59E0B', // Amber
    darkColor: '#D97706'
  },
  {
    id: 'west',
    name: 'West',
    description: 'Innovation hub of the American craft beer movement',
    states: ['CO', 'WY', 'MT', 'ID', 'UT', 'NV', 'CA', 'OR', 'WA'],
    color: '#8B5CF6', // Violet
    darkColor: '#6D28D9'
  },
  {
    id: 'pacific',
    name: 'Pacific',
    description: 'Island paradise with tropical brewing influences',
    states: ['HI', 'AK'],
    color: '#06B6D4', // Cyan
    darkColor: '#0891B2'
  }
]

// Get region for a state
export function getRegionForState(stateCode: string): Region | null {
  return regions.find(region => region.states.includes(stateCode)) || null
}

// Get all states in a region with their data
export function getStatesInRegion(regionId: string, stateProgressData: StateData[]): StateData[] {
  const region = regions.find(r => r.id === regionId)
  if (!region) return []
  
  return stateProgressData.filter(state => region.states.includes(state.code))
}

// Calculate region progress
export function getRegionProgress(regionId: string, stateProgressData: StateData[]) {
  const regionStates = getStatesInRegion(regionId, stateProgressData)
  const completedStates = regionStates.filter(state => state.status === 'completed')
  const currentStates = regionStates.filter(state => state.status === 'current')
  
  return {
    total: regionStates.length,
    completed: completedStates.length,
    current: currentStates.length,
    percentage: regionStates.length > 0 ? Math.round((completedStates.length / regionStates.length) * 100) : 0,
    states: regionStates
  }
}

// Mobile-friendly region summary
export function getRegionSummary(regionId: string, stateProgressData: StateData[]) {
  const region = regions.find(r => r.id === regionId)
  if (!region) return null
  
  const progress = getRegionProgress(regionId, stateProgressData)
  const featuredStates = progress.states
    .filter(state => state.status === 'completed')
    .slice(0, 3)
  
  return {
    region,
    progress,
    featuredStates,
    nextState: progress.states.find(state => state.status === 'current'),
    totalBreweries: progress.states.reduce((sum, state) => sum + (state.totalBreweries || 0), 0),
    totalBeers: progress.states.reduce((sum, state) => sum + (state.featuredBeers?.length || 0), 0)
  }
}