<template>
  <header
    class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-m-neutral-200/60 dark:border-m-neutral-800/80 bg-m-neutral-50 dark:bg-m-neutral-900 rounded-t-xl transition-colors duration-300 shadow-md"
  >
    <div class="flex gap-x-3 items-center min-w-0">
      <img
        v-if="evento.icone"
        :src="evento.icone"
        :alt="'Logo ' + evento.nome"
        class="size-10 sm:size-12 lg:size-14 shrink-0"
      />
      <h1 class="text-lg sm:text-2xl lg:text-3xl font-bold leading-tight" :class="evento.corBase">
        {{ evento.nome }}
      </h1>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Seletor de Sede -->
      <SedeSelector />

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
import SedeSelector from '@/components/SedeSelector.vue'
import config from '@/config.json'

const evento = config.evento || {
  nome: 'Maratona de Programação',
  icone: '',
  corBase: 'text-m-primary-600 dark:text-m-primary-500',
}
</script>
