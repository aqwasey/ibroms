<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Policy"
  >
    <div class="text-gray-500 mb-6">
      Are you sure you want to delete <span class="font-bold">{{ policyName }}</span>? It will be deleted permanently
    </div>
    <div class="flex justify-end gap-3">
      <ButtonBase
        text="Cancel"
        @click="$emit('update:show', false)"
        variant="secondary"
      />
      <ButtonBase
        text="Delete"
        @click="handleDelete"
        variant="primary"
        :loading="loading"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, watchEffect } from 'vue'
import Modal from '@/components/Modal.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { usePolicyStore } from '@/stores/policy.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  itemId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:show', 'confirm'])
const policyStore = usePolicyStore()
const loading = ref(false)
const policyName = ref('')

watchEffect(async () => {
  if (props.show && props.itemId) {
    await fetchPolicyData()
  }
})

const fetchPolicyData = async () => {
  if (!props.itemId) return
  
  loading.value = true
  try {
    const policy = await policyStore.fetchPolicyById(props.itemId)
    policyName.value = `${policy.surname} ${policy.otherNames}`
  } catch (error) {
    console.error('Error fetching policy data:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = () => {
  emit('confirm')
}
</script>
