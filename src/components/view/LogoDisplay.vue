<template>
  <div class="logo-container">
    <img
      :src="logoUrl"
      :alt="altText"
      class="logo-circular"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
defineProps({
  logoUrl: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    default: 'Logo'
  }
})

// Handle image loading errors
const handleImageError = (event) => {
  event.target.style.display = 'none';
}
</script>

<style scoped>
/* Logo Container */
.logo-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo-circular {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.logo-circular:hover {
  border-color: #CF7F08;
  box-shadow: 0 4px 12px rgba(207, 127, 8, 0.2);
  transform: scale(1.05);
}
</style>
