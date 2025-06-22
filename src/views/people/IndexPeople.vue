<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4 gap-4">
      <h2 class="text-xl font-semibold text-gray-700 whitespace-nowrap">
        Customer Relationship &nbsp;&nbsp;&nbsp;
        <span class="text-sm text-gray-500">People</span>
      </h2>

      <div class="flex-1 flex justify-left">
        <a-input v-model:value="searchTerm" placeholder="Enter a search term..." class="w-full max-w-md" />
      </div>

      <div class="flex items-center gap-6 pr-3">
        <a-button type="text">
          <Share2 class="w-4 h-4" />
        </a-button>
        <a-button type="text">
          <FileText class="w-4 h-4" />
        </a-button>
        <a-button type="primary" @click="showEntryForm = true">
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          Add Person
        </a-button>
      </div>
    </div>

    <a-table
      class="py-2"
      :columns="columns"
      size="small"
      :data-source="filteredPersons"
      :loading="loading"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-dropdown :trigger="['click']">
            <template #overlay>
              <a-menu>
                <a-menu-item key="view" @click="viewPerson(record)">
                  <View class="w-4 h-4 inline mr-1" /> View
                </a-menu-item>
                <a-menu-item key="edit" @click="editPerson(record)">
                  <SquarePen class="w-4 h-4 inline mr-1" /> Edit
                </a-menu-item>
                <a-menu-item key="delete" danger @click="confirmDelete(record.id)">
                  <X class="w-4 h-4 inline mr-1" /> Delete
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="text">
              <Ml class="w-4 h-4" />
            </a-button>
          </a-dropdown>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="showEntryForm" title="New Person" :footer="null" @cancel="showEntryForm = false">
      <EntryForm @close="showEntryForm = false" />
    </a-modal>

    <a-modal v-model:open="showEditForm" title="Edit Person" :footer="null" @cancel="showEditForm = false">
      <EditForm :modelValue="selectedPerson" @close="showEditForm = false" />
    </a-modal>

    <a-modal v-model:open="showViewForm" title="View Person" :footer="null" @cancel="showViewForm = false">
      <ViewForm :modelValue="selectedPerson" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EntryForm from './EntryPerson.vue'
import EditForm from './EditPerson.vue'
import ViewForm from './ViewPerson.vue'
import { usePersonStore } from '@/stores/people'
import { message, Modal } from 'ant-design-vue'
import { SquarePen, Share2, FileText, Plus, X, View, Menu as Ml } from 'lucide-vue-next'

// ... (rest of your script remains the same)
// No changes are needed in the script section for this fix.

const store = usePersonStore()
const searchTerm = ref('')
const showEntryForm = ref(false)
const showEditForm = ref(false)
const showViewForm = ref(false)
const selectedPerson = ref(null)

onMounted(() => {
  store.fetchCurrentPersons()
})

const people = computed(() => store.persons)
const loading = computed(() => store.loading)

const filteredPersons = computed(() =>
  people.value.filter(person =>
    `${person.othername} ${person.surname}`.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)

const columns = [
  { title: 'Othername', dataIndex: 'othername', key: 'othername' },
  { title: 'Surname', dataIndex: 'surname', key: 'surname' },
  { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  { title: 'ID Type', dataIndex: 'id_type', key: 'id_type' },
  { title: 'ID No.', dataIndex: 'idno', key: 'idno' },
  { title: 'Birthdate', dataIndex: 'birthdate', key: 'birthdate' },
  { title: 'Liveness', dataIndex: 'alive', key: 'alive' },
  { title: 'Actions', key: 'actions' },
]

const confirmDelete = id => {
  Modal.confirm({
    title: 'Confirm Deletion',
    content: 'Are you sure you want to delete this person?',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await store.deletePerson(id)
      await store.fetchCurrentPersons()
      message.success('Person profile deleted successfully.')
    },
  })
}

const viewPerson = person => {
  selectedPerson.value = person
  showViewForm.value = true
}

const editPerson = person => {
  selectedPerson.value = person
  showEditForm.value = true
}
</script>

<style scoped>
.text-red-500 {
  color: red;
}

.ant-btn svg.lucide {
  margin-right: 8px; /* Adjust this value (e.g., 4px, 6px, 10px) to get the desired spacing */
}

.custom-table .ant-table-thead > tr > th,
.custom-table .ant-table-tbody > tr > td {
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
}
</style>
