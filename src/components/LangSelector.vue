<template>
  <div
    class="relative inline-flex items-center p-0.5 rounded-lg border border-m-neutral-300/40 dark:border-m-neutral-700/40 bg-m-neutral-200/60 dark:bg-m-neutral-800/60"
    role="group"
    aria-label="Language selector"
  >
    <button
      v-for="lang in supported"
      :key="lang"
      type="button"
      :id="`lang-btn-${lang}`"
      class="cursor-pointer relative z-10 px-2 py-1 text-xs font-bold rounded-md transition-all duration-200 uppercase tracking-wider focus:outline-none"
      :class="
        locale === lang
          ? 'bg-white dark:bg-m-neutral-700 text-m-primary-600 dark:text-m-primary-400 shadow-xs'
          : 'text-m-neutral-500 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-200'
      "
      :aria-pressed="locale === lang"
      @click="setLocale(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, supported } = useLocale()
</script>
