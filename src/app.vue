<template>
  <div
    class="min-h-screen w-full flex flex-col bg-m-neutral-200 text-gray-900 dark:bg-[#111111] dark:text-white transition-colors duration-300"
  >
    <header class="shrink-0">
      <AppHeader />
    </header>
    <main class="flex-1 relative p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
      <NuxtPage />
    </main>
    <footer class="sticky bottom-0 shrink-0">
      <AppFooter />
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import faviconUrl from '@/assets/logo-mfp.png'
import { useLocale } from '@/composables/useLocale'
import { computed } from 'vue'

const { t } = useLocale()
const pageTitle = computed(() => t('head.title'))

useHead({
  title: pageTitle,
  link: [{ rel: 'icon', type: 'image/png', href: faviconUrl }],
})
</script>
