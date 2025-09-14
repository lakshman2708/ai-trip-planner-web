import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This merges Tailwind + clsx for conditional class names
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
