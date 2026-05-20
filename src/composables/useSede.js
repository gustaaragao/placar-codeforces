import { ref, computed } from 'vue'
import config from '@/config.json'

const STORAGE_KEY = 'placar_sede'
const sedes = config.sedesLocais || []

const selectedSedeIndex = ref(0)

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null && !isNaN(stored) && stored >= 0 && stored < sedes.length) {
    selectedSedeIndex.value = Number(stored)
  }
}

export function useSede() {
  const activeSede = computed(() => sedes[selectedSedeIndex.value] || {})

  function setSede(index) {
    if (index >= 0 && index < sedes.length) {
      selectedSedeIndex.value = index
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, index)
      }
    }
  }

  return { activeSede, sedes, selectedSedeIndex, setSede }
}
