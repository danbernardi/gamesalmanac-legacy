import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Format to human readable date
export function formatDate (timecode: number) {
  const date = new Date(timecode * 1000);
  return date.toLocaleDateString('en')
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
