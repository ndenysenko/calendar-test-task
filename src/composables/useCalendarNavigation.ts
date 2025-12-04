import { ref, computed } from 'vue'
import type { CalendarApi } from '@fullcalendar/core'
import type { CalendarView } from '../types/calendar'
import { VIEW_NAME_MAP } from '../constants/calendar'
import { isSameDate, isSameMonth } from '../utils/date'

export function useCalendarNavigation(calendarApi: () => CalendarApi | undefined) {
  const currentView = ref<CalendarView>('Month')
  const currentDate = ref(new Date())

  const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  })

  const isToday = computed(() => {
    const today = new Date()
    const current = currentDate.value
    if (currentView.value === 'Month') {
      return isSameMonth(current, today)
    } else {
      return isSameDate(current, today)
    }
  })

  const getViewName = (view: CalendarView): string => {
    return VIEW_NAME_MAP[view] || 'dayGridMonth'
  }

  const goToToday = () => {
    calendarApi()?.today()
  }

  const previous = () => {
    calendarApi()?.prev()
  }

  const next = () => {
    calendarApi()?.next()
  }

  const changeView = (view: CalendarView) => {
    currentView.value = view
    const api = calendarApi()
    if (api) {
      api.changeView(getViewName(view))
    }
  }

  const updateDate = (date: Date) => {
    currentDate.value = date
  }

  return {
    currentView,
    currentDate,
    currentMonthYear,
    isToday,
    getViewName,
    goToToday,
    previous,
    next,
    changeView,
    updateDate
  }
}

