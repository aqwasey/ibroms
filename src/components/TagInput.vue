<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="flex flex-wrap gap-2">
      <div 
        v-for="(tag, index) in modelValue" 
        :key="index"
        class="flex items-center bg-blue-100 px-2 py-1 rounded-md"
      >
        <span>{{ tag }}</span>
        <button 
          @click="removeTag(index)" 
          class="ml-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div class="flex items-center mt-2 w-full">
        <InputField
          v-model="newTag"
          :placeholder="placeholder"
          class="w-full"
          @keyup.enter.prevent="addTag"
        />
        <ButtonBase 
          variant="secondary" 
          @click="addTag" 
          class="ml-2"
        >
          Add
        </ButtonBase>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import InputField from '@/components/InputField.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { message } from 'ant-design-vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Add new tag'
  }
})

const emit = defineEmits(['update:modelValue'])

const newTag = ref('')

const addTag = () => {
  const tag = newTag.value.trim()
  if (!tag) return
  
  // Don't add duplicates
  if (props.modelValue.includes(tag)) {
    message.warning('Tag already exists')
    return
  }
  
  const updatedTags = [...props.modelValue, tag]
  emit('update:modelValue', updatedTags)
  newTag.value = ''
}

const removeTag = (index) => {
  const updatedTags = [...props.modelValue]
  updatedTags.splice(index, 1)
  emit('update:modelValue', updatedTags)
}
</script>
