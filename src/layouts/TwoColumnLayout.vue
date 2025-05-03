<template>
    <div class="flex h-screen">
      <div class="w-1/2 flex items-center justify-center bg-gray-50">
        <slot name="left" />
      </div>
      <div class="w-1/2 bg-orange-50 flex items-center justify-center p-8">
        <slot name="right" />
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  