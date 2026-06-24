import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  if (!status) return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  switch(status.toUpperCase()) {
    case 'PENDING_ADMIN_REVIEW':
    case 'PENDING':
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case 'FORWARDED_TO_BANK':
    case 'UNDER_BANK_REVIEW':
    case 'UNDER_REVIEW':
      return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    case 'WAITLISTED':
      return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
    case 'APPROVED':
    case 'FUNDED':
    case 'VERIFIED':
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case 'REJECTED':
    case 'REJECTED_BY_BANK':
    case 'REJECTED_BY_ADMIN':
    case 'MISSING':
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case 'WITHDRAWN':
      return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
  }
}

export function formatStatus(status: string) {
  if (!status) return "—";
  return status.replace(/_/g, ' ');
}
