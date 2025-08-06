<template>
  <div class="website-info" v-if="url">
    <a
      :href="formatWebsiteUrl(url)"
      target="_blank"
      rel="noopener noreferrer"
      class="website-link"
    >
      {{ displayUrl }}
      <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
      </svg>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  displayText: {
    type: String,
    default: ''
  }
})

const displayUrl = computed(() => {
  return props.displayText || props.url
})

// Format website URL to ensure it has a protocol
const formatWebsiteUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}
</script>

<style scoped>
/* Website Info */
.website-info {
  display: flex;
  align-items: center;
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #CF7F08;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #CF7F081A;
  background-color: #FBF3E7;
  transition: all 0.2s ease;
}

.website-link:hover {
  color: #A66500;
  background-color: #FBF3E7;
  border-color: #CF7F08;
  transform: translateY(-1px);
}

.external-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
