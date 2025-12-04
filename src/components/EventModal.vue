<template>
    <div
        class="bg-white shadow-lg rounded-lg p-4 w-full sm:w-80 z-50 border border-border max-h-[90vh] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
            <div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="color in EVENT_COLORS" :key="color.value" type="button"
                        @click="formData.color = color.value" :class="[
                            'w-5 h-5 rounded-full transition-all',
                            formData.color === color.value ? 'scale-115' : ''
                        ]" :style="{ backgroundColor: color.value }" :title="color.name"></button>
                </div>
            </div>
            <div>
                <input v-model="formData.title" type="text" placeholder="Event Name" required maxlength="30"
                    @input="handleTitleInput" :class="[
                        'w-full px-3 py-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-event-bg',
                        formData.title.length >= 30 ? 'border-red-500' : ''
                    ]" />
                <p class="text-xs text-text-muted mt-1">{{ formData.title.length }}/30</p>
            </div>
            <div class="relative">
                <input v-model="formData.date" type="date" required
                    class="w-full px-3 py-2 pr-10 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-event-bg" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-icon pointer-events-none">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            </div>
            <div class="relative">
                <input v-model="formData.time" type="time"
                    class="w-full px-3 py-2 pr-10 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-event-bg" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-icon pointer-events-none">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <textarea v-model="formData.description" placeholder="Notes" rows="3"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-event-bg resize-none"></textarea>
            <div class="flex items-center justify-between gap-2 pt-2 border-t border-border">
                <button v-if="props.event" type="button" @click="handleDelete"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                    DELETE </button>
                <div class="flex gap-2 justify-between w-full ml-auto">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                        DISCARD </button>
                    <button type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-text hover:bg-text/90 rounded-lg transition-colors">
                        {{ props.event ? 'SAVE' : 'SUBMIT' }} </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CalendarEvent, EventFormData } from '../types/calendar'
import { DEFAULT_EVENT_COLOR, EVENT_COLORS } from '../constants/calendar'
import { formatTimeFromDate, parseDateString } from '../utils/date'

const props = defineProps<{
    date: string
    event?: CalendarEvent | null
}>()

const emit = defineEmits<{
    close: []
    submit: [data: EventFormData]
    delete: [eventId: string]
    'update:title': [title: string]
}>()

const formData = ref({
    title: '',
    date: '',
    time: '',
    description: '',
    color: DEFAULT_EVENT_COLOR
})

watch(() => props.date, (newDate) => {
    if (newDate) {
        const date = parseDateString(newDate)
        formData.value.date = date.toISOString().split('T')[0]
    }
}, { immediate: true })

watch(() => props.event, (event) => {
    if (event) {
        formData.value.title = event.title
        const eventDate = typeof event.date === 'string' ? parseDateString(event.date) : event.date
        formData.value.date = eventDate.toISOString().split('T')[0]
        if (event.start) {
            formData.value.time = formatTimeFromDate(parseDateString(event.start))
        }
        formData.value.description = event.description || ''
        formData.value.color = event.color || DEFAULT_EVENT_COLOR
        emit('update:title', event.title)
    } else {
        formData.value = {
            title: '',
            date: props.date ? parseDateString(props.date).toISOString().split('T')[0] : '',
            time: '',
            description: '',
            color: DEFAULT_EVENT_COLOR
        }
        emit('update:title', '')
    }
}, { immediate: true })


const handleTitleInput = () => {
    if (formData.value.title.length > 30) {
        formData.value.title = formData.value.title.slice(0, 30)
    }
    emit('update:title', formData.value.title)
}

const handleDelete = () => {
    if (props.event) {
        emit('delete', props.event.id)
    }
}

const handleSubmit = () => {
    emit('submit', {
        title: formData.value.title,
        date: formData.value.date,
        time: formData.value.time || undefined,
        description: formData.value.description || undefined,
        color: formData.value.color || DEFAULT_EVENT_COLOR
    })
    const currentDate = props.date ? parseDateString(props.date).toISOString().split('T')[0] : ''
    formData.value = { title: '', date: currentDate, time: '', description: '', color: DEFAULT_EVENT_COLOR }
}
</script>
<style scoped></style>