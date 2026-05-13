<template>
  <div class="min-h-screen bg-[#111111] text-white p-4 md:p-8 font-sans">
    <div class="bg-[#181818] rounded-xl border border-zinc-800/80 overflow-x-auto shadow-xl">
      <table class="w-full text-left border-collapse min-w-200">
        <thead>
          <!-- begin: Cabeçalho da Tabela -->
          <tr
            class="bg-[#202020] border-b border-zinc-800/80 text-[11px] md:text-xs uppercase tracking-widest text-zinc-400"
          >
            <th class="py-4 px-4 font-semibold w-16 text-center">#</th>
            <th class="py-4 px-6 font-semibold">Time / Nome</th>
            <th
              v-for="problem in problems"
              :key="problem.id"
              class="py-4 px-4 font-bold text-center"
              :style="{ color: problem.color }"
            >
              {{ problem.id }}
            </th>
            <th class="py-4 px-6 font-semibold text-center">Total</th>
          </tr>
          <!-- end: Cabeçalho da Tabela -->
        </thead>
        <tbody class="text-sm">
          <tr
            v-for="(team, index) in teams"
            :key="team.id"
            class="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors"
          >
            <!-- begin: Posição -->
            <td class="py-4 px-4 text-center font-bold" :class="team.rankColor || 'text-zinc-300'">
              {{ index + 1 }}
            </td>
            <!-- end: Posição -->

            <!-- begin: Nome do time/participante -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <div class="flex flex-col">
                  <span class="font-bold text-zinc-100 tracking-wide">{{ team.name }}</span>
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
                <span class="font-bold text-zinc-100 text-base">{{ team.totalSolved }}</span>
                <span class="text-xs text-zinc-400 font-mono mt-0.5"
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
import BalaoIcone from '../BalaoIcone.vue'

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
