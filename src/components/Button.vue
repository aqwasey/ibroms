<template>
  <button
    :type="type"
    class="bg-primary hover:bg-secondary cursor-pointer text-white font-medium py-2 px-4 rounded-md w-full"
    @click="$emit('click')"
  >
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
