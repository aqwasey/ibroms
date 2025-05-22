<template>
  <div class="flex h-screen max-w-screen-2xl !mx-auto">
    <Sidenav class="w-[312px] bg-gray-800 text-white" />
    <div class="flex-1 flex flex-col border bg-white">
      <TopNav class="h-16 bg-white shadow px-4" />

      <div class="flex-1 overflow-y-auto p-4">
        <MessageProvider>
          <RouterView />
        </MessageProvider>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Sidenav from '@/components/Sidenav.vue'
import TopNav from './components/TopNav.vue'
import MessageProvider from '@/providers/message-provider.vue'
</script>


