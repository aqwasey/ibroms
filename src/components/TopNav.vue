<template>
    <header class="w-full h-16 px-6 bg-white border-b flex items-center justify-between">
      <div class="text-lg font-semibold text-gray-800">
        <slot name="title">Products</slot>
      </div>
  
      <div class="relative" @click="toggleDropdown">
        <div class="flex items-center space-x-3 cursor-pointer">
          <span class="text-sm font-medium text-gray-700">Kwesi Amoah</span>
          <img
            src="#"
            alt="avatar"
            class="w-8 h-8 rounded-full border border-gray-300 object-cover"
          />
        </div>
  
        <!-- Dropdown -->
        <transition name="fade">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <div class="border-t my-1"></div>
            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
          </div>
        </transition>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showDropdown = ref(false)
  
  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }
  
  document.addEventListener('click', (e) => {
    if (!(e.target.closest && e.target.closest('header'))) {
      showDropdown.value = false
    }
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
  