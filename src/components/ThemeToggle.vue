<template>
  <button
    @click="toggleTheme"
    class="text-m-neutral-600 dark:text-m-neutral-400 hover:text-m-neutral-900 dark:hover:text-m-neutral-100 transition-colors cursor-pointer flex items-center justify-center p-1"
    aria-label="Toggle Theme"
  >
    <Sun v-if="!isDark" class="w-6 h-6" />
    <Moon v-else class="w-6 h-6" />
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Sun, Moon } from '@lucide/vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
}

onMounted(() => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
  }
})

watch(
  isDark,
  (newDark) => {
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  },
  { immediate: true },
)
</script>
