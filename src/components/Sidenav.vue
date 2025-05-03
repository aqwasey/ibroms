<template>
    <aside class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <span class="p-6 text-2xl font-bold text-gray-800">AGENT APP</span>
  
      <nav class="flex-1 px-4 text-sm space-y-3">
        <template v-for="(item, index) in menuItems" :key="index">
          <!-- Single menu item -->
          <div
            v-if="!item.children"
            class="flex items-center gap-2 font-medium text-gray-600 px-3 py-2 rounded hover:bg-[#CF7F081A] hover:text-[#CF7F08] transition"
          >
            <component :is="item.icon" />
            <RouterLink :to="item.to" class="w-full">
              {{ item.label }}
            </RouterLink>
          </div>
  
          <!-- Grouped item with children -->
          <div
            v-else
            @mouseover="item.hovered.value = true"
            @mouseleave="item.hovered.value = false"
          >
            <!-- Parent button -->
            <button
              @click="item.open.value = !item.open.value"
              class="w-full flex justify-between items-center px-3 py-2 font-medium rounded transition"
              :class="{
                'text-[#CF7F08] bg-[#CF7F081A]': item.hovered.value,
                'text-gray-600': !item.hovered.value
              }"
            >
              <span class="flex items-center gap-2">
                <component :is="item.icon" />
                <span>{{ item.label }}</span>
              </span>
              <span>
                <component :is="item.open.value ? ChevronDown : ChevronUp" />
              </span>
            </button>
  
            <!-- Children (submenu) -->
            <div
              v-if="item.open.value"
              class="ml-5 pl-4 py-2 px-3 flex flex-col gap-2"
            >
              <RouterLink
                v-for="(sub, i) in item.children"
                :key="i"
                :to="sub.to"
                class="block px-2 py-1 text-gray-600 hover:text-[#CF7F08] hover:bg-[#CF7F081A] rounded transition"
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
      hovered: ref(false),
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
      hovered: ref(false),
    },
  ]
  </script>
  