<template>
  <div class="notification-container">
    <AlertMessage
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :message="notification.message"
      :title="notification.title"
      :dismissable="notification.dismissable"
      :auto-close="notification.autoClose"
      :duration="notification.duration"
      @dismiss="dismiss(notification.id)"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import AlertMessage from '@/components/AlertMessage.vue';
import notificationService from '@/services/notificationService';

// Get reactive notifications from the service
const notifications = computed(() => notificationService.getAll());

// Method to dismiss notification
const dismiss = (id) => {
  notificationService.remove(id);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 400px;
  max-width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
