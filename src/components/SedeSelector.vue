<template>
  <div class="relative inline-block text-left" v-if="sedes.length > 0" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="inline-flex justify-between items-center w-full min-w-[140px] px-3 py-1.5 bg-white dark:bg-m-neutral-800 text-gray-700 dark:text-gray-300 rounded-md text-xs sm:text-sm font-medium border border-gray-300 dark:border-m-neutral-700 focus:outline-none focus:ring-2 focus:ring-m-primary-500/50 shadow-sm transition-colors duration-200"
      :title="t('filter.local') || 'Sede'"
    >
      <span class="truncate pr-2">{{ selectedName }}</span>
      <ChevronDown
        class="size-4 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-[#1a1a1a] shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none flex flex-col max-h-72"
      >
        <!-- Search Input -->
        <div class="p-2 border-b border-gray-100 dark:border-zinc-800 shrink-0">
          <div class="relative">
            <Search
              class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 dark:text-zinc-500"
            />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar sede..."
              class="w-full pl-8 pr-2 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-m-primary-500 transition-colors"
            />
          </div>
        </div>

        <!-- Options List -->
        <ul class="overflow-y-auto py-1 flex-1">
          <li
            v-if="filteredSedes.length === 0"
            class="px-3 py-3 text-xs text-center text-gray-500 dark:text-zinc-400"
          >
            Nenhuma sede encontrada
          </li>
          <li
            v-for="sede in filteredSedes"
            :key="sede.index"
            @click="selectSede(sede.index)"
            class="group cursor-pointer flex items-center justify-between px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors"
            :class="
              sede.index === selectedSedeIndex
                ? 'bg-m-primary-50/50 dark:bg-m-primary-950/20 text-m-primary-700 dark:text-m-primary-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300'
            "
          >
            <span class="truncate">{{ sede.nome }}</span>
            <Check v-if="sede.index === selectedSedeIndex" class="size-3.5 shrink-0" />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Search, Check } from '@lucide/vue'
import { useSede } from '@/composables/useSede'
import { useLocale } from '@/composables/useLocale'

const { sedes, selectedSedeIndex, setSede } = useSede()
const { t } = useLocale()

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const getSedeName = (sede, index) => {
  return sede.nome || sede.instituicao || `Sede ${index + 1}`
}

const selectedName = computed(() => {
  if (selectedSedeIndex.value >= 0 && selectedSedeIndex.value < sedes.length) {
    return getSedeName(sedes[selectedSedeIndex.value], selectedSedeIndex.value)
  }
  return 'Selecionar Sede'
})

const filteredSedes = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return sedes
    .map((sede, index) => ({
      ...sede,
      index,
      nome: getSedeName(sede, index),
    }))
    .filter((sede) => sede.nome.toLowerCase().includes(query))
})

const selectSede = (index) => {
  setSede(index)
  isOpen.value = false
}
</script>
