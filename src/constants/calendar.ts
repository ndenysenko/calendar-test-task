export const CALENDAR_VIEWS = ['Month', 'Week', 'Day', 'Agenda'] as const

export const VIEW_NAME_MAP: Record<string, string> = {
  Month: 'dayGridMonth',
  Week: 'timeGridWeek',
  Day: 'timeGridDay',
  Agenda: 'timeGridWeek'
}

export const DEFAULT_EVENT_COLOR = '#3B86FF'

export const STORAGE_KEY = 'calendar-events'

export const EVENT_COLORS = [
  { name: 'Blue', value: '#3B86FF' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
] as const

