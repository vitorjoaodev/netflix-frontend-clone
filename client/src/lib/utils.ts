import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Movie, TvShow } from './tmdb';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Blacklist of titles to filter out
const blacklistedTitles = [
  'The Last of Us',
  'Minecraft: The Movie',
  'Minecraft Movie',
  'Thunderbolts',
  'Thunderbolts*'
];

// Function to filter out blacklisted content
export function filterBlacklistedContent<T extends Movie | TvShow>(items: T[]): T[] {
  return items.filter(item => {
    const title = 'title' in item ? item.title : item.name;
    return !blacklistedTitles.some(
      blacklisted => title.toLowerCase().includes(blacklisted.toLowerCase())
    );
  });
}
