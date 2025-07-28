<template>
  <!-- Simple RouterView - let the router handle layouts via nested routes -->
  <RouterView />
  
  <!-- Global notification container for alerts -->
  <NotificationContainer />
</template>

<script setup>
import { RouterView } from 'vue-router'
import NotificationContainer from '@/components/NotificationContainer.vue'
</script>
