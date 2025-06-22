<template>
  <div class="p-4">
    <a-button type="primary" @click="showEntry = true">Add Rule</a-button>
    <a-table :columns="columns" :data-source="rules" rowKey="id" :loading="loading" size="small" class="mt-4">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" @click="viewRule(record)">View</a-button>
            <a-button type="link" @click="editRule(record)">Edit</a-button>
            <a-popconfirm title="Confirm delete?" @confirm="deleteRule(record.id)">
              <a-button danger type="link">Delete</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <EntryRule v-if="showEntry" @close="showEntry = false" />
    <EditRule v-if="selectedRule && showEdit" :rule="selectedRule" @close="closeEdit" />
    <ViewRule v-if="selectedRule && showView" :rule="selectedRule" @close="closeView" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRulesStore } from '@/stores/rules'
import EntryRule from './EntryRule.vue'
import EditRule from './EditRule.vue'
import ViewRule from './ViewRule.vue'

const store = useRulesStore()
const rules = store.rules
const loading = ref(false)

const showEntry = ref(false)
const showEdit = ref(false)
const showView = ref(false)
const selectedRule = ref(null)

const columns = [
  { title: 'Title', dataIndex: 'title' },
  { title: 'Limit Type', dataIndex: 'limit_type' },
  { title: 'Description', dataIndex: 'description' },
  { title: 'Service List', dataIndex: 'service_list', customRender: ({ text }) => text.join(', ') },
  { title: 'Status', dataIndex: 'status', customRender: ({ text }) => text ? 'Active' : 'Inactive' },
  { title: 'Created At', dataIndex: 'created_at', customRender: ({ text }) => new Date(text).toLocaleDateString() },
  { title: 'Actions', key: 'actions' }
]

const loadAllRules = async () => {
  loading.value = true
  await store.fetchRulesByCompanyId('company-id') // Replace with real ID
  loading.value = false
}

const loadRules = async () => {
  loading.value = true
  await store.fetchRulesByCompanyId('company-id') // Replace with real ID
  loading.value = false
}

const viewRule = rule => {
  selectedRule.value = rule
  showView.value = true
}

const editRule = rule => {
  selectedRule.value = rule
  showEdit.value = true
}

const deleteRule = async id => {
  await store.deleteRuleById(id)
  await loadRules()
}

const closeEdit = () => {
  selectedRule.value = null
  showEdit.value = false
  loadRules()
}

const closeView = () => {
  selectedRule.value = null
  showView.value = false
}

// onMounted(loadAllRules)
</script>
