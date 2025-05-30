<template>
  <div class="p-4">
    <!-- Confirm Delete Dialog -->
    <ConfirmDelete :item-id="selectedItemId" :loading="packagesStore.adding" title="Package"
      text="Are you sure you want to delete? It will be deleted permanently" v-model:show="showConfirm"
      @delete-item="handleDelete" />

    <!-- Modal Form -->
    <Modal :show="isOpen" :loading="packagesStore.adding" :title="`${editing ? 'Edit' : 'Add'} Package`"
      :close="() => { isOpen = false }">
      <a-form :form="form" size="large" layout="vertical" :model="formState" name="basic" autocomplete="off"
        @finish="onFinish">
        <a-form-item label="Title" name="title" :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.title" />
        </a-form-item>

        <a-form-item label="Target" name="target" :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.target" />
        </a-form-item>

        <div class="grid grid-cols-3 gap-4">
          <a-form-item label="Price" name="price" :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="w-full" v-model:value="formState.price" />
          </a-form-item>

          <a-form-item label="Waiting Period" name="waiting_period" :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="w-full" v-model:value="formState.waiting_period" />
          </a-form-item>

          <a-form-item label="Cover Amount" name="cover_amount" :rules="[{ required: true, message: 'Required' }]">
            <a-input-number class="w-full" v-model:value="formState.cover_amount" />
          </a-form-item>
        </div>

        <a-form-item label="Underwriter" name="underwriter_id" :rules="[{ required: true, message: 'Required' }]">
          <a-select v-model:value="formState.underwriter_id" @focus="underwritersStore.fetchUnderwriters"
            placeholder="Select Underwriter" allow-clear>
            <a-select-option v-for="u in underwritersStore.underwriters" :key="u.id" :value="u.id">
              {{ u.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Description" name="description" :rules="[{ required: true, message: 'Required' }]">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>

        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="btn-light">Cancel</button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>
    </Modal>

    <!-- Page Header -->
    <div class="flex justify-between items-center py-4">
      <h2 class="text-2xl font-semibold text-[#222222]">Packages</h2>
      <div class="flex items-center gap-4">
        <a-input size="large" class="h-11 w-[300px]" placeholder="Search Packages">
          <template #prefix>
            <component class="text-gray-500" :is="Search" />
          </template>
        </a-input>
        <a-button class="btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          @click="onAddItem">
          <component class="w-4 h-4" :is="Plus" />
          New Package
        </a-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-5">
      <!-- Filters -->
      <a-select class="w-48 h-10" dropdown-class-name="custom-select-dropdown" placeholder="PROVINCE" show-search>
        <a-select-option value="Province 1">Province 1</a-select-option>
        <a-select-option value="Province 2">Province 2</a-select-option>
      </a-select>

      <a-select class="w-48 h-10" dropdown-class-name="custom-select-dropdown" placeholder="SECTOR" show-search>
        <a-select-option value="Sector 1">Sector 1</a-select-option>
        <a-select-option value="Sector 2">Sector 2</a-select-option>
      </a-select>

      <a-select class="w-48 h-10" dropdown-class-name="custom-select-dropdown" placeholder="TOWN/CITY" show-search>
        <a-select-option value="City 1">City 1</a-select-option>
        <a-select-option value="City 2">City 2</a-select-option>
      </a-select>


      <!-- Share Button -->
      <button @click="onShare"
        class="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 active:scale-95 transition duration-150 rounded-lg shadow-sm">
        <Icon name="share" class="w-6 h-6 text-[#2A2A2A]" />
      </button>

      <!-- Export Button -->
      <button @click="onExport"
        class="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 active:scale-95 transition duration-150 rounded-lg shadow-sm">
        <Icon name="export" class="w-6 h-6 text-[#2A2A2A]" />
      </button>
    </div>

    <!-- Table Section -->
    <div v-if="packagesStore.loading" class="flex flex-col items-center justify-center py-16 text-gray-500">
      <a-spin size="large" />
      <p class="mt-4">Loading packages...</p>
    </div>

    <div v-else>
      <div v-if="!packagesStore.items.length" class="flex flex-col items-center justify-center py-16 text-gray-500">
        <component :is="PackageX" class="w-20 h-20 mb-4" />
        <p>No packages found</p>
      </div>

      <TableComponent v-else :columns="columns" :data="data" :items-per-page="itemsPerPage" :total-items="totalItems"
        :current-page="currentPage" @page-changed="onPageChanged" @action="onAction" @edit-item="onEditItem"
        @delete-item="onDeleteItem" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { Form, Spin } from 'ant-design-vue'
import { Plus, Search, PackageX } from 'lucide-vue-next'
import { usePackagesStore } from '@/stores/packages.js'
import { useUnderwritersStore } from '@/stores/underwriters.js'

import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import Icon from '@/components/icon.vue'

const useForm = Form.useForm

const formState = ref({
  title: '',
  target: '',
  description: '',
  price: 0,
  waiting_period: 0,
  cover_amount: 0,
  underwriter_id: null
})

const form = useForm(formState)
const isOpen = ref(false)
const showConfirm = ref(false)
const editing = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)

const messageApi = inject('messageApi')
const packagesStore = usePackagesStore()
const underwritersStore = useUnderwritersStore()

onMounted(async () => {
  await packagesStore.fetchPackages()
})

const columns = [
  { key: 'title', label: 'title' },
  { key: 'target', label: 'target' },
  { key: 'waiting_period', label: 'waiting period' },
  { key: 'price', label: 'price' },
  { key: 'cover_amount', label: 'cover amount' },
  { key: 'description', label: 'description' }
]

const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalItems = computed(() => packagesStore.packages.length)

const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return packagesStore.packages.slice(start, start + itemsPerPage.value)
})

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
  form.resetFields()
  isOpen.value = false
}

const onAddItem = () => {
  form.resetFields()
  selectedItem.value = null
  editing.value = false
  openModal()
}

const onEditItem = (item) => {
  formState.value = { ...formState.value, ...item }
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
    await packagesStore.deletePackage(itemId)
    selectedItemId.value = null
    showConfirm.value = false
    messageApi.success('Deleted successfully!')
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}

const onFinish = async values => {
  try {
    if (editing.value) {
      await packagesStore.updatePackage(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })
    } else {
      await packagesStore.createPackage({ ...values })
    }
    messageApi.success(`Package ${editing.value ? 'updated' : 'created'} successfully!`)
    closeModal()
  } catch (error) {
    console.log(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>
