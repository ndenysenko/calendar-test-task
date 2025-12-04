export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString()
}

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

export const formatTimeFromDate = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export const parseDateString = (dateStr: string): Date => {
  return new Date(dateStr)
}

