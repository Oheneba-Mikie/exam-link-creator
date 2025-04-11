
import { format, addHours, addMinutes } from 'date-fns';

interface ExamSettings {
  title: string;
  description?: string;
  password?: string;
  duration: number;
  durationUnit: 'minutes' | 'hours';
  startDate: Date;
  limitAttempts: boolean;
  maxAttempts?: number;
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateExamLink(settings: ExamSettings): string {
  const baseUrl = window.location.origin;
  const examId = generateRandomId();
  
  const queryParams = new URLSearchParams();
  queryParams.append('id', examId);
  queryParams.append('title', encodeURIComponent(settings.title));
  
  if (settings.password) {
    queryParams.append('secure', 'true');
  }
  
  const expiryDate = settings.durationUnit === 'hours' 
    ? addHours(settings.startDate, settings.duration)
    : addMinutes(settings.startDate, settings.duration);
    
  queryParams.append('expires', expiryDate.toISOString());
  
  if (settings.limitAttempts && settings.maxAttempts) {
    queryParams.append('attempts', settings.maxAttempts.toString());
  }
  
  return `${baseUrl}/exam?${queryParams.toString()}`;
}

export function formatExpiryTime(date: Date): string {
  return format(date, "PPpp");
}

export function calculateExpiryFromNow(duration: number, unit: 'minutes' | 'hours'): Date {
  const now = new Date();
  return unit === 'hours' ? addHours(now, duration) : addMinutes(now, duration);
}
