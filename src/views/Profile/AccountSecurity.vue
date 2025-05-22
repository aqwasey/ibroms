<template>
  <div>
    <div>
      <h2 class="text-i-black-soft font-semibold text-xl pb-5">Account Security</h2>
      <hr>
      <a-form
        class="account-form"
        autocomplete="off"
        size="large"
        :hide-required-mark="true"
        layout="vertical">
        <div class="grid grid-cols-2 gap-x-5 items-center  h-full">
          <a-form-item
            label="Email"
            name="email"
            :rules="[{ type: 'email', message: 'Not a valid mail' }, { required: true, message: 'Required' }]">
            <a-input v-model:value="formState.email" />
          </a-form-item>
          <div class="w-full flex justify-end items-center">
            <a-button class="btn btn-gray">Change Email</a-button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-5">
          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Required' }]">
            <a-input placeholder="*******************" v-model:value="formState.password" />
          </a-form-item>
          <div class="w-full flex justify-end items-center">
            <a-button class="btn btn-gray">Change Password</a-button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-5">
          <a-form-item
            label="Phone Number"
            name="phone_number"
            :rules="[{ required: true, message: 'Required' }]">
            <a-input placeholder="(088) 555-0035" v-model:value="formState.name" />
          </a-form-item>
          <div class="w-full flex justify-end items-center">
            <a-button class="btn btn-gray">Change Number</a-button>
          </div>
        </div>
        <a-form-item
          label="Address"
          name="address"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <div class="grid grid-cols-2 gap-x-5">
          <div>
            <p class="text-base font-medium">2-Step Verification</p>
            <p class="text-gray-500 text-sm">Add an additional layer of security to your account during login.</p>
          </div>
          <div class="w-full flex justify-end items-center">
            <a-switch/>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'
import Icon from '@/components/icon.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'
import { Search, Plus } from 'lucide-vue-next'

const useForm = Form.useForm

let formState = reactive({
  name: '',
  password: '',
  email: '',
})

const messageApi = inject('messageApi')

const underwritersStore = useUnderwritersStore()

onMounted(() => {
  underwritersStore.fetchUnderwriters()
})

const { resetFields } = useForm(formState)

</script>

