<template>
  <div class="w-full overflow-hidden" @click="closeDropdowns">
    <div class="overflow-x-auto">
      <div class="border rounded-lg border-gray-200" :style="{ backgroundColor: colors.WHITE }">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <!-- Checkbox column header (if selectable) -->
              <th v-if="selectable" class="w-16 px-5 py-4 border-b"
                :style="{ backgroundColor: colors.GRAY_50, borderColor: colors.BORDER }">
                <div class="flex items-center justify-center">
                  <label class="inline-flex cursor-pointer" :for="`select-all-checkbox`">
                    <input
                      type="checkbox"
                      :id="`select-all-checkbox`"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                      :style="{ accentColor: colors.PRIMARY }"
                      v-model="allSelected"
                      @change="toggleSelectAll"
                    >
                    <span class="sr-only">Select All</span>
                  </label>
                </div>
              </th>

              <!-- Regular column headers -->
              <th v-for="column in columns" :key="column.key"
                class="text-left font-medium px-5 py-4 text-xs uppercase border-b"
                :style="{
                  backgroundColor: colors.GRAY_50,
                  color: colors.TEXT_PRIMARY,
                  borderColor: colors.BORDER
                }">
                {{ column.label }}
              </th>

              <!-- Action column header -->
              <th class="w-16 px-5 py-4 border-b"
                :style="{ backgroundColor: colors.GRAY_50, borderColor: colors.BORDER }">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="item.id || item.key"
              :style="{ backgroundColor: index % 2 === 0 ? colors.WHITE : colors.GRAY_50 }">

              <!-- Row checkbox (if selectable) -->
              <td v-if="selectable" class="px-5 py-4 align-middle">
                <div class="flex items-center justify-center">
                  <label class="inline-flex cursor-pointer" :for="`row-checkbox-${item.id || index}`">
                    <input
                      type="checkbox"
                      :id="`row-checkbox-${item.id || index}`"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                      :style="{ accentColor: colors.PRIMARY }"
                      :checked="isSelected(item.id || item.key)"
                      @change="toggleSelect(item.id || item.key)"
                    >
                    <span class="sr-only">Select row</span>
                  </label>
                </div>
              </td>

              <!-- Row data cells -->
              <td v-for="column in columns" :key="`${item.id}-${column.key}`"
                class="px-5 py-4 align-middle"
                :class="column.class"
                :style="{ color: colors.TEXT_BODY }">
                {{ truncateText(item[column.key]) }}
              </td>
              <td class="px-5 py-4 text-right">
                <div class="relative inline-block">
                  <button @click.stop="toggleActionMenu(item.id || item.key)"
                    class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <EllipsisVertical size="18" :color="colors.GRAY_600" />
                  </button>
                  <div v-if="activeActionMenu === (item.id || item.key)"
                    class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32"
                    :style="{ borderColor: colors.BORDER }">
                    <div class="py-1">
                      <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        :style="{ color: colors.TEXT_BODY }"
                        @click="handleAction('edit', item)">
                        <span class="w-4 h-4 flex items-center justify-center">✏️</span>
                        <span>Edit</span>
                      </button>
                      <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        :style="{ color: colors.DANGER }"
                        @click="handleAction('delete', item)">
                        <span class="w-4 h-4 flex items-center justify-center">🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center px-5 py-4 border-t" :style="{ borderColor: colors.BORDER }">
          <div class="text-sm" :style="{ color: colors.TEXT_SECONDARY }">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex gap-2">
            <ButtonBase
              label="Previous"
              variant="secondary"
              :disabled="currentPage === 1"
              @click="previousPage"
            />
            <ButtonBase
              label="Next"
              variant="secondary"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EllipsisVertical, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { COLORS } from '@/constants/colors'
import ButtonBase from '@/components/ButtonBase.vue'

const colors = COLORS;

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
  searchPlaceholder: {
    type: String,
    default: 'Search ...',
  },
  buttonLabel: {
    type: String,
    default: 'Add item',
  },
  selectable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit-item', 'delete-item', 'action', 'selection-change'])

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

// Selection state management
const selectedItems = ref([])

// Check if a specific item is selected
const isSelected = (itemId) => {
  return selectedItems.value.includes(itemId)
}

// Select all checkbox state
const allSelected = computed({
  get: () => {
    return paginatedData.value.length > 0 && selectedItems.value.length === paginatedData.value.length
  },
  set: (value) => {
    // This will be handled by toggleSelectAll
  }
})

// Toggle selection of a single item
const toggleSelect = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index === -1) {
    selectedItems.value.push(itemId)
  } else {
    selectedItems.value.splice(index, 1)
  }

  emit('selection-change', selectedItems.value)
}

// Toggle selection of all items
const toggleSelectAll = () => {
  if (allSelected.value) {
    // If all are selected, unselect all
    selectedItems.value = []
  } else {
    // If not all are selected, select all visible items
    selectedItems.value = paginatedData.value.map(item => item.id || item.key)
  }

  emit('selection-change', selectedItems.value)
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
  if (typeof text !== 'string') return text;

  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>
