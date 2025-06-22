<template>
  <!-- Entry Modal -->
  <a-modal v-model:open="showEntryForm" title="New Underwriter" :footer="null" :destroyOnClose="true">
    <EntryForm @close="showEntryForm = false" />
  </a-modal>

  <!-- Edit Modal -->
  <a-modal v-model:open="showEditForm" title="Edit Underwriter" :footer="null" :destroyOnClose="true" @cancel="showEditForm = false">
    <EditForm :modelValue="selectedUnderwriter" @close="showEditForm = false" />
  </a-modal>

  <!-- View Modal -->
  <a-modal v-model:open="showViewForm" title="View Underwriter" :footer="null" :destroyOnClose="true">
    <ViewForm :model="selectedUnderwriter" @close="showViewForm = false" />
  </a-modal>

  <!-- Main UI -->
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-center">
      <a-input v-model:value="searchTerm" placeholder="Enter a search term..." style="width: 30%" />
      <a-button type="primary" @click="showEntryForm = true" value="Add Underwriter">
          <Plus class="w-4 h-4" />
          <span>Add Underwriter</span>
      </a-button>
    </div>

    <!-- <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error loading data</div> -->

    <a-table
      :columns="columns"
      :data-source="filteredUnderwriters"
      row-key="id"
      :loading="loading"
      size="small"
      class="custom-table py-5"
    >
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import { useUnderwritersStore } from '@/stores/underwriters'
import EntryForm from '@/views/underwriters/EntryForm.vue'
import EditForm from '@/views/underwriters/EditForm.vue'
import ViewForm from '@/views/underwriters/ViewForm.vue'
import { message, Modal, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { SquarePen, Plus, X, Ban, View, Menu as Ml } from 'lucide-vue-next'
import { useTimeAgo } from '@vueuse/core'

const store = useUnderwritersStore()
const searchTerm = ref('')
const showEntryForm = ref(false)
const showEditForm = ref(false)
const showViewForm = ref(false)
const selectedUnderwriter = ref(null)

onMounted(() => {
  store.fetchAllUnderwriters()
})

const underwriters = computed(() => store.underwriters)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const filteredUnderwriters = computed(() =>
  underwriters.value.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)

watch([showEntryForm, showEditForm], async ([entryVal, editVal]) => {
  if (!entryVal && !editVal) {
    await store.fetchAllUnderwriters()
  }
})

const openEditForm = underwriter => {
  selectedUnderwriter.value = underwriter
  showEditForm.value = true
}

const openViewForm = underwriter => {
  selectedUnderwriter.value = underwriter
  showViewForm.value = true
}

const confirmDelete = id => {
  Modal.confirm({
    title: 'Confirm Deletion',
    content: 'Are you sure you want to delete this underwriter?',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await store.deleteUnderwriter(id)
      await store.fetchAllUnderwriters()
      message.success('Underwriter profile deleted successfully')
    },
  })
}

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Sector', dataIndex: 'sector' },
  { title: 'Province', dataIndex: 'province' },
  { title: 'Town/City', dataIndex: 'town_city' },
  {
    title: 'Created On',
    dataIndex: 'created_on',
    customRender: ({ record }) => {
      const text = record?.created_on
      return text ? useTimeAgo(new Date(text)).value : '--'
    }
  },
  {
    title: 'Updated On',
    dataIndex: 'updated_on',
    customRender: ({ record }) => {
      const text = record?.updated_on
      return text ? useTimeAgo(new Date(text)).value : '--'
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }) => {
      return h(Dropdown, { trigger: ['click'] }, {
        overlay: () =>
          h(Menu, null, {
            default: () => [
              h(MenuItem, { key: 'view', icon: h(View), onClick: () => openViewForm(record) }, () => ' View '),
              h(MenuItem, { key: 'edit', icon: h(SquarePen), onClick: () => openEditForm(record) }, () => ' Edit '),
              h(MenuItem, { key: 'disable', icon: h(Ban), onClick: () => openEditForm(record) }, () => ' Disable '),
              h(MenuItem, { key: 'delete', icon: h(X), danger: true, onClick: () => confirmDelete(record.id) }, () => ' Delete '),
            ]
          }),
        default: () => h('a-button', { type: 'text' }, { default: () => [h(Ml)] })
      })
    }
  }
]
</script>

<style scoped>
.text-red-500 {
  color: red;
}

.custom-table .ant-table-thead > tr > th,
.custom-table .ant-table-tbody > tr > td {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
}

.ant-btn-text .anticon {
  margin-right: 0;
  padding: 0 4px;
}
</style>
