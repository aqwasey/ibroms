<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View Account"
    variant="view"
  >  
    <div class="form" v-if="account">
      <div class="input-dropdown">
        <div class="input-dropdown-base">
          <div class="input-with-label">
            <div class="label">Bank Name</div>
            <div class="input">
              <div class="div">
                <div class="text-wrapper">{{ account.bank_name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Account No</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ account.account_no }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Account Type</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ account.account_type }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Email</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ account.email }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Purpose</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ account.purpose }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue'

const props = defineProps({
  account: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'update:show'])
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
  height: 70px; 
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
  flex: 0 0 auto; 
  flex-direction: column; 
  gap: 6px; 
  position: relative; 
  width: 100%; 
} 

.label { 
  color: #222222; 
  font-size: 14px;
  font-weight: 500;
  margin-top: -1px; 
  position: relative; 
  white-space: nowrap; 
  width: fit-content; 
} 

.input { 
  align-items: center; 
  align-self: stretch; 
  background-color: #ffffff; 
  border: 1px solid; 
  border-color: #f0f0f0; 
  border-radius: 8px; 
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); 
  display: flex; 
  flex: 0 0 auto; 
  gap: 8px; 
  padding: 10px 14px; 
  position: relative; 
  width: 100%; 
} 

.div { 
  align-items: center; 
  display: flex; 
  flex: 1; 
  flex-grow: 1; 
  gap: 8px; 
  position: relative; 
} 

.text-wrapper { 
  color: #222222; 
  font-size: 16px;
  font-weight: 400;
  margin-top: -1px; 
  position: relative; 
  white-space: nowrap; 
  width: fit-content; 
} 

.input-with-label-wrapper { 
  align-items: flex-start; 
  display: flex; 
  flex: 0 0 auto; 
  flex-direction: column; 
  gap: 6px; 
  position: relative; 
  width: 100%; 
}
</style>
