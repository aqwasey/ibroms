<template>
  <div class="p-6">
    <PageHeader
      title="Policies"
      subtitle="Manage all policies"
      showSearchInput
      :showButton="true"
      buttonText="Add Policy"
      @buttonClick="showAddModal = true"
    />

    <TableComponent
      :columns="columns"
      :data="policies"
      :loading="loading"
      :showViewAction="true"
      :showEditAction="true"
      :showDeleteAction="true"
      :selectable="true"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @selection-change="handleSelectionChange"
    />

    <!-- Modals -->
    <NewPolicy v-model:show="showAddModal" @policy-added="handlePolicyAdded" />
    <EditPolicy
      v-model:show="showEditModal"
      :policy-id="selectedPolicyId"
      @policy-updated="handlePolicyUpdated"
    />
    <ViewPolicy
      v-model:show="showViewModal"
      :policy-id="selectedPolicyId"
    />
    <ConfirmDeletePolicy
      v-model:show="showDeleteModal"
      :item-id="selectedPolicyId"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { usePolicyStore } from '@/stores/policy'
import { peopleApiService } from '@/services/peopleApi.js'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'
import NewPolicy from '@/views/policy/NewPolicy.vue'
import EditPolicy from '@/views/policy/EditPolicy.vue'
import ViewPolicy from '@/views/policy/ViewPolicy.vue'
import ConfirmDeletePolicy from '@/views/policy/ConfirmDeletePolicy.vue'

const messageApi = inject('messageApi')
const policyStore = usePolicyStore()

// Table config
const columns = [
  { label: 'Policy No.', key: 'policy_no' },
  { label: 'Status', key: 'status' },
  { label: 'BIN', key: 'bin' },
  { label: 'Cover Amount', key: 'cover_amount' },
  { label: 'Premium', key: 'premium' },
  { label: 'Inception Date', key: 'inception_date' },
  { label: 'Waiting Period', key: 'waiting_period' }
]

// State
const loading = ref(false)
const policies = ref([])
const selectedPolicyId = ref('')

// Modal visibility state
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)

// Lifecycle hooks
onMounted(async () => {
  await fetchPolicies()
})

// Methods
const fetchPolicies = async () => {
  loading.value = true
  try {
    const response = await peopleApiService.getPoliciesThisWeek()
    console.log('Fetched policies:', response)

    if (response && response.data) {
      policies.value = response.data
    } else if (Array.isArray(response)) {
      policies.value = response
    } else {
      policies.value = []
    }
  } catch (error) {
    console.error('Error fetching policies:', error)
    messageApi.error('Failed to fetch policies')
    policies.value = []
  } finally {
    loading.value = false
  }
}

const handlePolicyAdded = () => {
  fetchPolicies()
  showAddModal.value = false
  messageApi.success('Policy added successfully')
}

const handlePolicyUpdated = () => {
  fetchPolicies()
  showEditModal.value = false
  messageApi.success('Policy updated successfully')
}

const handleView = (policy) => {
  selectedPolicyId.value = policy.id
  showViewModal.value = true
}

const handleEdit = (policy) => {
  selectedPolicyId.value = policy.id
  showEditModal.value = true
}

const handleDelete = (policy) => {
  selectedPolicyId.value = policy.id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  loading.value = true
  try {
    await policyStore.deletePolicy(selectedPolicyId.value)
    await fetchPolicies()
    showDeleteModal.value = false
    messageApi.success('Policy deleted successfully')
  } catch (error) {
    console.error('Error deleting policy:', error)
    messageApi.error('Failed to delete policy')
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selectedIds) => {
  console.log('Selected policies:', selectedIds)
  // You can store the selected IDs for batch operations or other actions
}
</script>
