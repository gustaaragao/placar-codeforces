<template>
  <header
    class="flex items-center justify-between px-8 py-6 border-b border-m-neutral-200/60 dark:border-m-neutral-800/80 bg-m-neutral-50 dark:bg-m-neutral-900 rounded-t-xl transition-colors duration-300"
  >
    <h1 class="text-3xl font-bold text-m-primary-600 dark:text-m-primary-500">Scoreboard</h1>

    <div class="flex items-center gap-6">
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
