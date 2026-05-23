<template>
  <div class="h-full w-full font-sans flex flex-col overflow-hidden">
    <div
      class="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-zinc-800/80 shadow-xl flex-1 relative transition-colors duration-300"
    >
      <!-- Barra de Ferramentas: Última Atualização, Reload e Simulação -->
      <div
        class="px-3 sm:px-4 py-2 bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/50 flex flex-wrap justify-between items-center gap-x-4 gap-y-2"
      >
        <!-- Status de Atualização -->
        <div class="flex items-center gap-x-2 text-xs text-gray-400 dark:text-zinc-500">
          <span
            class="size-1.5 rounded-full shrink-0"
            :class="isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'"
          ></span>
          <span v-if="lastUpdated">
            {{ t('table.lastUpdate') }}:
            <time class="font-mono font-medium text-gray-600 dark:text-zinc-300">{{
              lastUpdated
            }}</time>
          </span>
          <span v-else class="italic">{{ t('table.loading') }}</span>
        </div>
      </div>
      <!-- Container com scroll horizontal para telas pequenas -->
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-225">
          <thead>
            <!-- Cabeçalho da Tabela -->
            <tr
              class="bg-gray-100/50 dark:bg-[#202020] border-b border-gray-200 dark:border-zinc-800/80 text-[11px] md:text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400 transition-colors duration-300"
            >
              <th class="py-4 px-4 font-semibold w-16 text-center">{{ t('table.rank') }}</th>
              <th class="py-4 px-6 font-semibold">{{ t('table.teamName') }}</th>
              <th
                v-for="problem in problems"
                :key="problem.id"
                class="py-4 px-4 font-bold text-center"
              >
                {{ problem.id }}
              </th>
              <th class="py-4 px-6 font-semibold text-center text-gray-600 dark:text-zinc-400">
                {{ t('table.total') }}
              </th>
            </tr>
          </thead>
          <TransitionGroup tag="tbody" name="row-fade" class="text-sm">
            <tr
              v-for="(team, index) in teams"
              :key="team.id"
              class="border-b border-gray-100 dark:border-zinc-800/40 hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors duration-300"
              :class="{ 'bg-m-primary-50/30 dark:bg-m-primary-950/20': animatedRanks.has(team.id) }"
            >
              <!-- Posição -->
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
              <!-- Nome do time/participante -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <div class="flex flex-col gap-y-1">
                    <span class="font-bold text-gray-900 dark:text-zinc-100 tracking-wide">
                      <template v-if="team.teamName">
                        {{ team.teamName }}
                        <template
                          v-if="team.isLocal && team.members && team.members.some((m) => m.name)"
                        >
                          <span class="font-normal text-gray-500 dark:text-zinc-400"> - </span>
                          <span
                            v-for="(member, idx) in team.members"
                            :key="member.handle"
                            class="font-normal"
                          >
                            <template v-if="member.name">{{ member.name }} (</template
                            ><a
                              :href="`https://codeforces.com/profile/${member.handle}`"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="hover:underline text-m-primary-600 dark:text-m-primary-400 hover:text-m-primary-700 dark:hover:text-m-primary-300 transition-colors"
                              >{{ member.handle }}</a
                            ><template v-if="member.name">)</template
                            ><template v-if="idx < team.members.length - 1">, </template>
                          </span>
                        </template>
                      </template>
                      <template v-else>
                        <span v-for="(member, idx) in team.members" :key="member.handle">
                          <template v-if="member.name">{{ member.name }} (</template
                          ><a
                            :href="`https://codeforces.com/profile/${member.handle}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:underline text-m-primary-600 dark:text-m-primary-400 hover:text-m-primary-700 dark:hover:text-m-primary-300 transition-colors"
                            >{{ member.handle }}</a
                          ><template v-if="member.name">)</template
                          ><template v-if="idx < team.members.length - 1">, </template>
                        </span>
                      </template>
                    </span>
                    <span
                      class="text-xs text-gray-500 dark:text-zinc-400"
                      v-if="team.institution || team.laboratorio"
                    >
                      <span v-if="team.institution">{{ team.institution }}</span>
                      <span v-if="team.institution && team.laboratorio" class="mx-1">•</span>
                      <span v-if="team.laboratorio" class="font-medium text-m-primary-600 dark:text-m-primary-400"
                        >[{{ team.laboratorio }}]</span
                      >
                    </span>
                    <!-- Medalhas por categoria (visíveis no filtro de Sede) -->
                    <div
                      v-if="filtro === 'sede' && medalsByTeam[team.id]?.length"
                      class="flex flex-wrap gap-1 mt-0.5"
                    >
                      <span
                        v-for="medal in medalsByTeam[team.id]"
                        :key="medal.categoria"
                        class="inline-flex items-center gap-x-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md border"
                        :class="medal.classes"
                        :title="`${medal.categoriaLabel}: ${medal.posicao}º lugar`"
                      >
                        <span>{{ medal.emoji }}</span>
                        <span>{{ medal.categoriaLabel }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <!-- Problemas -->
              <td v-for="problem in problems" :key="problem.id" class="py-4 px-4 align-middle">
                <div class="flex justify-center">
                  <BalaoIcone
                    v-if="team.scores[problem.id]"
                    :estado="team.scores[problem.id].solved ? 'resolvido' : 'tentado'"
                    :cor="problem.color"
                    :tentativas="team.scores[problem.id].tries"
                    :tempo="team.scores[problem.id].time"
                    :isFirst="filtro === 'sede' ? team.scores[problem.id].firstLocal : team.scores[problem.id].first"
                    :animar="animatedBalloons.has(`${team.id}-${problem.id}`)"
                  />
                </div>
              </td>
              <!-- Pontuação Total-->
              <td class="py-4 px-6 text-center">
                <div
                  class="flex flex-col items-center transition-all duration-500 rounded-lg p-1"
                  :class="{
                    'bg-m-primary-50 dark:bg-m-primary-950/50 scale-110': animatedScores.has(
                      team.id,
                    ),
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
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import config from '@/config.json'
import BalaoIcone from '@/components/BalaoIcone.vue'
import { parseCodeforcesData } from '@/utils/parser'
import { fetchCodeforcesData } from '@/utils/api'
import { useLocale } from '@/composables/useLocale'
import { useSede } from '@/composables/useSede'

const { t } = useLocale()
const { activeSede } = useSede()

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

// Emojis e estilos das medalhas por posição
const MEDAL_STYLES = [
  {
    emoji: '🥇',
    classes:
      'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-400',
  },
  {
    emoji: '🥈',
    classes:
      'bg-gray-100 border-gray-300 text-gray-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300',
  },
  {
    emoji: '🥉',
    classes:
      'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-800/60 dark:text-orange-400',
  },
]

// Computa as medalhas ganhas por cada time considerando GERAL, UFS e EM
const medalsByTeam = computed(() => {
  const localTeams = allTeams.value.filter((t) => t.isLocal)
  if (!localTeams.length) return {}

  const result = {}

  // Função auxiliar: dado um subconjunto de times, registra medalhas para os top-3
  const assignMedals = (subset, categoria, categoriaLabel) => {
    // Já estão ordenados pela API: mais resolvidos primeiro, depois menor penalidade
    subset.slice(0, 3).forEach((team, idx) => {
      if (!result[team.id]) result[team.id] = []
      const style = MEDAL_STYLES[idx]
      result[team.id].push({
        categoria,
        categoriaLabel,
        posicao: idx + 1,
        emoji: style.emoji,
        classes: style.classes,
      })
    })
  }

  // 1. GERAL: top-3 entre todos os times locais
  assignMedals(localTeams, 'GERAL', 'Geral')

  // 2. Por cada divisão configurada
  const divisoes = activeSede.value.divisoes || {}
  Object.entries(divisoes).forEach(([divKey, divInfo]) => {
    const divTeams = localTeams.filter((t) => t.divisao === divKey)
    if (divTeams.length) {
      assignMedals(divTeams, divKey, divInfo.label || divKey)
    }
  })

  return result
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

  const parsed = parseCodeforcesData(cfData, activeSede.value)
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

watch(activeSede, () => {
  loadData(true)
})

onMounted(async () => {
  await loadData(true)

  const interval = config.intervaloRequisicao

  intervalId = setInterval(() => loadData(false), interval)
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
