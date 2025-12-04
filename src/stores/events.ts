import { defineStore } from 'pinia'
import type { CalendarEvent } from '@/types/calendar'
import { STORAGE_KEY, DEFAULT_EVENT_COLOR } from '@/constants/calendar'

interface EventsState {
  events: CalendarEvent[]
  nextId: number
}

const loadEventsFromStorage = (): CalendarEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load events from localStorage:', error)
  }
  return []
}

const saveEventsToStorage = (events: CalendarEvent[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Failed to save events to localStorage:', error)
  }
}

const getNextId = (events: CalendarEvent[]): number => {
  if (events.length === 0) return 1
  const maxId = Math.max(...events.map(e => parseInt(e.id) || 0))
  return maxId + 1
}

const initialEvents = loadEventsFromStorage()

export const useEventStore = defineStore('events', {
  state: (): EventsState => ({
    events: initialEvents,
    nextId: getNextId(initialEvents)
  }),

  getters: {
    getEventsByDate: (state) => (date: Date) => {
      const dateString = date.toDateString()
      return state.events.filter(event => {
        const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date
        return eventDate.toDateString() === dateString
      })
    },

    getEventsByMonth: (state) => (year: number, month: number) => {
      return state.events.filter(event => {
        const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date
        return eventDate.getFullYear() === year && eventDate.getMonth() === month
      })
    },

    getEventById: (state) => (id: string) => {
      return state.events.find(event => event.id === id)
    },

    fullCalendarEvents: (state) => {
      return state.events
        .map(event => ({
          id: event.id,
          title: event.title,
          start: event.start || (typeof event.date === 'string' ? event.date : event.date.toISOString()),
          end: event.end || (typeof event.date === 'string' ? event.date : event.date.toISOString()),
          backgroundColor: event.color || DEFAULT_EVENT_COLOR,
          borderColor: event.color || DEFAULT_EVENT_COLOR,
          textColor: '#ffffff',
          extendedProps: {
            description: event.description
          }
        }))
        .sort((a, b) => {
          const timeA = new Date(a.start).getTime()
          const timeB = new Date(b.start).getTime()
          return timeA - timeB
        })
    }
  },

  actions: {
    addEvent(newEvent: Omit<CalendarEvent, 'id'>) {
      const event: CalendarEvent = {
        ...newEvent,
        id: this.nextId.toString(),
        color: newEvent.color || DEFAULT_EVENT_COLOR
      }
      this.events.push(event)
      this.nextId++
      saveEventsToStorage(this.events)
      return event
    },

    updateEvent(updatedEvent: CalendarEvent) {
      const index = this.events.findIndex(e => e.id === updatedEvent.id)
      if (index !== -1) {
        this.events[index] = {
          ...updatedEvent,
          color: updatedEvent.color || DEFAULT_EVENT_COLOR
        }
        saveEventsToStorage(this.events)
        return this.events[index]
      }
      return null
    },

    deleteEvent(eventId: string) {
      const index = this.events.findIndex(e => e.id === eventId)
      if (index !== -1) {
        this.events.splice(index, 1)
        saveEventsToStorage(this.events)
        return true
      }
      return false
    },

    clearEvents() {
      this.events = []
      this.nextId = 1
      saveEventsToStorage(this.events)
    }
  }
})