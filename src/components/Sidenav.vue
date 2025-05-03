<template>
  <aside class="w-64 h-screen bg-white border-r flex flex-col">
    <div class="p-6 text-xl font-bold text-gray-800">AGENT APP</div>

    <nav class="flex-1 px-4 space-y-2 text-sm">
      <template v-for="(item, index) in menuItems" :key="index">
  
        <div
          v-if="!item.children"
          class="flex gap-2 font-medium items-center hover:text-[#CF7F08] hover:bg-[#CF7F081A] space-x-2 text-gray-600 px-4 py-2 rounded mb-4"
        >
          <component :is="item.icon" />
          <RouterLink :to="item.to">
            {{ item.label }}
          </RouterLink>
        </div>

        <div class="text-secondary" v-else>
          <button
            @click="item.open.value = !item.open.value"
            class="flex justify-between items-center w-full p4 text-secondary cursor-pointer rounded hover:[#CF7F081A]"
          >
            <span class="flex gap-2  items-center space-x-2 px-4 py-2">
              <component :is="item.icon" />
              <span>{{ item.label }}</span>
            </span>
            <span v-if="item.open.value"><ChevronDown /></span>
            <span v-else><ChevronUp /></span>
          </button>
          <div v-if="item.open.value" class="flex flex-col gap-2 pl-8 space-y-1">
            <RouterLink
              v-for="(sub, i) in item.children"
              :key="i"
              :to="sub.to"
              class="block hover:text-[#CF7F08] hover:bg-[#CF7F081A] px-4 py-2"
            >
              {{ sub.label }}
            </RouterLink>
          </div>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { UsersRound, Layers, ChevronDown, ChevronUp } from 'lucide-vue-next'

const menuItems = [
  {
    label: 'People',
    icon: UsersRound,
    to: '/people',
  },
  {
    label: 'Product',
    icon: Layers,
    children: [
      { label: 'Product', to: '/product' },
      { label: 'Category', to: '/category' },
    ],
    open: ref(true),
  },
  {
    label: 'Underwriters',
    icon: Layers,
    children: [
      { label: 'Underwriters', to: '/underwriters' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Age Groups', to: '/age-groups' },
    ],
    open: ref(false),
  },
]
</script>
