import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getABVBadgeColors(abv: number): { bg: string; text: string } {
  if (abv < 4) {
    return { bg: 'bg-green-100', text: 'text-green-800' }
  } else if (abv < 6) {
    return { bg: 'bg-blue-100', text: 'text-blue-800' }
  } else if (abv < 8) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800' }
  } else if (abv < 10) {
    return { bg: 'bg-orange-100', text: 'text-orange-800' }
  } else {
    return { bg: 'bg-red-100', text: 'text-red-800' }
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`
}