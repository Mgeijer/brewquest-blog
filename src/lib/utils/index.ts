import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime);
}

export function getStateFromWeek(weekNumber: number): string {
  // This would map week numbers to states
  // For now, return a placeholder
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    // ... add all 50 states
  ];
  
  return states[(weekNumber - 1) % states.length] || 'Unknown';
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getABVColor(abv: number): string {
  if (abv < 4) return 'text-green-700';
  if (abv < 6) return 'text-yellow-700'; 
  if (abv < 8) return 'text-orange-700';
  return 'text-red-700';
}

export function getABVBadgeColors(abv: number): { text: string; bg: string; border: string } {
  if (abv < 4) return { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  if (abv < 6) return { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  if (abv < 8) return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function getRandomBeerFact(): string {
  const facts = [
    "The oldest known beer recipe dates back to 5,000 BC in ancient Mesopotamia.",
    "The first beer cans were produced in 1935 by Gottfried Krueger Brewing Company.",
    "Cenosillicaphobia is the fear of an empty beer glass.",
    "The strongest beer in the world has an ABV of 67.5%.",
    "Hops were first used in beer around 822 AD by French monks.",
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
} 