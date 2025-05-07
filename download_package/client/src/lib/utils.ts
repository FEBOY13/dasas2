import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(value: string): string {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format according to 000.000.000-00 pattern
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.substring(0, 3)}.${digits.substring(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
  } else {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
  }
}

export function formatPhone(value: string): string {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format according to (00) 00000-0000 pattern
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  } else if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
}

export function maskPassword(password: string): string {
  return '•'.repeat(Math.min(password.length, 8));
}
