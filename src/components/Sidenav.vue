<template>
  <aside class="h-screen !bg-[#FCFCFD] border-r border-gray-200 flex flex-col">
    <div class="flex items-center justify-between pl-8 pr-10 pt-5 pb-8">
      <span class="text-[22px] !font-bold text-gray-800">Pito iBROMS</span>
      <div class="border rounded-lg px-2 py-1 border-[#F0F0F0]">
        <Icon name="chevron-left" color="#2A2A2A" />
      </div>
    </div>

    <nav class="flex-1 px-4 text-base space-y-3">
      <template v-for="(item, index) in menuItems" :key="index">
        <!-- Single menu item -->
        <div
          v-if="!item.children"
          class="flex items-center gap-2 font-medium text-gray-600 px-3 py-2 rounded-lg hover:bg-[#CF7F081A] hover:text-primary transition cursor-pointer">
          <component :is="item.icon" />
          <RouterLink :to="item.to" class="w-full">
            {{ item.label }}
          </RouterLink>
        </div>

        <!-- Grouped item with children -->
        <div v-else
          @mouseover="item.hovered.value = true"
          @mouseleave="item.hovered.value = false">
          <!-- Parent button -->
          <button
            @click="item.open.value = !item.open.value"
            class="flex justify-between items-center px-3 py-2 font-medium rounded-lg transition !cursor-pointer !h-10 w-full !mb-2"
            :class="{
                'text-primary bg-background-secondary': item.hovered.value || item.open.value,
                'text-black': !item.hovered.value
              }">
              <span class="flex items-center gap-2">
                <component :is="item.icon" />
                <span class="!font-medium">{{ item.label }}</span>
              </span>
            <component :is="item.open.value ? ChevronDown : ChevronUp" />
          </button>

          <!-- Children (submenu) -->
          <div
            v-if="item.open.value"
            class="ml-5 py-2 flex flex-col gap-2"
          >
            <RouterLink
              v-for="(sub, i) in item.children"
              :key="i"
              :to="sub.to"
              class="w-full px-10 py-2 text-black !font-medium hover:text-primary hover:bg-[#CF7F081A] rounded-lg transition cursor-pointer"
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
import { Users, Layers, ChevronDown, ChevronUp } from 'lucide-vue-next'
import Icon from '@/components/icon.vue'

const menuItems = [
  {
    label: 'Business',
    icon: Users,
    children: [
      { label: 'Profile', to: '/profile' },
      { label: 'Accounts', to: '/accounts' },
      { label: 'Personnel', to: '/personnel' },
      { label: 'User Accounts', to: '/user-accounts' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Admin',
    icon: Layers,
    children: [
      { label: 'Underwriters', to: '/underwriters' },
      { label: 'Packages', to: '/packages' },
      { label: 'Product', to: '/products' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Services',
    icon: Layers,
    children: [
      { label: 'CRM', to: '/crm' },
      { label: 'Policy', to: '/policy' },
      { label: 'Premium', to: '/premium' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Tools',
    icon: Layers,
    children: [
      { label: 'Import', to: '/import' },
      { label: 'Export', to: '/export' }
    ],
    open: ref(false),
    hovered: ref(false)
  }
]
</script>
