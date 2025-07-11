<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Delete Personnel"
    variant="delete"
    :loading="loading"
    showActions
    @confirm="handleConfirm"
    confirmButtonText="Delete"
  >
    <p class="supporting-text">
      <span class="span">Are you sure you want to delete </span>
      <span class="text-wrapper-2">{{ person.surname }}</span>
      <span class="span">? It will be deleted permanently</span>
    </p>
  </Modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, inject } from 'vue'
import { usePersonnelStore } from '@/stores/personnels.js'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  person: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:show', 'person-deleted'])

const personnelStore = usePersonnelStore()
const messageApi = inject('messageApi')
const loading = ref(false)

const handleConfirm = async () => {
  try {
    loading.value = true
    await personnelStore.deletePerson(props.person.id)
    messageApi.success('Personnel deleted successfully!')
    emit('person-deleted', props.person.id)
    emit('update:show', false)
  } catch (error) {
    console.error(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  } finally {
    loading.value = false
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
