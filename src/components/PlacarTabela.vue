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
                <div
                  class="w-8 h-8 rounded border border-gray-200 dark:border-zinc-700 flex items-center justify-center bg-gray-50 dark:bg-zinc-800/50 text-gray-400 dark:text-zinc-500 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" x2="4" y1="22" y2="15" />
                  </svg>
                </div>
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
import BalaoIcone from '@/components/BalaoIcone.vue'

const problems = [
  { id: 'A', color: '#d8b4fe' }, // purple-300
  { id: 'B', color: '#f472b6' }, // pink-400
  { id: 'C', color: '#c084fc' }, // purple-400
  { id: 'D', color: '#4ade80' }, // green-400
  { id: 'E', color: '#fbbf24' }, // amber-400
]

const teams = [
  {
    id: 1,
    name: 'ByteRiders',
    institution: 'University of Tech',
    rankColor: 'text-fuchsia-300',
    scores: {
      A: { solved: true, tries: 1, time: 12, first: true },
      B: { solved: true, tries: 2, time: 34 },
      C: { solved: true, tries: 1, time: 56 },
      D: { solved: false, tries: -2 },
      E: { solved: true, tries: 1, time: 120 },
    },
    totalSolved: 4,
    totalPenalty: 222,
  },
  {
    id: 2,
    name: 'NullPointers',
    institution: 'State College',
    scores: {
      A: { solved: true, tries: 1, time: 15 },
      B: { solved: true, tries: 1, time: 40 },
      C: { solved: true, tries: 3, time: 88 },
      D: { solved: true, tries: 1, time: 140 },
    },
    totalSolved: 4,
    totalPenalty: 283,
  },
  {
    id: 3,
    name: 'O(N!)',
    institution: 'Polytechnic Inst.',
    scores: {
      A: { solved: true, tries: 2, time: 22 },
      B: { solved: true, tries: 1, time: 50 },
      C: { solved: false, tries: -4 },
      E: { solved: true, tries: 1, time: 130 },
    },
    totalSolved: 3,
    totalPenalty: 202,
  },
]
</script>
