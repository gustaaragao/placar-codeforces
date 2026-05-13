<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col bg-gray-50 text-gray-900 dark:bg-[#111111] dark:text-white transition-colors duration-300">
    <header class="shrink-0">
      <AppHeader />
    </header>
    <main class="flex-1 overflow-hidden relative p-4 md:p-8">
      <RouterView />
    </main>
    <footer class="shrink-0">
      <AppFooter />
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
