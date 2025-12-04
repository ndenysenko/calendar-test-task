<template>
    <div class="flex min-h-screen bg-primary-200">
        <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
        <div class="flex-1 lg:ml-64 w-full">
            <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
            <Calendar />
        </div>
        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="sidebarOpen = false"></div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import Calendar from '../components/Calendar.vue';

const sidebarOpen = ref(false)
</script>
