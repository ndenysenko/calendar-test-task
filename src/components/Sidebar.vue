<template>
    <aside :class="[
        'w-64 bg-primary-100 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
        <div class="px-5 py-6 bg-primary flex items-center justify-between">
            <h1 class="text-md leading-2 font-semibold text-white">IMPEKABLE</h1>
            <button @click="$emit('close')" class="lg:hidden text-white hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <nav class="flex-1">
            <ul class="space-y-1">
                <li v-for="item in navigationItems" :key="item.name">
                    <RouterLink :to="item.to" :class="[
                        'flex items-center gap-1.5 px-5 py-4 transition-colors relative',
                        isActive(item.to)
                            ? 'border-l-4 border-accent bg-primary'
                            : 'hover:bg-primary text-icon'
                    ]">
                        <component :is="item.icon" :class="[
                            'w-5 h-5 shrink-0',
                            isActive(item.to) ? 'text-accent' : 'text-icon'
                        ]" />
                        <span :class="[
                            'text-sm font-medium',
                            isActive(item.to) ? 'text-white' : 'text-icon'
                        ]"> {{ item.name }} </span>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </aside>
</template>
<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

defineProps<{
    isOpen?: boolean
}>()

defineEmits<{
    close: []
}>()
import {
    HomeIcon,
    Squares2X2Icon,
    InboxIcon,
    Bars3Icon,
    DocumentTextIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    GlobeAltIcon,
    Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const isActive = (path: string) => {
    return route.path === path || route.path.startsWith(path + '/')
}

const navigationItems = [
    {
        name: 'Home',
        to: '/home',
        icon: HomeIcon
    },
    {
        name: 'Dashboard',
        to: '/dashboard',
        icon: Squares2X2Icon
    },
    {
        name: 'Inbox',
        to: '/inbox',
        icon: InboxIcon
    },
    {
        name: 'Products',
        to: '/products',
        icon: Bars3Icon
    },
    {
        name: 'Invoices',
        to: '/invoices',
        icon: DocumentTextIcon
    },
    {
        name: 'Customers',
        to: '/customers',
        icon: UsersIcon
    },
    {
        name: 'Chat Room',
        to: '/chat',
        icon: ChatBubbleLeftRightIcon
    },
    {
        name: 'Calendar',
        to: '/',
        icon: CalendarIcon
    },
    {
        name: 'Help Center',
        to: '/help',
        icon: GlobeAltIcon
    },
    {
        name: 'Settings',
        to: '/settings',
        icon: Cog6ToothIcon
    }
]
</script>
