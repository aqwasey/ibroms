<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Delete Age Group" variant="delete" :loading="store.saving" showActions @confirm="handleConfirm" confirmButtonText="Delete">
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ ageGroupName }}</span>
      <span class="span">? This action cannot be undone and will permanently remove the age group configuration.</span>
    </p>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useAgeGroupsStore } from '@/stores/ageGroups'
import notificationService from '@/services/notificationService'
import Modal from '@/components/Modal.vue'

const props = defineProps({ 
  show: { type: Boolean, default: false }, 
  itemId: { type: [String, Number], default: '' }, 
  ageGroupName: { type: String, default: 'this age group' } 
})

const emit = defineEmits(['update:show', 'age-group-deleted'])
const store = useAgeGroupsStore()

const handleConfirm = async () => {
  try {
    await store.deleteAgeGroup(props.itemId)
    notificationService.success('Age group deleted successfully')
    emit('age-group-deleted', props.itemId)
    emit('update:show', false)
  } catch (error) {
    console.error('Error deleting age group:', error)
    const errorMessage = error?.response?.data?.info || error?.message || 'Error deleting age group'
    notificationService.error(errorMessage)
  }
}
</script>

<style scoped>
.supporting-text { 
  align-self: stretch; 
  color: var(--gray-500); 
  font-family: "Inter-Regular", Helvetica; 
  font-size: 16px; 
  font-weight: 400; 
  letter-spacing: 0; 
  line-height: 24px; 
  position: relative; 
}

.span { 
  color: #667084; 
  font-family: "Inter-Regular", Helvetica; 
  font-size: 16px; 
  font-weight: 400; 
  letter-spacing: 0; 
  line-height: 24px; 
}

.text-wrapper-2 { 
  font-family: "Inter-Bold", Helvetica; 
  font-weight: 700; 
}
</style>
