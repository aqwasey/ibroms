<template>
  <div class="p-4">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="underwritersStore.adding"
      :title="'Underwriter'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <Modal
      :show="isOpen"
      :loading="underwritersStore.adding"
      :title="`${editing ? 'Edit' : 'Add'} Underwriter`"
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

    <div>
      <div class="flex justify-between items-center py-4">
        <h2 class="!text-[32px] !font-semibold text-[#222222]">Underwriters</h2>
        <div class="flex gap-4 items-center">
          <a-input size="large" class="!h-11 !w-[292px]" placeholder="Search Underwriters">
            <template #prefix>
              <component class="text-gray-500" :is="Search" />
            </template>
          </a-input>
          <a-button class="btn-primary" @click="openModal">
            <component class="w-[16px]" :is="Plus" />
            New Underwriters
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
      <div v-if="underwritersStore.loading" class="text-gray-500 text-center py-4">
        Loading underwriters...
      </div>
      <div v-else>
        <div v-if="!underwritersStore.underwriters.length" class="text-gray-500 text-center py-4">
          No underwriter found
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
import { useUnderwritersStore } from '@/stores/underwriters.js'
import Icon from '@/components/icon.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'
import { Search, Plus } from 'lucide-vue-next'

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

const underwritersStore = useUnderwritersStore()

onMounted(() => {
  underwritersStore.fetchUnderwriters()
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
const totalItems = computed(() => underwritersStore.underwriters.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return underwritersStore.underwriters.slice(start, end)
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
    await underwritersStore.deleteUnderwriter(itemId)
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
      await underwritersStore.updateUnderwriter(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })

      selectedItemId.value = null
    } else {
      await underwritersStore.createUnderwriter({
        ...values,
        id: '',
        description: '',
        website: ''
      })
    }

    resetFields()
    messageApi.success(`Underwriter ${editing ? 'updated' : 'created'} successfully!`)

    closeModal()
  } catch (error) {
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>

