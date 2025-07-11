<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Confirmation"
    variant="delete"
    showActions
    @confirm="handleConfirm"
    confirmButtonText="Delete"
  >
    <div class="delete-confirm-content">
      <div class="icon-wrapper">
        <svg class="icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="#FEF3F2" />
          <path d="M16 10V18M16 22V22.01M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#D92D20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="message">
        <p>Are you sure you want to delete the user account <strong>"{{ user.fullName }}"</strong>?</p>
        <p>This action cannot be undone.</p>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, ref, inject } from 'vue'
import { useUserAccountStore } from '@/stores/userAccounts.js'
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

const emit = defineEmits(['update:show', 'user-deleted'])

const userAccountStore = useUserAccountStore()
const messageApi = inject('messageApi')
const loading = ref(false)

const handleConfirm = async () => {
  try {
    loading.value = true
    
    // Delete the user account
    await userAccountStore.deleteUser(props.user.id)
    
    messageApi.success('User account deleted successfully')
    emit('user-deleted', props.user.id)
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Error deleting user account')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.delete-confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 16px;
}

.icon-wrapper {
  margin-bottom: 16px;
}

.message {
  font-size: 14px;
  color: #344054;
}

.message p {
  margin: 6px 0;
  line-height: 1.5;
}

.message strong {
  color: #101828;
  font-weight: 600;
}
</style>
