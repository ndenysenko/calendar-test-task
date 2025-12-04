<template>
    <div class="min-h-screen flex items-center justify-center bg-primary-200 px-4">
        <div class="text-center max-w-md w-full">
            <div class="mb-8!">
                <h1 class="text-9xl font-bold text-primary mb-4!">404</h1>
                <h2 class="text-3xl font-semibold text-text mb-3!">Page Not Found</h2>
                <p class="text-text-muted text-lg"> The page you're looking for doesn't exist or has been moved. </p>
            </div>
            <RouterLink to="/"
                class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"> Go
                to Calendar </RouterLink>
        </div>
    </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<style lang="css" scoped></style>