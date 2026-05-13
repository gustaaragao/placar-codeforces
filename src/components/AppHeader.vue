<template>
  <header class="flex items-center justify-between px-8 py-6 border-b border-gray-200/60 bg-white rounded-t-xl">
    <h1 class="text-3xl font-bold text-purple-600">Scoreboard</h1>
    
    <div class="flex items-center gap-6">
      <button class="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center justify-center p-1">
        <Sun class="w-6 h-6" />
      </button>
      
      <div class="flex bg-gray-200/80 p-1 rounded-full items-center">
        <button class="px-6 py-1.5 rounded-full bg-purple-500 text-white font-medium text-sm transition-colors shadow-sm">
          Geral
        </button>
        <button class="px-6 py-1.5 rounded-full text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors">
          Sede Local
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Sun } from '@lucide/vue'
</script>
