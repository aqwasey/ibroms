<template>
  <div class="p-4">
    <a-button type="primary" @click="showCreate = true">Add Template</a-button>

    <a-table
      :columns="columns"
      :data-source="templates"
      rowKey="id"
      :loading="store.loading"
      class="mt-4"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" @click="view(record)">View</a-button>
            <a-button type="link" @click="edit(record)">Edit</a-button>
            <a-popconfirm title="Confirm delete?" @confirm="remove(record.id)">
              <a-button danger type="link">Delete</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <EntryTemplate
      v-if="showCreate"
      v-model:visible="showCreate"
      @close="onCloseCreate"
    />

    <EditTemplate
      v-if="selected && showEdit"
      v-model:visible="showEdit"
      :template="selected"
      @close="onCloseEdit"
    />

    <ViewTemplate
      v-if="selected && showView"
      v-model:visible="showView"
      :template="selected"
      @close="onCloseView"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTemplateStore } from '@/stores/templates'
import EntryTemplate from './EntryTemplate.vue'
import EditTemplate from './EditTemplate.vue'
import ViewTemplate from './ViewTemplate.vue'

const store = useTemplateStore()
const templates = store.templates
const showCreate = ref(false)
const showEdit = ref(false)
const showView = ref(false)
const selected = ref(null)

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Type', dataIndex: 'template_type', key: 'template_type' },
  { title: 'Actions', key: 'actions' }
]

const view = (record) => {
  selected.value = record
  showView.value = true
}

const edit = (record) => {
  selected.value = record
  showEdit.value = true
}

const remove = async (id) => {
  await store.deleteTemplate(id)
}

const onCloseCreate = () => {
  showCreate.value = false
  store.fetchTemplates()
}

const onCloseEdit = () => {
  showEdit.value = false
  selected.value = null
  store.fetchTemplates()
}

const onCloseView = () => {
  showView.value = false
  selected.value = null
}

onMounted(() => {
  store.fetchTemplates()
})
</script>
