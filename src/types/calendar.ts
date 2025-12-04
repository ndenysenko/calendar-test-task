export interface CalendarEvent {
  id: string
  title: string
  date: Date | string
  start?: string
  end?: string
  color?: string
  description?: string
}

export type CalendarView = 'Month' | 'Week' | 'Day' | 'Agenda'

export interface EventFormData {
  title: string
  date: string
  time?: string
  description?: string
  color?: string
}

export const EVENT_TITLE_MAX_LENGTH = 30

