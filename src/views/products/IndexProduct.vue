<template>
  <div class="p-6">
    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteProduct 
      v-model:show="showConfirm" 
      :itemId="selectedItemId" 
      :productName="selectedItem?.name" 
      @product-deleted="handleProductDeleted" 
    />

    <!-- View Modal -->
    <ViewProduct 
      v-model:show="showViewModal" 
      :product="selectedItem" 
    />
    
    <!-- New Modal -->
    <NewProduct 
      v-model:show="showNewModal" 
      @product-created="handleProductCreated"
    />
    
    <!-- Edit Modal -->
    <EditProduct 
      v-model:show="showEditModal" 
      :product="selectedItem"
      @product-updated="handleProductUpdated"
    />

    <div>
      <PageHeader 
        title="Products" 
        subtitle="Manage all products"
        searchPlaceholder="Search products..."
        buttonText="Add Product"
        @search="handleSearch"
        @button-click="showAddModal"
      />

      <div v-if="store.loading" class="text-gray-500 text-center py-4">
        Loading products...
      </div>
      <div v-else>
        <div v-if="!filteredProducts.length" class="text-gray-500 text-center py-4">
          No products found
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
import { ref, computed, onMounted, inject } from 'vue'
import { useProductsStore } from '@/stores/products'
import NewProduct from '@/views/products/NewProduct.vue'
import EditProduct from '@/views/products/EditProduct.vue'
import ViewProduct from '@/views/products/ViewProduct.vue'
import ConfirmDeleteProduct from '@/views/products/ConfirmDeleteProduct.vue'
import PageHeader from '@/components/PageHeader.vue'
import TableComponent from '@/components/TableComponent.vue'

const showConfirm = ref(false)
const showViewModal = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const messageApi = inject('messageApi')

const store = useProductsStore()

// DUMMY DATA FOR TESTING - REMOVE IN PRODUCTION
const USE_DUMMY_DATA = true; // Set this to false to use real data from API

const DUMMY_PRODUCTS = [
  { 
    id: '1', 
    name: 'Health Insurance Basic', 
    code: 'HIB-001', 
    category: 'Health', 
    underwriter: 'Global Insurance',
    premium: '250'
  },
  { 
    id: '2', 
    name: 'Life Insurance Premium', 
    code: 'LIP-002', 
    category: 'Life', 
    underwriter: 'Secure Life Ltd',
    premium: '500'
  },
  { 
    id: '3', 
    name: 'Auto Insurance Plus', 
    code: 'AIP-003', 
    category: 'Auto', 
    underwriter: 'Motor Protect Inc',
    premium: '350'
  },
  { 
    id: '4', 
    name: 'Property Insurance', 
    code: 'PI-004', 
    category: 'Property', 
    underwriter: 'Home Shield Co',
    premium: '400'
  },
  { 
    id: '5', 
    name: 'Travel Insurance', 
    code: 'TI-005', 
    category: 'Travel', 
    underwriter: 'Journey Safe Corp',
    premium: '150'
  }
];

// Mock the store's data if using dummy data
if (USE_DUMMY_DATA) {
  // Override the store's properties for demo purposes
  store.products = DUMMY_PRODUCTS;
  store.loading = false;
}

onMounted(() => {
  if (!USE_DUMMY_DATA) {
    store.fetchProducts()
  }
})

const columns = [
  { key: 'name', label: 'Product Name' },
  { key: 'code', label: 'Product Code' },
  { key: 'category', label: 'Category' },
  { key: 'underwriter', label: 'Underwriter' },
  { key: 'premium', label: 'Premium' }
]

// Pagination settings
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Calculate total items for pagination
const totalItems = computed(() => filteredProducts.value.length)

// Get current page data - in a real app, this would likely come from an API
const data = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return USE_DUMMY_DATA ? DUMMY_PRODUCTS : store.products;
  
  const query = searchQuery.value.toLowerCase();
  const items = USE_DUMMY_DATA ? DUMMY_PRODUCTS : store.products;
  
  return items.filter(p =>
    p.name?.toLowerCase().includes(query) || 
    p.code?.toLowerCase().includes(query) ||
    p.category?.toLowerCase().includes(query) ||
    p.underwriter?.toLowerCase().includes(query) ||
    p.premium?.toLowerCase().includes(query)
  );
})

// Event handlers
const onPageChanged = (page) => {
  currentPage.value = page
}

const onAction = ({ action, item }) => {
  console.log(`Action ${action} performed on:`, item)

  if (action === 'view') {
    // Show view modal
    selectedItem.value = { ...item } // Create a fresh copy of the item
    console.log('Showing view modal for item:', selectedItem.value)
    showViewModal.value = true
  } else if (action === 'edit') {
    onEditItem(item)
  } else if (action === 'delete') {
    onDeleteItem(item)
  }
}

const showAddModal = () => {
  showNewModal.value = true
}

const onViewItem = (item) => {
  selectedItem.value = { ...item } // Create a fresh copy of the item
  showViewModal.value = true
}

const onEditItem = (item) => {
  selectedItem.value = { ...item } // Create a fresh copy of the item
  showEditModal.value = true
}

const onDeleteItem = (item) => {
  selectedItemId.value = item.id
  selectedItem.value = item
  showConfirm.value = true
}

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleSelectionChange = (selectedIds) => {
  console.log('Selected items:', selectedIds)
  // Do something with the selected IDs
}

// Handle product created event
const handleProductCreated = () => {
  messageApi?.success('Product created successfully!')
  // In a real app, this might refresh the data
  // In our dummy data scenario, we would push to the array
  if (!USE_DUMMY_DATA) {
    store.fetchProducts()
  }
}

// Handle product updated event
const handleProductUpdated = () => {
  messageApi?.success('Product updated successfully!')
  // In a real app, the store would be updated
  if (!USE_DUMMY_DATA) {
    store.fetchProducts()
  }
}

// Handle product deleted event
const handleProductDeleted = () => {
  // The actual delete operation is now handled by ConfirmDeleteProduct component
  selectedItemId.value = null
  selectedItem.value = null
  
  messageApi?.success('Product deleted successfully!')
  if (!USE_DUMMY_DATA) {
    store.fetchProducts()
  }
}
</script>
