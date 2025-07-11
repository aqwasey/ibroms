<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="Personnel View"
    variant="view"
    :showActions="false"
  >
    <div class="flex flex-col gap-4">
      <div class="input-dropdown">
        <div class="input-dropdown-base">
          <div class="input-with-label">
            <div class="label">Other Name(s)</div>
            <div class="input">
              <div class="div">
                <div class="text-wrapper">{{ person.otherNames }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Surname</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ person.surname }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Gender</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ person.gender }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">Date of Birth</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ person.dateOfBirth }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label">ID Type</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ person.idType }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-with-label-wrapper">
        <div class="input-with-label">
          <div class="label-2">ID Number</div>
          <div class="input">
            <div class="div">
              <div class="text-wrapper">{{ person.idNumber }}</div>
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
  person: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:show'])
</script>

<style scoped>
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

.label, .label-2 {
  color: #222222;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
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