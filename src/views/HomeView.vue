<template>
  <div class="w-full px-3 py-4 flex flex-col gap-y-4">
    <div class="w-full flex justify-end">
      <ToggleButton
        :model-value="filtroPlacar"
        @update:model-value="(value) => (filtroPlacar = value)"
      />
    </div>
    <PlacarTabela :filtro="filtroPlacar" />
  </div>
</template>

<script setup>
import PlacarTabela from '@/components/PlacarTabela.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import { ref } from 'vue'

const filtroPlacar = ref('geral')
</script>
