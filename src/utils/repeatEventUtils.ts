import { Event, RepeatType } from '../types';

function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getNextRepeatDate(currentDate: Date, repeatType: RepeatType, interval: number): Date {
  const nextDate = new Date(currentDate);

  switch (repeatType) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7 * interval);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    default:
      break;
  }

  return nextDate;
}

/**
 * 반복 일정 생성
 */
export function generateRepeatEvents(event: Event, endDate: Date): Event[] {
  if (event.repeat.type === 'none') {
    return [event];
  }

  const events: Event[] = [];
  const startDate = new Date(event.date);
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (endDate && currentDate > endDate) {
      break;
    }

    if (currentDate >= startDate) {
      const newEvent: Event = {
        ...event,
        date: formatDateToString(currentDate),
      };
      events.push(newEvent);
    }

    currentDate = getNextRepeatDate(currentDate, event.repeat.type, event.repeat.interval);
  }

  return events;
}
