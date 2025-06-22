<template>
  <button :type="type"
    class="bg-primary hover:bg-secondary cursor-pointer text-sm text-white font-medium h-11 px-4 rounded-lg whitespace-nowrap shadow-md"
    @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
});
</script>
