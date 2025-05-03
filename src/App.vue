<template>
  <div class="flex h-screen">
    <Sidenav class="w-64 bg-gray-800 text-white" />

    <div class="flex-1 flex flex-col">
      <TopNav class="h-16 bg-white shadow px-4" />

      <div class="flex-1 overflow-y-auto p-4 bg-[#FCFCFD]">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidenav from '@/components/Sidenav.vue';
import TopNav from './components/TopNav.vue';

</script>


