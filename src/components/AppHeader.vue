<template>
  <header
    class="flex items-center justify-between px-8 py-4 border-b border-m-neutral-200/60 dark:border-m-neutral-800/80 bg-m-neutral-50 dark:bg-m-neutral-900 rounded-t-xl transition-colors duration-300 shadow-md"
  >
    <div class="flex gap-x-4 items-center">
      <img
        src="@/assets/logo-mfp.png"
        alt="Logo Maratona Feminina de Programação"
        class="size-14"
      />
      <h1 class="text-3xl font-bold text-m-primary-600 dark:text-m-primary-500">
        Maratona Feminina de Programação
      </h1>
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <nav
        class="flex items-center gap-1 bg-m-neutral-200/60 dark:bg-m-neutral-800/60 p-1 rounded-lg border border-m-neutral-300/40 dark:border-m-neutral-700/40"
      >
        <NuxtLink
          to="/"
          class="px-3 py-1 text-sm font-medium rounded-md transition-all duration-200"
          active-class="bg-white dark:bg-m-neutral-700 text-m-primary-600 dark:text-m-primary-400 shadow-xs"
          inactive-class="text-m-neutral-600 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-200"
        >
          Placar
        </NuxtLink>
        <NuxtLink
          to="/admin"
          class="px-3 py-1 text-sm font-medium rounded-md transition-all duration-200"
          active-class="bg-white dark:bg-m-neutral-700 text-m-primary-600 dark:text-m-primary-400 shadow-xs"
          inactive-class="text-m-neutral-600 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-200"
        >
          Admin
        </NuxtLink>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
