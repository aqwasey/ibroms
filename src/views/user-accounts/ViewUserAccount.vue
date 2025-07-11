<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="User Account View"
    variant="view"
    :showActions="false"
  >
    <div class="form">
      <div class="input-dropdown">
        <div class="input-dropdown-base">
          <div class="input-with-label">
            <div class="label">Full Name</div>
            <div class="input">
              <div class="div">
                <div class="text-wrapper">{{ user.fullName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-dropdown">
        <div class="input-dropdown-base">
          <div class="input-with-label">
            <div class="label">Email</div>
            <div class="input">
              <div class="div">
                <div class="text-wrapper">{{ user.email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Service Provider</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ user.serviceProvider }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-dropdown">
        <div class="input-dropdown-base">
          <div class="input-with-label">
            <div class="label">Access Level</div>
            <div class="input">
              <div class="div">
                <div class="text-wrapper">{{ user.accessLevel }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Permissions</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ user.permissions }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:show'])
</script>

<style scoped>
.form {
  align-items: flex-end;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  position: relative;
  width: 100%;
}

.input-dropdown {
  align-self: stretch;
  position: relative;
  width: 100%;
}

.input-dropdown-base {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  width: 100%;
}

.input-with-label {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  width: 100%;
}

.label {
  color: #222222;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.input {
  align-items: center;
  align-self: stretch;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  position: relative;
  width: 100%;
}

.div {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
  position: relative;
}

.text-wrapper {
  color: #222222;
  font-size: 0.9375rem;
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
}

.input-with-label-wrapper {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  width: 100%;
}
</style>
