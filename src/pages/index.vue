<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="w-full flex flex-col gap-y-3">
    <div class="w-full flex justify-end">
      <ToggleButton
        :model-value="filtroPlacar"
        :options="filterOptions"
        @update:model-value="(value) => (filtroPlacar = value)"
      />
    </div>
    <PlacarTabela :filtro="filtroPlacar" />
  </div>
</template>

<script setup>
import PlacarTabela from '@/components/PlacarTabela.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import { ref, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { useSede } from '@/composables/useSede'

const filtroPlacar = ref('geral')
const { t } = useLocale()
const { activeSede } = useSede()

const filterOptions = computed(() => {
  const localLabel = t('filter.local')
  const instName = activeSede.value.instituicao || activeSede.value.nome
  const finalLocalLabel =
    instName && instName.toLowerCase() !== localLabel.toLowerCase()
      ? `${localLabel} - ${instName}`
      : localLabel

  return [
    { label: t('filter.general'), value: 'geral' },
    { label: finalLocalLabel, value: 'sede' },
  ]
})
</script>
