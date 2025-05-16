<template>
  <div v-if="show"
       class="fixed inset-0 z-50 flex items-center justify-center bg-[#0000006b] p-5">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <div class="flex items-center justify-between">
        <h2 v-if="title" class="text-lg text-i-black-soft font-semibold mb-4">{{ title }}</h2>
        <button @click="close"
                class="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">
          &times;
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  close: Function,
  title: {
    type: String,
    default: '',
  },
})
</script>
