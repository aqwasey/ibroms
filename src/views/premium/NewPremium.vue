<template>
  <Modal :show="show" :close="() => $emit('update:show', false)" title="Add Premium" @save="handleSave">
    <div class="w-full flex flex-col gap-4">
      <InputField v-model="form.policyNo" label="Policy NO" placeholder="Enter policy number" class="w-full" />
      <SelectField v-model="form.paymentOption" label="Payment Option" placeholder="Select payment option" :options="paymentOptions" class="w-full" />
      <InputField v-model="form.reason" label="Reason" placeholder="Enter reason" class="w-full" />
      <InputField v-model="form.amount" label="Amount" placeholder="Enter amount" class="w-full" />
    </div>
  </Modal>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import { usePremiumStore } from '@/stores/premium'
import { message } from 'ant-design-vue'
const store = usePremiumStore()
const props = defineProps({ show: { type: Boolean, default: false } })
const emits = defineEmits(['update:show', 'premium-created'])
const form = ref({ policyNo: '', paymentOption: '', reason: '', amount: '' })
const paymentOptions = [ { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }, { value: 'Yearly', label: 'Yearly' } ]
const handleSave = async () => {
  try {
    await store.createPremium(form.value)
    message.success('Premium added successfully')
    resetForm()
    emits('premium-created')
    emits('update:show', false)
  } catch (error) {
    message.error('Failed to add premium')
    console.error(error)
  }
}
const resetForm = () => { form.value = { policyNo: '', paymentOption: '', reason: '', amount: '' } }
</script>