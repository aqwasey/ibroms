<template>
  <div class="p-4">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="bankAccountsStore.adding"
      :title="'BankAccount'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <Modal
      :show="isOpen"
      :loading="bankAccountsStore.adding"
      :title="`${editing ? 'Edit' : 'Add'} BankAccount`"
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
          name="name"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
          label="Sector"
          name="sector"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Sector" show-search allow-clear
                    v-model:value="formState.sector">
            <a-select-option value="Funeral">Funeral</a-select-option>
            <a-select-option value="Sector 1">Sector 1</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Province"
          name="province"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select Province" allow-clear v-model:value="formState.province">
            <a-select-option value="Province 1">Province 1</a-select-option>
            <a-select-option value="Province 2">Province 2</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Town/City"
          name="town_city"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.town_city" />
        </a-form-item>
        <div class="flex justify-end gap-3">
          <button @click="isOpen = false" class="btn-light">
            Cancel
          </button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>

    </Modal>

    <div v-if="bankAccountsStore.loading" class="text-black text-2xl">
      Loading bankAccounts...
    </div>
    <div v-else>
      <div v-if="!bankAccountsStore.bankAccounts.length" class="text-gray-500 text-center py-4">
        No bankAccounts found
      </div>
      <div v-else>
        <div class="flex justify-between items-center py-4">
          <h2 class="text-[30px] font-medium text-i-gray-900">BankAccounts</h2>
          <div class="flex gap-4 items-center">
            <InputField
              type="text"
              class="text-center rounded bg-gray-50 text-sm"
            />
            <Button @click="openModal">New BankAccount</Button>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-x-5">
            <Icon name="share" size="24" color="#2A2A2A" />
            <Icon name="export" size="24" color="#2A2A2A" />
          </div>
        </div>
        <TableComponent
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
import { useBankAccountsStore } from '@/stores/bank-accounts.js'
import Icon from '@/components/icon.vue'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm


const isOpen = ref(false)
const showConfirm = ref(false)
const editing = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)

let formState = reactive({
  name: '',
  sector: '',
  town_city: '',
  province: ''
})

const messageApi = inject('messageApi')

const bankAccountsStore = useBankAccountsStore()

onMounted(() => {
  bankAccountsStore.fetchBankAccounts()
})

const columns = [
  { key: 'name', label: 'TITLE' },
  { key: 'sector', label: 'SECTOR' },
  { key: 'province', label: 'PROVINCE' },
  { key: 'town_city', label: 'TOWN/CITY' },
  { key: 'created_on', label: 'CREATED ON' },
  { key: 'updated_on', label: 'UPDATED ON' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => bankAccountsStore.bankAccounts.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return bankAccountsStore.bankAccounts.slice(start, end)
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
    await bankAccountsStore.deleteBankAccount(itemId)
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
      await bankAccountsStore.updateBankAccount(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })

      selectedItemId.value = null
    } else {
      await bankAccountsStore.createBankAccount({
        ...values,
        id: '',
        description: '',
        website: ''
      })
    }

    resetFields()
    messageApi.success(`BankAccount ${editing ? 'updated' : 'created'} successfully!`)

    closeModal()
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>

