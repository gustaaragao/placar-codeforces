<template>
  <div class="h-full w-full font-sans flex flex-col">
    <div
      class="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-zinc-800/80 overflow-auto shadow-xl flex-1 relative transition-colors duration-300"
    >
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
        <tbody class="text-sm">
          <tr
            v-for="(team, index) in teams"
            :key="team.id"
            class="border-b border-gray-100 dark:border-zinc-800/40 hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors duration-300"
          >
            <!-- begin: Posição -->
            <td
              class="py-4 px-4 text-center font-bold text-gray-700 dark:text-zinc-300"
              :class="team.rankColor"
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
                />
              </div>
            </td>
            <!-- end: Problemas -->

            <!-- begin: Pontuação Total-->
            <td class="py-4 px-6 text-center">
              <div class="flex flex-col items-center">
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const teams = computed(() => {
  if (props.filtro === 'sede') {
    return allTeams.value.filter((team) => team.isLocal)
  }
  return allTeams.value
})

onMounted(async () => {
  const cfData = await fetchCodeforcesData()
  if (cfData) {
    const parsed = parseCodeforcesData(cfData)
    problems.value = parsed.problems
    allTeams.value = parsed.teams
  }
})
</script>
