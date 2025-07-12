<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Premium"
  >
    <div class="text-gray-500 mb-6">
      Are you sure you want to delete <span class="font-bold">{{ premiumName }}</span>? It will be deleted permanently
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
import { usePremiumStore } from '@/stores/premium.js'

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
const premiumStore = usePremiumStore()
const loading = ref(false)
const premiumName = ref('')

watchEffect(async () => {
  console.log('ConfirmDeletePremium watchEffect triggered, show:', props.show, 'itemId:', props.itemId)
  if (props.show && props.itemId) {
    console.log('Fetching premium data for deletion confirmation...')
    await fetchPremiumData()
  }
})

const fetchPremiumData = async () => {
  if (!props.itemId) return

  loading.value = true
  try {
    const premium = await premiumStore.fetchPremiumById(props.itemId)
    premiumName.value = premium.policyNo
  } catch (error) {
    console.error('Error fetching premium data:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = () => {
  emit('confirm')
}
</script>
