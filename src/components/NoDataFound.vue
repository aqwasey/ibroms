<template>
  <div class="no-data-container">
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.1 2 14 2.9 14 4V6H18C19.1 6 20 6.9 20 8V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H10V4C10 2.9 10.9 2 12 2ZM12 4V6H12V4ZM6 8V19H18V8H6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z" fill="#9CA3AF"/>
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No Data Found'
  },
  description: {
    type: String,
    default: 'There is no data to display at the moment.'
  }
})
</script>

<style scoped>
.no-data-container {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 16px 0;
  max-width: 400px;
  line-height: 1.5;
}
</style>
