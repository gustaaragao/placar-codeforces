<template>
  <div
    class="relative inline-flex items-center w-65 p-1 rounded-full border border-[#D1D1D6] bg-[#E8E8ED] dark:border-[#2C2C2E] dark:bg-[#1C1C1E]"
  >
    <div
      class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#A65AE4] transition-transform duration-300 ease-in-out"
      :class="props.modelValue === props.options[1].value ? 'translate-x-full' : 'translate-x-0'"
    ></div>

    <button
      v-for="option in props.options"
      :key="option.value"
      type="button"
      class="cursor-pointer relative z-10 flex-1 rounded-full py-1.5 px-4 text-sm font-medium transition-colors duration-300 focus:outline-none"
      :class="
        props.modelValue === option.value ? 'text-white' : 'text-[#4A4A4A] dark:text-[#98989D]'
      "
      @click="emit('update:model-value', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [
      { label: 'Geral', value: 'geral' },
      { label: 'Sede Local', value: 'sede' },
    ],
  },
})

const emit = defineEmits(['update:model-value'])
</script>
