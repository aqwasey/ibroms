<template>
  <component
    :is="icon"
    v-if="icon"
    :class="customClass"
    :style="customStyle"
  />
</template>

<script setup>
import { ref, watchEffect, defineProps } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 20,
  },
  color: {
    type: String,
    default: 'inherit',
  },
});

const icon = ref(null);

const customStyle = {
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
};

const customClass = 'inline-block';

watchEffect(async () => {
  try {
    icon.value = (await import(`@/assets/icons/${props.name}.svg?component`)).default;
  } catch (err) {
    console.warn(`Icon "${props.name}" not found in /assets/icons`);
    icon.value = null;
  }
});
</script>
