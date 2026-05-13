<template>
  <div class="h-full w-full font-sans flex flex-col">
    <div
      class="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-zinc-800/80 overflow-auto shadow-xl flex-1 relative transition-colors duration-300"
    >
      <!-- Barra de Ferramentas: Última Atualização, Reload e Simulação -->
      <div
        class="px-4 py-2 bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/50 flex flex-wrap justify-between items-center gap-x-4 gap-y-2"
      >
        <!-- Status de Atualização -->
        <div class="flex items-center gap-x-2 text-xs text-gray-400 dark:text-zinc-500">
          <span
            class="size-1.5 rounded-full shrink-0"
            :class="isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'"
          ></span>
          <span v-if="lastUpdated">
            Última atualização:
            <time class="font-mono font-medium text-gray-600 dark:text-zinc-300">{{
              lastUpdated
            }}</time>
          </span>
          <span v-else class="italic">Carregando...</span>
        </div>

        <!-- Ações -->
        <div class="flex items-center gap-x-2">
          <!-- Botão Reload Manual -->
          <button
            @click="handleReload"
            :disabled="isLoading"
            class="cursor-pointer text-xs px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 transition-all font-medium flex items-center gap-x-1.5 shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Recarregar dados agora"
          >
            <svg
              class="size-3.5 shrink-0"
              :class="{ 'animate-spin': isLoading }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <span>{{ isLoading ? 'Atualizando…' : 'Recarregar' }}</span>
          </button>
        </div>
      </div>
      <table class="w-full text-left border-collapse min-w-200">
        <thead>
          <!-- begin: Cabeçalho da Tabela -->
          <tr
            class="bg-gray-100/50 dark:bg-[#202020] border-b border-gray-200 dark:border-zinc-800/80 text-[11px] md:text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400 transition-colors duration-300"
          >
            <th class="py-4 px-4 font-semibold w-16 text-center">#</th>
            <th class="py-4 px-6 font-semibold">Time / Nome</th>
            <th
              v-for="problem in problems"
              :key="problem.id"
              class="py-4 px-4 font-bold text-center"
            >
              {{ problem.id }}
            </th>
            <th class="py-4 px-6 font-semibold text-center text-gray-600 dark:text-zinc-400">
              Total
            </th>
          </tr>
          <!-- end: Cabeçalho da Tabela -->
        </thead>
        <TransitionGroup tag="tbody" name="row-fade" class="text-sm">
          <tr
            v-for="(team, index) in teams"
            :key="team.id"
            class="border-b border-gray-100 dark:border-zinc-800/40 hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors duration-300"
            :class="{ 'bg-m-primary-50/30 dark:bg-m-primary-950/20': animatedRanks.has(team.id) }"
          >
            <!-- begin: Posição -->
            <td
              class="py-4 px-4 text-center font-bold text-gray-700 dark:text-zinc-300 transition-all duration-500"
              :class="[
                team.rankColor,
                {
                  'scale-125 text-m-primary-600 dark:text-m-primary-400 drop-shadow-sm':
                    animatedRanks.has(team.id),
                },
              ]"
            >
              {{ index + 1 }}
            </td>
            <!-- end: Posição -->

            <!-- begin: Nome do time/participante -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900 dark:text-zinc-100 tracking-wide">{{
                    team.name
                  }}</span>
                  <span class="text-xs text-gray-500 dark:text-zinc-400" v-if="team.institution">{{
                    team.institution
                  }}</span>
                </div>
              </div>
            </td>
            <!-- end: Nome do time/participante -->

            <!-- begin: Problemas -->
            <td v-for="problem in problems" :key="problem.id" class="py-4 px-4 align-middle">
              <div class="flex justify-center">
                <BalaoIcone
                  v-if="team.scores[problem.id]"
                  :estado="team.scores[problem.id].solved ? 'resolvido' : 'tentado'"
                  :cor="problem.color"
                  :tentativas="team.scores[problem.id].tries"
                  :tempo="team.scores[problem.id].time"
                  :isFirst="team.scores[problem.id].first"
                  :animar="animatedBalloons.has(`${team.id}-${problem.id}`)"
                />
              </div>
            </td>
            <!-- end: Problemas -->

            <!-- begin: Pontuação Total-->
            <td class="py-4 px-6 text-center">
              <div
                class="flex flex-col items-center transition-all duration-500 rounded-lg p-1"
                :class="{
                  'bg-m-primary-50 dark:bg-m-primary-950/50 scale-110': animatedScores.has(team.id),
                }"
              >
                <span class="font-bold text-gray-900 dark:text-zinc-100 text-base">{{
                  team.totalSolved
                }}</span>
                <span class="text-xs text-gray-500 dark:text-zinc-400 font-mono mt-0.5"
                  >({{ team.totalPenalty }})</span
                >
              </div>
            </td>
            <!-- end: Pontuação Total-->
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BalaoIcone from '@/components/BalaoIcone.vue'
import { parseCodeforcesData } from '@/utils/parser'
import { fetchCodeforcesData } from '@/utils/api'

const props = defineProps({
  filtro: {
    type: String,
    default: 'geral',
  },
})

const problems = ref([])
const allTeams = ref([])

// Estado de carregamento e timestamp da última atualização
const isLoading = ref(false)
const lastUpdated = ref(null)

// Conjuntos reativos para gerenciar animações de destaque temporárias
const animatedBalloons = ref(new Set())
const animatedScores = ref(new Set())
const animatedRanks = ref(new Set())

const teams = computed(() => {
  if (props.filtro === 'sede') {
    return allTeams.value.filter((team) => team.isLocal)
  }
  return allTeams.value
})

let intervalId = null

const formatTimestamp = () => {
  const now = new Date()
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const loadData = async (isFirstLoad = false) => {
  isLoading.value = true
  const cfData = await fetchCodeforcesData()
  isLoading.value = false
  if (!cfData) return
  lastUpdated.value = formatTimestamp()

  const parsed = parseCodeforcesData(cfData)
  problems.value = parsed.problems

  if (isFirstLoad || allTeams.value.length === 0) {
    allTeams.value = parsed.teams
    return
  }

  // Coleções para registrar as detecções da rodada atual
  const newBalloons = new Set(animatedBalloons.value)
  const newScores = new Set(animatedScores.value)
  const newRanks = new Set(animatedRanks.value)
  let hasChanges = false

  // Mapear o estado anterior em O(1) contendo os dados e os índices originais
  const prevTeamMap = new Map(allTeams.value.map((t, idx) => [t.id, { team: t, index: idx }]))

  parsed.teams.forEach((newTeam, newIndex) => {
    const prevEntry = prevTeamMap.get(newTeam.id)
    if (prevEntry) {
      const prevTeam = prevEntry.team

      // 1. Verificar novos balões resolvidos
      if (newTeam.scores) {
        Object.keys(newTeam.scores).forEach((pId) => {
          const newScore = newTeam.scores[pId]
          const prevScore = prevTeam.scores[pId]
          // Se passou a ser resolvido nesta consulta
          if (newScore && newScore.solved && (!prevScore || !prevScore.solved)) {
            newBalloons.add(`${newTeam.id}-${pId}`)
            hasChanges = true
          }
        })
      }

      // 2. Verificar alteração de pontuação total
      if (newTeam.totalSolved !== prevTeam.totalSolved) {
        newScores.add(newTeam.id)
        hasChanges = true
      }

      // 3. Verificar alteração na posição (rank ou índice no array)
      if (prevEntry.index !== newIndex) {
        newRanks.add(newTeam.id)
        hasChanges = true
      }
    }
  })

  // Atualizar a lista reativa principal
  allTeams.value = parsed.teams

  // Se houveram mudanças, reidratar os sets e programar a limpeza do destaque visual
  if (hasChanges) {
    animatedBalloons.value = newBalloons
    animatedScores.value = newScores
    animatedRanks.value = newRanks

    setTimeout(() => {
      animatedBalloons.value = new Set()
      animatedScores.value = new Set()
      animatedRanks.value = new Set()
    }, 3500)
  }
}

// Reload manual: executa o loadData sem ser o primeiro carregamento
const handleReload = async () => {
  if (isLoading.value) return
  await loadData(false)
}

onMounted(async () => {
  await loadData(true)
  // Configurar polling automático a cada 60 segundos
  intervalId = setInterval(() => loadData(false), 60000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
/* Animação FLIP suave para o reordenamento das linhas na tabela */
.row-fade-move,
.row-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.row-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
</style>
