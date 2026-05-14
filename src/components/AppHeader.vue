<template>
  <header
    class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-m-neutral-200/60 dark:border-m-neutral-800/80 bg-m-neutral-50 dark:bg-m-neutral-900 rounded-t-xl transition-colors duration-300 shadow-md"
  >
    <div class="flex gap-x-3 items-center min-w-0">
      <img
        src="@/assets/logo-mfp.png"
        alt="Logo Maratona Feminina de Programação"
        class="size-10 sm:size-12 lg:size-14 shrink-0"
      />
      <h1
        class="text-lg sm:text-2xl lg:text-3xl font-bold text-m-primary-600 dark:text-m-primary-500 leading-tight"
      >
        Maratona Feminina de Programação
      </h1>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Navegação -->
      <nav
        class="flex items-center gap-1 bg-m-neutral-200/60 dark:bg-m-neutral-800/60 p-1 rounded-lg border border-m-neutral-300/40 dark:border-m-neutral-700/40"
        :aria-label="t('nav.scoreboard')"
      >
        <NuxtLink
          to="/"
          class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-200"
          active-class="bg-white dark:bg-m-neutral-700 text-m-primary-600 dark:text-m-primary-400 shadow-xs"
          inactive-class="text-m-neutral-600 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-200"
        >
          {{ t('nav.scoreboard') }}
        </NuxtLink>
        <NuxtLink
          to="/admin"
          class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-200"
          active-class="bg-white dark:bg-m-neutral-700 text-m-primary-600 dark:text-m-primary-400 shadow-xs"
          inactive-class="text-m-neutral-600 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-200"
        >
          {{ t('nav.admin') }}
        </NuxtLink>
      </nav>

      <!-- Seletor de Idioma -->
      <LangSelector />

      <!-- Toggle de Tema -->
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
import LangSelector from '@/components/LangSelector.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>
