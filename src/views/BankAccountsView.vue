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
      :title="`${editing ? 'Edit' : 'Add'} Bank Account`"
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
        
        <!-- Bank Name Field -->
        <a-form-item
          label="Bank name"
          name="bank_name"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input 
            v-model:value="formState.bank_name"
            placeholder="Enter bank name" 
            :style="{ borderColor: colors.BORDER }"
            class="rounded-md" />
        </a-form-item>
        
        <!-- Account Number Field -->
        <a-form-item
          label="Account No"
          name="account_no"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input 
            v-model:value="formState.account_no" 
            placeholder="Enter account number"
            :style="{ borderColor: colors.BORDER }"
            class="rounded-md" />
        </a-form-item>

        <!-- Account Type Field -->
        <a-form-item
          label="Account Type"
          name="account_type"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select 
            placeholder="Select account type" 
            show-search 
            allow-clear
            v-model:value="formState.account_type"
            :style="{ borderColor: colors.BORDER }"
            class="rounded-md">
            <a-select-option value="Savings">Savings</a-select-option>
            <a-select-option value="Checking">Checking</a-select-option>
            <a-select-option value="Business">Business</a-select-option>
            <a-select-option value="Trust">Trust</a-select-option>
            <a-select-option value="Credit">Credit</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Email Field -->
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Required' }, { type: 'email', message: 'Not a valid email address'}]">
          <a-input 
            v-model:value="formState.email" 
            placeholder="Enter email address"
            :style="{ borderColor: colors.BORDER }"
            class="rounded-md" />
        </a-form-item>
        
        <!-- Purpose Field -->
        <a-form-item
          label="Purpose"
          name="purpose"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select 
            placeholder="Select purpose" 
            allow-clear 
            v-model:value="formState.purpose"
            :style="{ borderColor: colors.BORDER }"
            class="rounded-md">
            <a-select-option value="General Operations">General Operations</a-select-option>
            <a-select-option value="Payroll">Payroll</a-select-option>
            <a-select-option value="Expenses">Expenses</a-select-option>
            <a-select-option value="Investments">Investments</a-select-option>
            <a-select-option value="Emergency Fund">Emergency Fund</a-select-option>
            <a-select-option value="Claims Payment">Claims Payment</a-select-option>
          </a-select>
        </a-form-item>
        
        <!-- Form Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <ButtonBase 
            @click="isOpen = false" 
            variant="secondary" 
            label="Cancel" 
            class="min-w-[100px]" />
          <ButtonBase 
            type="submit" 
            variant="primary" 
            label="Save Changes" 
            :disabled="bankAccountsStore.adding"
            class="min-w-[150px]" />
        </div>
      </a-form>

    </Modal>

    <div>
      <PageHeader
        title="Bank Accounts"
        searchPlaceholder="Search bank account"
        buttonText="New Bank Account"
        @search="handleSearch"
        @buttonClick="openModal"
      />

      <div v-if="bankAccountsStore.loading" class="text-gray-500 text-center py-4">
        Loading bankAccounts...
      </div>
      <div v-else>
        <div v-if="!bankAccountsStore?.bankAccounts?.length" class="text-gray-500 text-center py-4">
          No bankAccount found
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
          :selectable="true"
          @selection-change="handleSelectionChange"
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
import PageHeader from '@/components/PageHeader.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { COLORS } from '@/constants/colors'

const colors = COLORS
const useForm = Form.useForm
const isOpen = ref(false)
const showConfirm = ref(false)
const editing = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)

let formState = reactive({
  bank_name: '',
  account_no: '',
  account_type: '',
  email: '',
  purpose: '',
  reference: '',
  assigned: ''
})

const messageApi = inject('messageApi')

const bankAccountsStore = useBankAccountsStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_BANK_ACCOUNTS = [
  {
    id: '1',
    bank_name: 'National Bank',
    account_no: '123456789',
    account_type: 'Savings',
    email: 'accounts@national.com',
    purpose: 'General Operations'
  },
  {
    id: '2',
    bank_name: 'Commerce Bank',
    account_no: '987654321',
    account_type: 'Checking',
    email: 'finance@commerce-bank.com',
    purpose: 'Payroll'
  },
  {
    id: '3',
    bank_name: 'First Trust',
    account_no: '567891234',
    account_type: 'Business',
    email: 'business@firsttrust.com',
    purpose: 'Investments'
  },
  {
    id: '4',
    bank_name: 'Global Finance',
    account_no: '456123789',
    account_type: 'Savings',
    email: 'global@financebank.com',
    purpose: 'Emergency Fund'
  },
  {
    id: '5',
    bank_name: 'City Credit Union',
    account_no: '789123456',
    account_type: 'Credit',
    email: 'credit@citycu.com',
    purpose: 'Expenses'
  },
  {
    id: '6',
    bank_name: 'Bank of Insurance',
    account_no: '654987321',
    account_type: 'Trust',
    email: 'trust@bankofinsurance.com',
    purpose: 'Claims Payment'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  bankAccountsStore.bankAccounts = DUMMY_BANK_ACCOUNTS;
  bankAccountsStore.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    bankAccountsStore.fetchBankAccounts()
  }
})

const columns = [
  { key: 'bank_name', label: 'bank name' },
  { key: 'account_no', label: 'account no' },
  { key: 'account_type', label: 'account type' },
  { key: 'email', label: 'email' },
  { key: 'purpose', label: 'purpose' }
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

const handleSearch = (query) => {

  console.log('Searching for:', query)
}

const handleSelectionChange = (selectedIds) => {
  console.log('Selected items:', selectedIds)
  // Do something with the selected IDs
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
        "reference": "string",
        company_id: 'b45cffe0-84dd-3d20-d928-bee85e7b0f21',
      })
    }

    resetFields()
    messageApi.success(`BankAccount ${editing ? 'updated' : 'created'} successfully!`)

    closeModal()
  } catch (error) {
    console.log(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>
