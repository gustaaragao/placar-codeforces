<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col bg-[#111111] text-white">
    <header class="shrink-0">
      <AppHeader />
    </header>
    <main class="flex-1 overflow-hidden relative">
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
