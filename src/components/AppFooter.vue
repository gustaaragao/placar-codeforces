<template>
  <footer
    class="w-full mt-auto py-2 px-4 bg-white dark:bg-[#181818] border-t border-gray-200 dark:border-zinc-800 rounded-b-xl transition-colors duration-300 shrink-0"
  >
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Créditos de Desenvolvimento -->
      <div class="text-sm text-gray-600 dark:text-zinc-400 flex items-center gap-x-1.5 focus:">
        <span>{{ t('footer.credit') }}</span>
        <a
          href="https://www.instagram.com/lawd.ufs/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-m-primary-600 dark:text-m-primary-400 tracking-wide hover:underline underline-offset-4"
          >LAWD</a
        >
        <span>{{ t('footer.partner') }}</span>
        <a
          href="https://www.instagram.com/greedy.ufs/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-m-primary-600 dark:text-m-primary-400 tracking-wide hover:underline underline-offset-4"
          >Greedy</a
        >
        <!-- Links Sociais / Referências -->
      </div>
      <div>
        <a
          href="https://github.com/gustaaragao/placar-codeforces"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-all duration-200 font-medium"
          title="Acessar repositório do projeto"
        >
          <!-- Ícone GitHub SVG nativo -->
          <svg class="size-4.5 fill-current" viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <span>{{ t('footer.repo') }}</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLocale } from '@/composables/useLocale'
const { t } = useLocale()
</script>
