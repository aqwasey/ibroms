<template>
  <div class="space-y-4">
    <div class="space-y-3 mb-5">
      <div class="font-medium text-gray-500">Name</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.name || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Sector</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.sector || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Province</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.province || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Town/City</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.town_city || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Description</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.description || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Logo</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.logo || 'No Logo' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Website</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ model?.website || 'No website' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Created On</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ useTimeAgo(model?.created_on) || '-' }}</div>
    </div>

    <div class="space-y-3">
      <div class="font-medium text-gray-500 pt-2">Updated On</div>
      <div class="text-gray-800 bg-orange-50 border-gray-200 rounded-lg p-2 text-sm">{{ useTimeAgo(model?.updated_on) || '-' }}</div>
    </div>

    <div class="flex justify-end pt-4">
      <a-button @click="$emit('close')">Close</a-button>
    </div>
  </div>
</template>

<script setup>
import {useTimeAgo} from '@vueuse/core'
defineProps({ model: Object })
</script>
