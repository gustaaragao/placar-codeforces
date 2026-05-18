<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="w-full max-w-6xl mx-auto px-3 py-2 flex flex-col gap-y-6 font-sans">
    <!-- Cabeçalho do Dashboard Admin -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#181818] px-6 py-4 rounded-xl border border-gray-200 dark:border-zinc-800/80 shadow-sm transition-colors duration-300"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-x-3">
          <Balloon class="size-7 text-m-primary-600 dark:text-m-primary-400 animate-pulse" />
          {{ t('admin.title') }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="loadData"
          :disabled="loading"
          class="cursor-pointer inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-m-primary-50 hover:bg-m-primary-100 text-m-primary-700 dark:bg-m-neutral-800 dark:hover:bg-m-neutral-700 dark:text-m-primary-400 border border-m-primary-200 dark:border-m-neutral-700 transition-all duration-200 shadow-xs"
          title="Atualizar Submissões"
        >
          <RefreshCw :class="{ 'animate-spin': loading }" class="size-4" />
          <span>{{ loading ? t('admin.updating') : t('admin.update') }}</span>
        </button>

        <button
          @click="clearDelivered"
          v-if="deliveredIds.size > 0"
          class="cursor-pointer inline-flex items-center gap-x-2 px-3 py-2 text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors duration-200"
          title="Limpar histórico de balões entregues"
        >
          <Trash2 class="size-4" />
          <span class="hidden sm:inline">{{ t('admin.resetHistory') }}</span>
        </button>
      </div>
    </div>

    <!-- Barra de Filtros e Abas -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <!-- Controle de Abas (Segmented Control) -->
      <div
        class="inline-flex p-1 rounded-lg bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-zinc-800 self-start md:self-auto transition-colors duration-300"
      >
        <button
          @click="activeTab = 'pendentes'"
          class="cursor-pointer relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-x-2"
          :class="
            activeTab === 'pendentes'
              ? 'bg-white dark:bg-zinc-800 text-m-primary-600 dark:text-m-primary-400 shadow-xs font-semibold'
              : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
          "
        >
          <span>{{ t('admin.pending') }}</span>
          <span
            class="px-2 py-0.5 text-xs rounded-full font-mono font-bold transition-all"
            :class="
              activeTab === 'pendentes'
                ? 'bg-m-primary-100 text-m-primary-800 dark:bg-m-primary-950 dark:text-m-primary-300'
                : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300'
            "
          >
            {{ pendingBalloons.length }}
          </span>
        </button>

        <button
          @click="activeTab = 'entregues'"
          class="cursor-pointer relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-x-2"
          :class="
            activeTab === 'entregues'
              ? 'bg-white dark:bg-zinc-800 text-m-primary-600 dark:text-m-primary-400 shadow-xs font-semibold'
              : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
          "
        >
          <span>{{ t('admin.delivered') }}</span>
          <span
            class="px-2 py-0.5 text-xs rounded-full font-mono font-bold transition-all"
            :class="
              activeTab === 'entregues'
                ? 'bg-m-primary-100 text-m-primary-800 dark:bg-m-primary-950 dark:text-m-primary-300'
                : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300'
            "
          >
            {{ deliveredBalloons.length }}
          </span>
        </button>
      </div>

      <!-- Filtro de Laboratório -->
      <div class="flex flex-wrap gap-2 items-center" v-if="availableLabs.length > 1">
        <button
          v-for="lab in availableLabs"
          :key="lab"
          @click="filterLab = lab"
          class="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border"
          :class="
            filterLab === lab
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-[#181818] dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-[#202020]'
          "
        >
          {{ lab === 'Todos' ? 'Mostrar Todos' : `Apenas ${lab}` }}
        </button>
      </div>

      <!-- Campo de Busca -->
      <div class="relative w-full md:w-80">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-zinc-500"
        >
          <Search class="size-4" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('admin.search')"
          class="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#181818] border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-m-primary-500/20 focus:border-m-primary-500 transition-colors duration-200"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
        >
          <span class="text-xs font-bold bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
            >Esc</span
          >
        </button>
      </div>
    </div>

    <!-- Mensagem de Última Atualização -->
    <div v-if="lastUpdated" class="text-xs text-gray-500 dark:text-zinc-500 text-right -mt-2">
      {{ t('admin.lastCheck') }}: {{ lastUpdated }}
    </div>

    <!-- Área de Conteúdo: Balões Pendentes -->
    <div v-if="activeTab === 'pendentes'" class="flex flex-col gap-y-3">
      <div
        v-if="loading && allBalloons.length === 0"
        class="py-16 text-center flex flex-col items-center justify-center gap-3"
      >
        <RefreshCw class="size-8 animate-spin text-m-primary-500" />
        <span class="text-sm text-gray-500 dark:text-zinc-400">{{
          t('admin.loadingSubmissions')
        }}</span>
      </div>

      <div
        v-else-if="pendingBalloons.length === 0"
        class="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center transition-colors duration-300"
      >
        <div
          class="p-4 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 mb-3"
        >
          <Check class="size-8" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('admin.noPendingTitle') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-md">
          {{ searchQuery ? t('admin.noPendingSearch') : t('admin.noPendingAll') }}
        </p>
      </div>

      <!-- Lista de Grid de Balões Pendentes -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in pendingBalloons"
          :key="item.uniqueId"
          class="group bg-white dark:bg-[#181818] hover:bg-gray-50/50 dark:hover:bg-[#202020] border border-gray-200 dark:border-zinc-800/80 rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <!-- Seção Esquerda: Ícone do Balão -->
          <div
            class="relative shrink-0 flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-zinc-800/50 transition-colors"
          >
            <Balloon
              :size="40"
              :fill="item.color"
              :style="{ color: item.color }"
              class="stroke-[1px] stroke-m-neutral-800 dark:stroke-white drop-shadow-sm transition-transform group-hover:scale-110 duration-300"
            />
            <Star
              v-if="item.isFirst"
              :size="16"
              :fill="item.color"
              :style="{ color: item.color }"
              class="absolute -top-1 -right-1 stroke-[1px] stroke-m-neutral-800 dark:stroke-white animate-spin-slow"
              title="First Blood (Primeiro a Resolver)"
            />
          </div>

          <!-- Seção Central: Informações -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded"
                :style="{ backgroundColor: `${item.color}20`, color: item.color }"
              >
                Problema {{ item.problemId }}
              </span>
              <span
                v-if="item.colorName"
                class="text-xs font-medium px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 flex items-center gap-x-1"
              >
                <span
                  class="size-2 rounded-full shrink-0"
                  :style="{ backgroundColor: item.color }"
                ></span>
                {{ item.colorName }}
              </span>
              <span class="text-xs text-gray-500 dark:text-zinc-500 font-mono ml-auto">
                {{ item.time }} min
              </span>
            </div>

            <span
              class="font-bold text-gray-900 dark:text-zinc-100 text-base truncate tracking-tight mt-1"
              :title="item.teamName"
            >
              {{ getShortName(item.teamName) }}
              {{ getCodeforcesName(item.teamName) }}
            </span>

            <div class="flex items-center gap-x-2 mt-0.5">
              <span
                v-if="item.laboratorio"
                class="inline-flex items-center gap-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                title="Laboratório"
              >
                📍 {{ item.laboratorio }}
              </span>
              <span class="text-xs text-gray-400 dark:text-zinc-500">
                {{ t('admin.tries', item.tries) }}
              </span>
            </div>
          </div>

          <!-- Seção Direita: Botão de Ação -->
          <button
            @click="markAsDelivered(item.uniqueId)"
            class="cursor-pointer shrink-0 flex items-center justify-center p-2.5 rounded-lg bg-m-primary-50 hover:bg-m-primary-600 text-m-primary-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-m-primary-600 dark:text-m-primary-400 dark:hover:text-white border border-m-primary-100 dark:border-zinc-700 transition-all duration-200"
            :title="t('admin.markDelivered')"
          >
            <Check class="size-5" />
          </button>
        </div>
      </div>
    </div>
    <!-- Área de Conteúdo: Balões Entregues -->
    <div v-if="activeTab === 'entregues'" class="flex flex-col gap-y-3">
      <div
        v-if="deliveredBalloons.length === 0"
        class="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center transition-colors duration-300"
      >
        <div
          class="p-4 rounded-full bg-gray-50 dark:bg-zinc-800/50 text-gray-400 dark:text-zinc-600 mb-3"
        >
          <Balloon class="size-8 opacity-50" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('admin.noDeliveredTitle') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-md">
          {{ searchQuery ? t('admin.noDeliveredSearch') : t('admin.noDeliveredAll') }}
        </p>
      </div>
      <!-- Lista de Grid de Balões Entregues -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in deliveredBalloons"
          :key="item.uniqueId"
          class="group bg-white/60 dark:bg-[#181818]/60 hover:bg-white dark:hover:bg-[#181818] border border-gray-200/80 dark:border-zinc-800/60 rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-300 opacity-80 hover:opacity-100"
        >
          <!-- Seção Esquerda: Ícone do Balão (com overlay de entregue) -->
          <div
            class="relative shrink-0 flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-zinc-800/30"
          >
            <Balloon
              :size="40"
              :fill="item.color"
              :style="{ color: item.color }"
              class="stroke-[1px] stroke-m-neutral-800 dark:stroke-white drop-shadow-xs"
            />
            <div
              class="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-[0.5px]"
            >
              <Check class="size-5 text-green-600 dark:text-green-400 stroke-3" />
            </div>
          </div>
          <!-- Seção Central: Informações -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded line-through text-gray-400 dark:text-zinc-500"
                :style="{ backgroundColor: `${item.color}10` }"
              >
                Problema {{ item.problemId }}
              </span>
              <span
                v-if="item.colorName"
                class="text-xs font-medium px-2 py-0.5 rounded border border-gray-200/60 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 flex items-center gap-x-1"
              >
                <span
                  class="size-2 rounded-full shrink-0 opacity-60"
                  :style="{ backgroundColor: item.color }"
                ></span>
                {{ item.colorName }}
              </span>
              <span class="text-xs text-gray-400 dark:text-zinc-600 font-mono ml-auto">
                {{ item.time }} min
              </span>
            </div>

            <span
              class="font-bold text-gray-700 dark:text-zinc-300 text-base truncate tracking-tight mt-1"
              :title="item.teamName"
            >
              {{ getShortName(item.teamName) }}
            </span>

            <div class="flex items-center gap-x-2 mt-0.5">
              <span
                v-if="item.laboratorio"
                class="inline-flex items-center gap-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700"
                title="Laboratório"
              >
                📍 {{ item.laboratorio }}
              </span>
              <span class="text-xs text-gray-400 dark:text-zinc-500">
                {{ t('admin.deliveredSuccess') }}
              </span>
            </div>
          </div>

          <!-- Seção Direita: Botão de Ação (Desfazer) -->
          <button
            @click="undoDelivery(item.uniqueId)"
            class="cursor-pointer shrink-0 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-500 dark:hover:text-amber-400 dark:hover:bg-amber-950/20 transition-all duration-200"
            :title="t('admin.undoDelivery')"
          >
            <RotateCcw class="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Balloon, Star, RefreshCw, Trash2, Search, Check, RotateCcw } from '@lucide/vue'
import { useLocale } from '@/composables/useLocale'
import { fetchCodeforcesData } from '@/utils/api'
import { parseCodeforcesData, getShortName, getCodeforcesName } from '@/utils/parser'
import sedeConfig from '@/config.json'

const { t } = useLocale()

// Estados
const loading = ref(true)
const lastUpdated = ref(null)
const searchQuery = ref('')
const activeTab = ref('pendentes')
const filterLab = ref('Todos')
const allBalloons = ref([])
const deliveredIds = ref(new Set())

// Persistência local (localStorage)
const STORAGE_KEY = 'placar_delivered_balloons'

const loadDeliveredFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const arr = JSON.parse(stored)
        if (Array.isArray(arr)) {
          deliveredIds.value = new Set(arr)
        }
      }
    } catch (err) {
      console.error('Erro ao ler balões entregues do localStorage:', err)
    }
  }
}

const saveDeliveredToStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const arr = Array.from(deliveredIds.value)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    } catch (err) {
      console.error('Erro ao salvar balões entregues no localStorage:', err)
    }
  }
}

// Ações de Entrega
const markAsDelivered = (uniqueId) => {
  deliveredIds.value.add(uniqueId)
  saveDeliveredToStorage()
}

const undoDelivery = (uniqueId) => {
  deliveredIds.value.delete(uniqueId)
  saveDeliveredToStorage()
}

const clearDelivered = () => {
  if (confirm(t('admin.confirmReset'))) {
    deliveredIds.value.clear()
    saveDeliveredToStorage()
  }
}

// Carregar Dados da API do Codeforces
const loadData = async () => {
  loading.value = true
  try {
    const cfData = await fetchCodeforcesData()
    if (cfData) {
      const parsed = parseCodeforcesData(cfData)

      const list = []
      if (parsed && parsed.teams) {
        parsed.teams.forEach((team) => {
          // Lidar apenas com os balões das pessoas alocadas à sede local
          if (team.isLocal && team.scores) {
            Object.keys(team.scores).forEach((pId) => {
              const score = team.scores[pId]
              if (score && score.solved) {
                // Obter metadados do problema para extrair nome e cor
                const problemObj = parsed.problems.find((p) => p.id === pId)
                const color = problemObj ? problemObj.color : '#cbd5e1'
                const colorName = problemObj ? problemObj.colorName : ''
                const problemName = problemObj ? problemObj.name : ''

                list.push({
                  uniqueId: `${team.id}-${pId}`,
                  teamName: team.name,
                  institution: team.institution || '',
                  laboratorio: team.laboratorio || '',
                  problemId: pId,
                  problemName,
                  color,
                  colorName,
                  time: score.time || 0,
                  tries: score.tries || 1,
                  isFirst: !!score.first,
                })
              }
            })
          }
        })
      }

      // Ordenar cronologicamente pelo tempo da submissão (mais antigos primeiro)
      list.sort((a, b) => a.time - b.time)
      allBalloons.value = list

      // Formatar hora de atualização
      const now = new Date()
      lastUpdated.value = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
  } catch (err) {
    console.error('Erro ao carregar dados no painel admin:', err)
  } finally {
    loading.value = false
  }
}

// Listas Computadas
const availableLabs = computed(() => {
  // Começar com todos os laboratórios definidos no config
  const cfgLabs = (sedeConfig && sedeConfig.sedeLocal && sedeConfig.sedeLocal.laboratorios) || []
  const names = cfgLabs.map((l) => l.nome)

  // Garantir inclusão dos laboratórios detectados dinamicamente
  const detected = new Set()
  allBalloons.value.forEach((b) => {
    if (b.laboratorio) detected.add(b.laboratorio)
  })

  const merged = Array.from(new Set([...names, ...Array.from(detected)]))
  // Colocar "Todos" na frente e ordenar o restante
  const rest = merged.filter((n) => n !== 'Todos').sort((a, b) => a.localeCompare(b))
  return ['Todos', ...rest]
})

const filteredBalloons = computed(() => {
  let list = allBalloons.value

  if (filterLab.value !== 'Todos') {
    list = list.filter((b) => b.laboratorio === filterLab.value)
  }

  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return list

  return list.filter((b) => {
    const matchName = b.teamName.toLowerCase().includes(q)
    const matchInst = b.institution.toLowerCase().includes(q)
    const matchProbId = b.problemId.toLowerCase().includes(q)
    const matchProbName = b.problemName.toLowerCase().includes(q)
    const matchLab = b.laboratorio.toLowerCase().includes(q)
    return matchName || matchInst || matchProbId || matchProbName || matchLab
  })
})

const pendingBalloons = computed(() => {
  return filteredBalloons.value.filter((b) => !deliveredIds.value.has(b.uniqueId))
})

const deliveredBalloons = computed(() => {
  return filteredBalloons.value.filter((b) => deliveredIds.value.has(b.uniqueId))
})

// Inicialização
onMounted(() => {
  loadDeliveredFromStorage()
  loadData()
})
</script>
