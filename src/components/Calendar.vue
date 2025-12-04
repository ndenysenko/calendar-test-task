<template>
    <div class="p-4 md:p-6 lg:py-8 lg:px-18 space-y-4 md:space-y-6">
        <h1 class="text-xl md:text-2xl font-semibold text-text mb-4! md:mb-6!">Calendar</h1>
        <div class="bg-white shadow-xl p-4 md:p-5">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4!">
                <h2 class="text-base md:text-lg font-semibold text-text">Calendar View</h2>
                <div
                    class="flex items-center border border-border rounded-lg shadow-xs overflow-hidden w-full sm:w-auto">
                    <button v-for="view in CALENDAR_VIEWS" :key="view" @click="handleChangeView(view)" :class="[
                        'px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-primary-200 flex-1 sm:flex-none',
                        currentView === view
                            ? ' text-event-bg'
                            : ' text-text ',
                        view !== CALENDAR_VIEWS[0] ? 'border-l border-border' : ''
                    ]"> {{ view }} </button>
                </div>
            </div>
            <div class="relative mb-4! flex items-center">
                <div class="flex items-center border border-border rounded-lg shadow-xs overflow-hidden">
                    <button @click="goToToday" :class="[
                        'px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-primary-200',
                        isToday ? 'text-event-bg' : 'text-text'
                    ]"> Today </button>
                    <button @click="previousMonth"
                        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-text hover:bg-primary-200 transition-colors border-l border-border">
                        Back </button>
                    <button @click="nextMonth"
                        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-text hover:bg-primary-200 transition-colors border-l border-border">
                        Next </button>
                </div>
                <div class="absolute left-1/2 -translate-x-1/2 text-center w-full pointer-events-none">
                    <span class="text-base sm:text-lg font-semibold text-text">{{ currentMonthYear }}</span>
                </div>
            </div>
        </div>
        <div class="bg-white border border-border overflow-hidden relative" @click.self="closeModal">
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="calendar-container" />
            <div v-if="currentView === 'Day' || currentView === 'Week'"
                class="absolute z-30 pointer-events-none current-time-line" :style="currentTimeLineStyle">
                <div class="w-full h-0.5 bg-red-500 relative">
                    <div class="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
            </div>
            <div v-if="showModal && clickedDateElement" class="z-50"
                :class="isMobile ? 'fixed inset-0 flex items-center justify-center bg-black/50' : 'absolute'"
                :style="!isMobile ? modalStyle : {}" @click.stop>
                <EventModal :date="selectedDate" :event="editingEvent" @close="closeModal" @submit="handleEventSubmit"
                    @delete="handleEventDelete" @update:title="updateEventTitle" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, DateClickArg, EventClickArg, EventDropArg, EventChangeArg } from '@fullcalendar/core'
import { useEventStore } from '../stores/events'
import { useCalendarNavigation } from '../composables/useCalendarNavigation'
import { useEventModal } from '../composables/useEventModal'
import { CALENDAR_VIEWS, DEFAULT_EVENT_COLOR } from '../constants/calendar'
import EventModal from './EventModal.vue'

const eventStore = useEventStore()
const calendarRef = ref<InstanceType<typeof FullCalendar>>()

const {
    currentView,
    currentDate,
    currentMonthYear,
    isToday,
    getViewName,
    goToToday,
    previous: previousMonth,
    next: nextMonth,
    changeView,
    updateDate
} = useCalendarNavigation(() => calendarRef.value?.getApi())

const {
    showModal,
    clickedDateElement,
    selectedDate,
    modalStyle,
    eventTitlePreview,
    eventSlotStyle,
    editingEvent,
    openModal,
    closeModal,
    updateEventTitle,
    handleEventSubmit,
    handleEventDelete
} = useEventModal(eventStore, () => calendarRef.value)

const currentTimeLineStyle = ref<Record<string, string>>({ top: '0px', display: 'none' })

const updateCurrentTimeLine = () => {
    if (currentView.value === 'Day' || currentView.value === 'Week') {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const slotHeight = 60
        const topPosition = hours * slotHeight + (minutes / 60) * slotHeight

        currentTimeLineStyle.value = {
            top: `${topPosition}px`,
            display: 'block',
            left: '0',
            right: '0'
        }
    } else {
        currentTimeLineStyle.value = { display: 'none', top: '0px', left: '0', right: '0' }
    }
}

const calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: getViewName(currentView.value),
    headerToolbar: false,
    initialDate: currentDate.value,
    events: eventStore.fullCalendarEvents,
    editable: true,
    droppable: true,
    height: 'auto',
    dayMaxEvents: true,
    eventDisplay: 'block',
    moreLinkClick: 'popover',
    slotLabelInterval: { hour: 1 },
    slotDuration: '01:00:00',
    slotMinHeight: 120,
    eventColor: DEFAULT_EVENT_COLOR,
    eventTextColor: '#ffffff',
    dayHeaderFormat: { weekday: 'short' },
    dayHeaderClassNames: 'calendar-day-header',
    dayCellClassNames: 'calendar-day-cell',
    eventClassNames: 'calendar-event',
    dateClick: (info: DateClickArg) => {
        openModal(info.dayEl, info.dateStr, null)
    },
    eventClick: (info: EventClickArg) => {
        const eventId = info.event.id
        const event = eventStore.getEventById(eventId)
        if (event) {
            const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date
            const eventEl = info.el.closest('.fc-daygrid-day')
            if (eventEl) {
                openModal(eventEl as HTMLElement, eventDate.toISOString().split('T')[0], event, info.el as HTMLElement)
            }
        }
    },
    datesSet: (info) => {
        updateDate(info.start)
        updateCurrentTimeLine()
    },
    eventDrop: (info: EventDropArg) => {
        const eventId = info.event.id
        const event = eventStore.getEventById(eventId)
        if (event) {
            const newStart = info.event.start!
            const newEnd = info.event.end || newStart
            eventStore.updateEvent({
                ...event,
                date: newStart,
                start: newStart.toISOString(),
                end: newEnd.toISOString()
            })
        }
    },
    eventResize: (info: EventChangeArg) => {
        const eventId = info.event.id
        const event = eventStore.getEventById(eventId)
        if (event) {
            const newStart = info.event.start!
            const newEnd = info.event.end || newStart
            eventStore.updateEvent({
                ...event,
                date: newStart,
                start: newStart.toISOString(),
                end: newEnd.toISOString()
            })
        }
    }
}))

const handleChangeView = (view: string) => {
    changeView(view as typeof CALENDAR_VIEWS[number])
    closeModal()
    nextTick(() => updateCurrentTimeLine())
}

const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 640
}

let timeLineInterval: number | null = null

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    updateCurrentTimeLine()
    timeLineInterval = window.setInterval(updateCurrentTimeLine, 60000)
    const api = calendarRef.value?.getApi()
    if (api) {
        api.setOption('initialDate', currentDate.value)
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    if (timeLineInterval) {
        clearInterval(timeLineInterval)
    }
})
</script>
<style scoped>
:deep(.fc) {
    font-family: inherit;
}

:deep(.fc-header-toolbar) {
    display: none;
}

:deep(.fc-col-header-cell-cushion) {
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
}

:deep(.fc-daygrid-day-header) {
    background-color: var(--color-primary-300);
    color: var(--color-text-muted);
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    border-color: var(--color-border);
}

:deep(.fc-daygrid-day) {
    background-color: white;
    border-color: var(--color-border);
    min-height: 6rem;
}

:deep(.fc-daygrid-day.fc-day-today) {
    background: var(--color-primary-300);
}

:deep(.fc-daygrid-day.fc-day-selected) {
    position: relative;
    background-color: rgba(59, 134, 255, 0.1) !important;
}

:deep(.fc-daygrid-day-number) {
    color: var(--color-text);
    font-size: 0.875rem;
    padding: 0.5rem;
}

:deep(.fc-event.fc-event-editing) {
    background-color: transparent !important;
    border: 1px solid var(--color-event-bg) !important;

}

:deep(.fc-event.fc-event-editing .fc-event-title) {
    color: var(--color-event-bg) !important;
}

:deep(.fc-event) {
    background-color: rgba(59, 134, 255, 0.2);
    border-color: var(--color-event-bg);
    color: var(--color-event-bg);
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    font-size: 11px;
    font-weight: 700;
    border-width: 0;
}

:deep(.fc-event-time) {
    display: none;
}

:deep(.fc-timegrid-slot-label) {
    padding: 1rem 0;
}

:deep(.fc-event-title) {
    text-transform: capitalize;
}

:deep(.fc-daygrid-event) {
    margin: 0.125rem 0;
}

:deep(.fc-daygrid-day.fc-day-other) {
    background-color: var(--color-primary-300);
}

:deep(.fc-daygrid-day.fc-day-other .fc-daygrid-day-number) {
    color: var(--color-text-muted);
}

:deep(.fc-col-header-cell) {
    border-color: var(--color-border);
    background-color: var(--color-primary-300);
    padding: 0.75rem 0.5rem;
}

:deep(.fc-scrollgrid) {
    border-color: var(--color-border);
}

:deep(.fc-scrollgrid-section-header) {
    border-color: var(--color-border);
}

.current-time-line {
    left: 0;
    right: 0;
}

:deep(.fc-timegrid-body) {
    position: relative;
}

:deep(.fc-daygrid-day.fc-day-today) {
    background-color: var(--color-primary-300) !important;
}

:deep(.fc-timegrid-now-indicator-line) {
    border-color: var(--color-event-bg) !important;
    border-width: 2px !important;
}

:deep(.fc-timegrid-now-indicator-arrow) {
    border-top-color: var(--color-event-bg) !important;
}

:deep(.fc-timegrid-now-indicator-event) {
    background-color: var(--color-primary-300) !important;
}

:deep(.fc-timegrid-slot.fc-timegrid-slot-label) {
    color: var(--color-text-muted, #A3A6B4);
}
</style>
