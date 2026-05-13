<template>
  <header
    class="flex items-center justify-between px-8 py-6 border-b border-m-neutral-200/60 dark:border-m-neutral-800/80 bg-m-neutral-50 dark:bg-m-neutral-900 rounded-t-xl transition-colors duration-300"
  >
    <div class="w-full flex gap-x-4 items-center">
      <img
        src="@/assets/logo-mfp.png"
        alt="Logo Maratona Feminina de Programação"
        class="size-14"
      />
      <h1 class="text-3xl font-bold text-m-primary-600 dark:text-m-primary-500">
        Maratona Feminina de Programação
      </h1>
    </div>

    <div class="flex items-center gap-6">
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
