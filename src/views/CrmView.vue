<template>
  <div class="p-4">
    <ConfirmDelete
      :item-id="selectedItemId"
      :loading="personnelStore.adding"
      :title="'Person'"
      :text="'Are you sure you want to delete? It will be deleted permanently'"
      @delete-item="handleDelete"
      v-model:show="showConfirm" />

    <Modal
      :show="isOpen"
      :loading="personnelStore.adding"
      :title="`${editing ? 'Edit' : 'Add'} Person`"
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
          label="other name(s)"
          name="othername"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.othername" />
        </a-form-item>

        <a-form-item
          label="surname"
          name="surname"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.surname" />
        </a-form-item>

        <a-form-item
          label="gender"
          name="gender"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select gender" show-search allow-clear
                    v-model:value="formState.gender">
            <a-select-option value="Male">Male</a-select-option>
            <a-select-option value="Female">Female</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Date of birth"
          name="birthdate"
          :rules="[{ required: true, message: 'Required' }]">
          <a-date-picker class="w-full" v-model:value="formState.birthdate" />
        </a-form-item>
        <a-form-item
          label="ID type"
          name="id_type"
          :rules="[{ required: true, message: 'Required' }]">
          <a-select placeholder="Select id type" allow-clear v-model:value="formState.id_type">
            <a-select-option value="Passport">Passport</a-select-option>
            <a-select-option value="Voter">Voter</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="ID Number"
          name="idno"
          :rules="[{ required: true, message: 'Required' }]">
          <a-input v-model:value="formState.idno" />
        </a-form-item>
        <div class="flex justify-end gap-3 pt-5">
          <button @click="isOpen = false" class="btn-light">
            Cancel
          </button>
          <a-button type="primary" class="btn-primary" html-type="submit">Save</a-button>
        </div>
      </a-form>

    </Modal>

    <div>
      <div class="flex justify-between items-center py-4">
        <h2 class="!text-[32px] !font-semibold text-[#222222]">CRM</h2>
        <div class="flex gap-4 items-center">
          <a-input size="large" class="!h-11 !w-[292px]" placeholder="Search Person">
            <template #prefix>
              <component class="text-gray-500" :is="Search" />
            </template>
          </a-input>
          <a-button class="btn-primary" @click="openModal">
            <component class="w-[16px]" :is="Plus" />
            New Person
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
      <div v-if="personnelStore.loading" class="text-gray-500 text-center py-4">
        Loading underwriters...
      </div>
      <div v-else>
        <div v-if="!personnelStore.person.length" class="text-gray-500 text-center py-4">
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
import Icon from '@/components/icon.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import { Form } from 'ant-design-vue'
import { Search, Plus } from 'lucide-vue-next'
import { usePersonnelStore } from '@/stores/personnels.js'
import dayjs from 'dayjs'

const useForm = Form.useForm


const isOpen = ref(false)
const showConfirm = ref(false)
const editing = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)

let formState = reactive({
  othername: '',
  surname: '',
  gender: '',
  id_type: '',
  idno: '',
  birthdate: '',
})

const messageApi = inject('messageApi')

const personnelStore = usePersonnelStore()

onMounted(() => {
  personnelStore.fetchPersonnel()
})

const columns = [
  { key: 'othername', label: 'othername' },
  { key: 'surname', label: 'surname' },
  { key: 'gender', label: 'gender' },
  { key: 'id_type', label: 'id type' },
  { key: 'idno', label: 'idno' },
  { key: 'birthdate', label: 'birthdate' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => personnelStore.person.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return personnelStore.person.slice(start, end)
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
    await personnelStore.deletePerson(itemId)
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
      await personnelStore.updatePerson(selectedItem.value.id, {
        ...selectedItem.value,
        ...values
      })

      selectedItemId.value = null
    } else {
      await personnelStore.createPerson({
        ...values,
        birthdate: dayjs(values.birthdate).format('YYYY-MM-DD')
      })
    }

    resetFields()
    messageApi.success(`Person ${editing ? 'updated' : 'created'} successfully!`)

    closeModal()
  } catch (error) {
    console.log(error)
    messageApi.error(error?.response?.data?.info ?? 'Something went wrong')
  }
}
</script>

