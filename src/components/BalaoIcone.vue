<template>
  <div class="w-fit flex flex-col items-center justify-center">
    <div
      class="relative flex justify-center items-center transition-all duration-500"
      :class="{
        'animate-bounce scale-125 z-20': animar,
      }"
    >
      <Balloon
        v-if="estado === 'resolvido'"
        size="32"
        :fill="cor"
        :style="{ color: cor }"
        class="stroke-[1px] stroke-m-neutral-800 dark:stroke-white"
      />
      <Balloon
        v-else-if="estado === 'tentado'"
        size="32"
        class="text-m-secondary-600 dark:text-m-secondary-400"
      />
      <Balloon
        v-else-if="estado === 'vazio'"
        size="32"
        class="text-m-neutral-300 dark:text-m-neutral-700"
      />

      <Star
        v-if="estado === 'resolvido' && isFirst"
        size="16"
        :fill="cor"
        :style="{ color: cor }"
        class="absolute -top-1.5 -right-1.5 stroke-[1px] stroke-m-neutral-800 dark:stroke-white"
      />
    </div>
    <div
      v-if="estado !== 'vazio' && tentativas !== undefined"
      class="text-[11px] font-mono mt-1 text-center leading-none"
    >
      <span
        v-if="estado === 'resolvido'"
        class="text-m-neutral-800 dark:text-m-neutral-300 font-semibold dark:font-medium"
        >{{ tentativas }}/{{ tempo }}</span
      >
      <span
        v-else-if="estado === 'tentado'"
        class="text-m-secondary-600 dark:text-m-secondary-400 font-semibold dark:font-medium"
        >{{ tentativas }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { Balloon, Star } from '@lucide/vue'

defineProps({
  tentativas: Number,
  tempo: Number,
  cor: String,
  estado: {
    type: String,
    default: 'vazio', // 'resolvido', 'tentado', 'vazio'
  },
  isFirst: {
    type: Boolean,
    default: false,
  },
  animar: {
    type: Boolean,
    default: false,
  },
})
</script>
