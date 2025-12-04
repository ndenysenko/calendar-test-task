import { ref, nextTick } from 'vue'
import type { CalendarEvent, EventFormData } from '../types/calendar'
import { DEFAULT_EVENT_COLOR } from '../constants/calendar'
import type { useEventStore } from '../stores/events'
import type FullCalendar from '@fullcalendar/vue3'

export function useEventModal(
  eventStore: ReturnType<typeof useEventStore>,
  calendarRef: () => InstanceType<typeof FullCalendar> | undefined
) {
  const showModal = ref(false)
  const clickedDateElement = ref<HTMLElement | null>(null)
  const selectedDate = ref<string>('')
  const modalStyle = ref<Record<string, string>>({ top: '0px', left: '0px' })
  const eventTitlePreview = ref<string>('')
  const blueLineElement = ref<HTMLElement | null>(null)
  const editingEvent = ref<CalendarEvent | null>(null)
  const editingEventElement = ref<HTMLElement | null>(null)

  const openModal = (dateElement: HTMLElement, dateStr: string, event?: CalendarEvent | null, eventElement?: HTMLElement) => {
    if (clickedDateElement.value) {
      clickedDateElement.value.classList.remove('fc-day-selected')
    }
    if (editingEventElement.value) {
      editingEventElement.value.classList.remove('fc-event-editing')
    }

    selectedDate.value = dateStr
    clickedDateElement.value = dateElement
    dateElement.classList.add('fc-day-selected')
    editingEvent.value = event || null
    
    if (event && eventElement) {
      editingEventElement.value = eventElement
      eventElement.classList.add('fc-event-editing')
    } else {
      editingEventElement.value = null
    }
    
    eventTitlePreview.value = ''
    showModal.value = true

    nextTick(() => {
      if (clickedDateElement.value) {
        const rect = clickedDateElement.value.getBoundingClientRect()
        const calendarContainer = clickedDateElement.value.closest('.fc')?.parentElement
        if (calendarContainer) {
          const containerRect = calendarContainer.getBoundingClientRect()
          const bottomPosition = rect.bottom - containerRect.top
          const isMobile = window.innerWidth < 640
          
          if (isMobile) {
            modalStyle.value = {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'fixed',
              width: '90%',
              maxWidth: '400px'
            }
          } else {
            modalStyle.value = {
              top: `${bottomPosition + 2}px`,
              left: `${rect.left - containerRect.left}px`
            }
          }
        }
      }
    })
  }

  const closeModal = () => {
    if (blueLineElement.value) {
      blueLineElement.value.remove()
      blueLineElement.value = null
    }
    if (editingEventElement.value) {
      editingEventElement.value.classList.remove('fc-event-editing')
      editingEventElement.value = null
    }
    if (clickedDateElement.value) {
      clickedDateElement.value.classList.remove('fc-day-selected')
    }
    showModal.value = false
    clickedDateElement.value = null
    selectedDate.value = ''
    eventTitlePreview.value = ''
    editingEvent.value = null
  }

  const updateEventTitle = (title: string) => {
    eventTitlePreview.value = title
    if (!editingEvent.value && clickedDateElement.value) {
      if (blueLineElement.value) {
        const span = blueLineElement.value.querySelector('span')
        if (span) {
          span.textContent = title || 'Event name'
        }
      } else if (title) {
        nextTick(() => {
          const dayEventsContainer = clickedDateElement.value?.querySelector('.fc-daygrid-day-events')
          if (dayEventsContainer && !blueLineElement.value) {
            const blueLine = document.createElement('div')
            blueLine.className = 'fc-event fc-daygrid-event blue-line-preview'
            blueLine.style.cssText = 'margin: 0.125rem 0; pointer-events: none;'
            blueLine.innerHTML = `
              <div class="bg-event-bg text-white text-xs font-semibold px-2 py-1 rounded overflow-hidden" style="max-width: 100%;">
                <span class="whitespace-nowrap block overflow-hidden text-ellipsis">${title || 'Event name'}</span>
              </div>
            `
            dayEventsContainer.appendChild(blueLine)
            blueLineElement.value = blueLine
          }
        })
      }
    }
  }

  const handleEventSubmit = (eventData: EventFormData) => {
    const dateTime = eventData.time
      ? new Date(`${eventData.date}T${eventData.time}`)
      : new Date(eventData.date)

    if (editingEvent.value) {
      eventStore.updateEvent({
        ...editingEvent.value,
        title: eventData.title,
        date: dateTime,
        start: dateTime.toISOString(),
        description: eventData.description,
        color: eventData.color || editingEvent.value.color || DEFAULT_EVENT_COLOR
      })
    } else {
      eventStore.addEvent({
        title: eventData.title,
        date: dateTime,
        start: dateTime.toISOString(),
        description: eventData.description,
        color: eventData.color || DEFAULT_EVENT_COLOR
      })
    }

    if (blueLineElement.value) {
      blueLineElement.value.remove()
      blueLineElement.value = null
    }
    eventTitlePreview.value = ''
    closeModal()

    const api = calendarRef()?.getApi()
    if (api) {
      api.refetchEvents()
    }
  }

  const handleEventDelete = (eventId: string) => {
    eventStore.deleteEvent(eventId)
    closeModal()

    const api = calendarRef()?.getApi()
    if (api) {
      api.refetchEvents()
    }
  }

  return {
    showModal,
    clickedDateElement,
    selectedDate,
    modalStyle,
    eventTitlePreview,
    editingEvent,
    openModal,
    closeModal,
    updateEventTitle,
    handleEventSubmit,
    handleEventDelete
  }
}

