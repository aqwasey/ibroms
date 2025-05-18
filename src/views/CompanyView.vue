<template>
  <div class="p-4">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="companyStore.adding"
      :title="'Company'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <Modal
      :show="isOpen"
      :loading="companyStore.adding"
      :title="`${editing ? 'Edit' : 'Add'} Company`"
      :close="() => {
        isOpen = false;
      }"
    >
      <a-form
        size="large"
        layout="vertical"
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish">
        <a-form-item
          label="Title"
          name="title"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.title" />
        </a-form-item>

        <a-form-item
          label="Target"
          name="target"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.target" />
        </a-form-item>
        <div class="grid grid-cols-3 gap-2">
          <a-form-item
            label="Price"
            name="price"
            :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="!w-full" v-model:value="formState.price" />
          </a-form-item>

          <a-form-item
            label="Waiting Period"
            name="waiting_period"
            :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="!w-full" v-model:value="formState.waiting_period" />
          </a-form-item>

          <a-form-item
            label="Cover Amount"
            name="cover_amount"
            :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="!w-full" v-model:value="formState.cover_amount" />
          </a-form-item>
        </div>

        <a-form-item
          label="Underwriter"
          name="underwriter_id"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select
            @focus="underwritersStore.fetchUnderwriters"
            placeholder="Select Underwriter"
            allow-clear
            v-model:value="formState.underwriter_id"
          >
            <a-select-option
              v-for="u in underwritersStore.underwriters"
              :key="u.id"
              :value="u.id"
            >
              {{ u.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Description"
          name="description"
          :rules="[{ required: true, message: 'Required' }]">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
        <div class="flex justify-end gap-3">
          <button @click="isOpen = false" class="btn-light">
            Cancel
          </button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>

    </Modal>


    <div>
      <div class="flex justify-between items-center py-4">
        <h2 class="text-[30px] font-medium text-i-gray-900">Company</h2>
        <div class="flex gap-4 items-center">
          <InputField
            type="text"
            class="text-center rounded bg-gray-50 text-sm"
          />
          <Button @click="openModal">New Company</Button>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-x-5">
          <Icon name="share" size="24" color="#2A2A2A" />
          <Icon name="export" size="24" color="#2A2A2A" />
        </div>
      </div>
      <div v-if="companyStore.loading" class="text-gray-500 text-center py-4">
        Loading company...
      </div>
      <div v-else>
        <div v-if="!companyStore.company.length" class="text-gray-500 text-center py-4">
          No company found
        </div>
        <TableComponent
          v-else
          :columns="columns"
          :data="data"
          :items-per-page="itemsPerPage"
          :total-items="totalItems"
          :current-page="currentPage"
          @page-changed="onPageChanged"
          @action="onAction"
          @edit-item="onEditItem"
          @delete-item="onDeleteItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import { useCompanyStore } from '@/stores/company.js'
import Icon from '@/components/icon.vue'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'

const useForm = Form.useForm


const isOpen = ref(false)
const showConfirm = ref(false)
const editing = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)

let formState = reactive({
  title: '',
  target: '',
  description: '',
  price: 0,
  waiting_period: 0,
  cover_amount: 0,
  underwriter_id: null
})

const messageApi = inject('messageApi')

const companyStore = useCompanyStore()

const underwritersStore = useUnderwritersStore()

onMounted(() => {
  companyStore.fetchCompany()
})

const columns = [
  { key: 'title', label: 'title' },
  { key: 'target', label: 'target' },
  { key: 'waiting_period', label: 'waiting period' },
  { key: 'price', label: 'price' },
  { key: 'cover_amount', label: 'cover amount' },
  { key: 'description', label: 'description' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => companyStore.company.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return companyStore.company.slice(start, end)
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
}

const onAction = ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)
}

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const onEditItem = (item) => {
  formState = { ...formState, ...item }
  selectedItem.value = item
  editing.value = true
  openModal()
}

const onDeleteItem = (item) => {
  selectedItemId.value = item.id
  showConfirm.value = true
}

const handleDelete = async (itemId) => {
  try {
    await companyStore.deleteCompany(itemId)
    selectedItemId.value = null
    showConfirm.value = false
    messageApi.success('Deleted successfully!')
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}

const { resetFields } = useForm(formState)

const onFinish = async values => {
  try {
    if (editing.value === true) {
      await companyStore.updateCompany(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })

      selectedItemId.value = null
    } else {
      await companyStore.createCompany({
        'id': '',
        ...values,
        active: false,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString()

      })
    }

    resetFields()
    messageApi.success(`Company ${editing ? 'updated' : 'created'} successfully!`)

    closeModal()
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>
