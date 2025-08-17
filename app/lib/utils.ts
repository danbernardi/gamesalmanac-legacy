import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { MONTHS } from "./constants"

// Format to human readable date
export function formatDate (timecode: number) {
  const date = new Date(timecode * 1000);
  return date.toLocaleDateString('en')
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextMonth(month: string, year: string): { month: number, year: string } {
  const currentMonth = Number(month);
  const currentYear = Number(year);
  
  if (currentMonth === 12) {
    return { month: 1, year: String(currentYear + 1) };
  }
  
  return { month: currentMonth + 1, year };
}

export function getPreviousMonth(month: string, year: string): { month: number, year: string } {
  const currentMonth = Number(month);
  const currentYear = Number(year);
  
  if (currentMonth === 1) {
    return { month: 12, year: String(currentYear - 1) };
  }
  
  return { month: currentMonth - 1, year };
}

export function getMonthName(month: string): string {
  return MONTHS[parseInt(month)] || 'Unknown';
}
