<template>
  <aside class="h-screen" :style="{ backgroundColor: colors.BACKGROUND, borderRight: `1px solid ${colors.BORDER}` }">
    <div class="flex items-center justify-between pl-8 pr-10 pt-5 pb-8">
      <span class="text-[22px] font-bold" :style="{ color: colors.TEXT_PRIMARY }">Pito iBROMS</span>
      <div class="rounded-lg px-2 py-1" :style="{ border: `1px solid ${colors.BORDER}` }">
        <Icon name="chevron-left" :color="colors.SECONDARY" />
      </div>
    </div>

    <nav class="flex-1 px-4 text-base space-y-3">
      <template v-for="(item, index) in menuItems" :key="index">
        <!-- Single menu item -->
        <div v-if="!item.children"
          class="flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition cursor-pointer"
          :style="{
            color: isActive(item.to) ? colors.PRIMARY : colors.TEXT_BODY,
            backgroundColor: isActive(item.to) ? colors.PRIMARY_BG : 'transparent'
          }"
          @mouseenter="hoveredItem = item"
          @mouseleave="hoveredItem = null"
          :class="{
            'hover-effect': hoveredItem === item && !isActive(item.to)
          }">
          <component :is="item.icon" :color="isActive(item.to) ? colors.PRIMARY : colors.TEXT_BODY" />
          <RouterLink :to="item.to" class="w-full" :style="{
            color: isActive(item.to) ? colors.PRIMARY : colors.TEXT_BODY
          }">
            {{ item.label }}
          </RouterLink>
        </div>

        <!-- Grouped item with children -->
        <div v-else @mouseover="item.hovered.value = true" @mouseleave="item.hovered.value = false">
          <!-- Parent button -->
          <button @click="item.open.value = !item.open.value"
            class="flex justify-between items-center px-3 py-2 font-medium rounded-lg transition cursor-pointer h-10 w-full mb-2"
            :style="{
              backgroundColor: item.hovered.value || item.open.value ? colors.PRIMARY_BG : 'transparent',
              color: item.hovered.value || item.open.value ? colors.PRIMARY : colors.TEXT_BODY
            }">
            <span class="flex items-center gap-2">
              <component :is="item.icon" :color="item.hovered.value || item.open.value ? colors.PRIMARY : colors.TEXT_BODY" />
              <span class="font-medium">{{ item.label }}</span>
            </span>
            <component 
              :is="item.open.value ? ChevronDown : ChevronUp" 
              :color="item.hovered.value || item.open.value ? colors.PRIMARY : colors.TEXT_BODY" 
            />
          </button>

          <!-- Children (submenu) -->
          <div v-if="item.open.value" class="ml-5 py-2 flex flex-col gap-2">
            <RouterLink v-for="(sub, i) in item.children" :key="i" :to="sub.to"
              class="w-full px-10 py-2 font-medium rounded-lg transition cursor-pointer"
              :style="{
                color: isActive(sub.to) ? colors.PRIMARY : colors.TEXT_BODY,
                backgroundColor: isActive(sub.to) ? colors.PRIMARY_BG : 'transparent'
              }"
              @mouseenter="hoveredSub = sub"
              @mouseleave="hoveredSub = null"
              @click="handleNavClick(sub)"
              :class="{
                'hover-effect': hoveredSub === sub && !isActive(sub.to)
              }">
              {{ sub.label }}
            </RouterLink>
          </div>
        </div>
      </template>
    </nav>
  </aside>
</template>


<script setup>
import { ref, shallowRef, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Users, Layers, Wrench, Settings, FileBox, FileSliders, ChevronDown, ChevronUp } from 'lucide-vue-next'
import Icon from '@/components/icon.vue'
import { COLORS } from '@/constants/colors'

const route = useRoute();
const colors = COLORS;

// For hover effects
const hoveredItem = ref(null);
const hoveredSub = ref(null);

// Check if route is active
const isActive = (path) => {
  if (!path) return false;
  return route.path === path || route.path.startsWith(`${path}/`);
};

// Debug navigation clicks
const handleNavClick = (item) => {
  console.log('Navigation clicked:', item);
  console.log('Navigating to:', item.to);
};

// Auto-open the section that contains the current active route
const setInitialOpenState = (items) => {
  items.forEach(item => {
    if (item.children) {
      const hasActiveChild = item.children.some(child => isActive(child.to));
      if (hasActiveChild) {
        item.open.value = true;
      }
    }
  });
};

const menuItems = [
  {
    label: 'Business',
    icon: Users,
    children: [
      { label: 'Profile', to: '/dashboard/profile' },
      { label: 'Accounts', to: '/dashboard/accounts' },
      { label: 'Personnel', to: '/dashboard/personnel' },
      { label: 'User Accounts', to: '/dashboard/user-accounts' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Admin',
    icon: FileBox,
    children: [
      { label: 'Underwriters', to: '/dashboard/underwriters' },
      { label: 'Packages', to: '/dashboard/packages' },
      { label: 'Age Groups', to: '/dashboard/age-groups' },
      { label: 'Group Schemes', to: '/dashboard/group-schemes' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Services',
    icon: Layers,
    children: [
      { label: 'CRM', to: '/dashboard/crm' },
      { label: 'Policy', to: '/dashboard/policy' },
      { label: 'Premium', to: '/dashboard/premium' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Tools',
    icon: Wrench,
    children: [
      { label: 'Import', to: '/dashboard/import' },
      { label: 'Export', to: '/dashboard/export' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Reports & BI',
    icon: FileSliders,
    children: [
      { label: 'Sales', to: '/dashboard/reports/sales' },
      { label: 'Claims', to: '/dashboard/reports/claims' },
      { label: 'Analytics', to: '/dashboard/reports/analytics' }
    ],
    open: ref(false),
    hovered: ref(false)
  },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Message Templates', to: '/dashboard/settings/templates' },
      { label: 'Notifications', to: '/dashboard/settings/notifications' },
      { label: 'Rules', to: '/dashboard/settings/rules' },
    ],
    open: ref(false),
    hovered: ref(false)
  }
]

// Call setInitialOpenState after menuItems is defined
setInitialOpenState(menuItems);
</script>

<style scoped>
.hover-effect:hover {
  background-color: v-bind('colors.PRIMARY_LIGHT');
  color: v-bind('colors.PRIMARY');
}
</style>
