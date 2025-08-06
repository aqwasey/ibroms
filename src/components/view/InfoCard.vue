<template>
  <div class="info-card">
    <div class="card-header" v-if="title || icon">
      <h3 class="card-title">
        <svg v-if="icon" class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon"></path>
        </svg>
        {{ title }}
      </h3>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Info Cards */
.info-card {
  background: #FCFCFD;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #F0F0F0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  padding: 1.25rem 1.5rem;
  background-color: #F7F8FA;
  border-bottom: 1px solid #E0E0E0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #334054;
  margin: 0;
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #CF7F08;
}

.card-content {
  padding: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  animation: fadeInUp 0.5s ease-out;
}
</style>
