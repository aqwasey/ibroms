<template>
  <header class="w-full h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-end">
    <div class="relative" @click="toggleDropdown">
      <div class="flex gap-4 items-center space-x-3 cursor-pointer">
        <div class="bg-[#FFB31F] h-10 w-10 rounded-full">
        </div>
        <div>
          <p class="!text-sm !font-medium !text-black">{{ currentUser?.email || 'User' }}</p>
          <p class="text-xs text-[#AFAFAF]">{{ currentUser?.email || 'user@example.com' }}</p>
        </div>
        <ChevronDown class="!text-[#929292]" size="24" />
      </div>

      <transition name="fade">
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
          <RouterLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </RouterLink>
          <RouterLink to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Settings
          </RouterLink>
          <div class="border-t my-1"></div>
          <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-gray-700 !text-[#929292]">
            Logout
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()
const showDropdown = ref(false)

// Get current user information
const currentUser = computed(() => authService.getCurrentUser())

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleClickOutside(event) {
  if (!(event.target.closest && event.target.closest('header'))) {
    showDropdown.value = false
  }
}

async function handleLogout() {
  try {
    // Clear authentication data
    authService.logout()

    // Close dropdown
    showDropdown.value = false

    // Redirect to login and replace history to prevent back button access
    await router.replace('/login')

    // Clear browser history to prevent back button navigation
    window.history.replaceState(null, '', '/login')

  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if there's an error
    window.location.href = '/login'
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
