<template>
  <div class="w-full overflow-hidden" @click="closeDropdowns">
    <div class="flex justify-between items-center shadow-sm py-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <div class="flex gap-4 items-center">
          <InputField
            v-model="searchQuery"
            placeholder="Search product"
            type="text"
            class="text-center border border-gray-200 rounded bg-gray-50 text-sm"
          />
        <Button @click="$emit('add-item')">New Product</Button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full rounded-lg border-collapse">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="bg-gray-100 text-left text-gray-500 font-semibold p-3 text-sm border-b border-gray-200"
            >
              {{ column.label }}
            </th>
            <th class="w-12 bg-gray-100 border-b border-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in paginatedData"
            :key="item.id || item.key"
            class="border-b border-gray-200 last:border-b-0"
          >
            <td
              v-for="column in columns"
              :key="`${item.id}-${column.key}`"
              :class="['p-3', column.class]"
            >
              {{ truncateText(item[column.key]) }}
            </td>
            <td class="p-3 text-center">
              <div class="relative inline-block">
                <button
                  @click.stop="toggleActionMenu(item.id || item.key)"
                  class="p-1 rounded hover:bg-gray-100 text-gray-500"
                >
                  <EllipsisVertical size="18" />
                </button>
                <div
                  v-if="activeActionMenu === (item.id || item.key)"
                  class="absolute right-0 top-full bg-white border border-gray-200 rounded shadow-lg z-10 min-w-32"
                >
                  <button
                    class="w-full text-left px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                    @click="handleAction('edit', item)"
                  >
                    Edit
                  </button>
                  <button
                    class="w-full text-left px-4 py-2 text-gray-600 text-sm hover:bg-gray-100"
                    @click="handleAction('delete', item)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center p-4 border-t border-gray-200">
      <div class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 1"
          @click="previousPage"
          class="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EllipsisVertical } from 'lucide-vue-next'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  title: {
    type: String,
    default: 'Items',
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add-item', 'edit-item', 'delete-item', 'action'])

const searchQuery = ref('')
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data

  const query = searchQuery.value.toLowerCase()
  return props.data.filter((item) => {
    return Object.values(item).some((value) => String(value).toLowerCase().includes(query))
  })
})

const currentPage = ref(1)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.itemsPerPage)
})

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const activeActionMenu = ref(null)

const toggleActionMenu = (itemId) => {
  if (activeActionMenu.value === itemId) {
    activeActionMenu.value = null
  } else {
    activeActionMenu.value = itemId
  }
}

const handleAction = (action, item) => {
  activeActionMenu.value = null

  if (action === 'edit') {
    emit('edit-item', item)
  } else if (action === 'delete') {
    emit('delete-item', item)
  } else {
    emit('action', { action, item })
  }
}

const closeDropdowns = (event) => {
  if (!event.target.closest('.relative')) {
    activeActionMenu.value = null
  }
}

const truncateText = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>
