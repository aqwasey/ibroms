<template>
  <div class="p-4">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="packagesStore.adding"
      :title="'Package'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <Modal
      :show="isOpen"
      :loading="packagesStore.adding"
      :title="`${editing ? 'Edit' : 'Add'} Package`"
      :close="() => {
        isOpen = false;
      }"
    >
      <a-form
        :form="form"
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
          <button @click="closeModal" class="btn-light">
            Cancel
          </button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>

    </Modal>

    <div>
      <div class="flex justify-between items-center py-4">
        <h2 class="!text-[32px] !font-semibold text-[#222222]">Packages</h2>
        <div class="flex gap-4 items-center">
          <a-input size="large" class="!h-11 !w-[292px]" placeholder="Search Packages">
            <template #prefix>
              <component class="text-gray-500" :is="Search" />
            </template>
          </a-input>
          <a-button class="btn-primary" @click="openModal">
            <component class="w-[16px]" :is="Plus" />
            New Package
          </a-button>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-x-5 !mb-5">
          <a-select class="filter-select" placeholder="PROVINCE" show-search>
            <a-select-option value="Province 1">Province 1</a-select-option>
            <a-select-option value="Province 1">Province 1</a-select-option>
          </a-select>
          <a-select class="filter-select" placeholder="SECTOR" show-search>
            <a-select-option value="Province 1">Province 1</a-select-option>
            <a-select-option value="Province 1">Province 1</a-select-option>
          </a-select>
          <a-select class="filter-select" placeholder="TOWN/CITY" show-search>
            <a-select-option value="Province 1">Province 1</a-select-option>
            <a-select-option value="Province 1">Province 1</a-select-option>
          </a-select>
          <Icon name="share" size="24" color="#2A2A2A" />
          <Icon name="export" size="24" color="#2A2A2A" />
        </div>
      </div>
      <div v-if="packagesStore.loading" class="text-gray-500 text-center py-4">
        Loading packages...
      </div>
      <div v-else>
        <div v-if="!packagesStore.packages.length" class="text-gray-500 text-center py-4">
          No packages found
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
import { computed, inject, onMounted, ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Modal from '@/components/Modal.vue'
import { usePackagesStore } from '@/stores/packages.js'
import Icon from '@/components/icon.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'
import { useUnderwritersStore } from '@/stores/underwriters.js'
import { Plus, Search } from 'lucide-vue-next'

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

onMounted(() => {
  packagesStore.fetchPackages()
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
  const end = start + itemsPerPage.value
  return packagesStore.packages.slice(start, end)
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
  formState.value = {
    ...formState.value,
    ...item
  }
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
    if (editing.value === true) {
      await packagesStore.updatePackage(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })
      selectedItemId.value = null
    } else {
      await packagesStore.createPackage({
        ...values,
      })
    }
    messageApi.success(`Package ${editing.value ? 'updated' : 'created'} successfully!`)
    closeModal()
  } catch (error) {
    console.log(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>


