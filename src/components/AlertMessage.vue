<template>
  <transition name="fade">
    <div v-if="visible" :class="['alert-container', type]" role="alert">
      <div class="alert-icon" v-if="showIcon">
        <!-- Success Icon -->
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#12B76A" />
          <path d="M5.6001 8.4L7.2001 10L10.4001 6.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        
        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#F04438" />
          <path d="M10 6L6 10M6 6L10 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        
        <!-- Warning Icon -->
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#F79009" />
          <path d="M8 5V8M8 11H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        
        <!-- Info Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#3F83F8" />
          <path d="M8 5V11M8 8H11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="alert-content">
        <div v-if="title" class="alert-title">{{ title }}</div>
        <div class="alert-message">{{ message }}</div>
      </div>
      <button v-if="dismissable" class="alert-dismiss" @click="dismiss" aria-label="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  dismissable: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['dismiss']);
const visible = ref(true);
let timer = null;

const dismiss = () => {
  visible.value = false;
  emit('dismiss');
  if (timer) clearTimeout(timer);
};

// Auto close timer
onMounted(() => {
  if (props.autoClose) {
    timer = setTimeout(() => {
      dismiss();
    }, props.duration);
  }
});

// Clear timer on component destroy
watch(() => props.message, () => {
  visible.value = true;
  if (timer) clearTimeout(timer);
  
  if (props.autoClose) {
    timer = setTimeout(() => {
      dismiss();
    }, props.duration);
  }
});
</script>

<style scoped>
.alert-container {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  gap: 12px;
  width: 100%;
  font-family: inherit;
}

.alert-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-content {
  flex-grow: 1;
}

.alert-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 2px;
}

.alert-message {
  font-size: 14px;
  line-height: 20px;
  color: inherit;
}

.alert-dismiss {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
}

.alert-dismiss:hover {
  opacity: 1;
}

/* Alert types */
.success {
  background-color: #ECFDF3;
  border: 1px solid #ABEFC6;
  color: #027A48;
}

.error {
  background-color: #FEF3F2;
  border: 1px solid #FEE4E2;
  color: #B42318;
}

.warning {
  background-color: #FFFAEB;
  border: 1px solid #FEF0C7;
  color: #B54708;
}

.info {
  background-color: #EFF8FF;
  border: 1px solid #D1E9FF;
  color: #175CD3;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
