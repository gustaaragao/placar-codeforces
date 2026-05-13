<template>
  <div class="w-fit flex flex-col items-center justify-center">
    <div class="relative flex justify-center items-center">
      <Balloon
        v-if="estado === 'resolvido'"
        size="32"
        :fill="cor"
        :color="cor"
        :style="isFirst ? `filter: drop-shadow(0 0 8px ${cor});` : ''"
      />
      <Balloon v-else-if="estado === 'tentado'" size="32" color="#f87171" />
      <Balloon v-else-if="estado === 'vazio'" size="32" color="#a1a1aa" />
    </div>
    <div
      v-if="estado !== 'vazio' && tentativas !== undefined"
      class="text-[11px] font-mono text-zinc-400 mt-1 text-center leading-none"
    >
      <span v-if="estado === 'resolvido'" class="text-zinc-300">{{ tentativas }}/{{ tempo }}</span>
      <span v-else-if="estado === 'tentado'" class="text-red-400">{{ tentativas }}</span>
    </div>
  </div>
</template>

<script setup>
import { Balloon } from '@lucide/vue'

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
})
</script>
