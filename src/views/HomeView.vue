<script setup>
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')
</script>

<template>
  <div class="bg-background text-text min-h-screen p-8">
    <form @submit.prevent="() => alert('Form submitted!')">
      <Button type="submit" variant="primary" size="md" class="mt-4"> Sign In </Button>
    </form>
  </div>
</template>
