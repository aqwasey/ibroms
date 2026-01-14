# Vue.js CRUD Development Template for IBROMS Project

## Project Context
This is a Vue 3 + Vite application using Composition API and Pinia for state management. The project follows a consistent CRUD pattern across all modules with reusable components and standardized architecture.

## API Base
- **Unified Service**: `import.meta.env.VITE_API_BASE_URL` (https://beeco-api.onrender.com) - All modules use the same API host

## Established CRUD Pattern

### 1. API Service Template (`/src/services/moduleApi.js`)
```javascript
import axios from 'axios';
import authService from './authService';

const moduleApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://beeco-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Auth interceptors (copy from peopleApi.js)
// CRUD methods: getAllModules(), addModule(), updateModule(), deleteModule(), getModuleById()
```

### 2. Pinia Store Template (`/src/stores/module.js`)
```javascript
import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { moduleApiService } from '@/services/moduleApi'

export const useModuleStore = defineStore('module', () => {
  const items = ref([])
  const currentItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // CRUD actions with error handling
  const fetchAllItems = async () => { /* ... */ }
  const createItem = async (data) => { /* ... */ }
  const updateItem = async (data) => { /* ... */ }
  const deleteItem = async (id) => { /* ... */ }
  
  return {
    items: readonly(items),
    currentItem: readonly(currentItem),
    loading: readonly(loading),
    error: readonly(error),
    fetchAllItems,
    createItem,
    updateItem,
    deleteItem
  }
})
```

### 3. Component Structure (`/src/views/module/`)
- **IndexModule.vue**: Main list with TableComponent, PageHeader, search, pagination
- **NewModule.vue**: Create modal with InputField/SelectField components
- **EditModule.vue**: Update modal with pre-populated form
- **ViewModule.vue**: Read-only modal with InfoCard/InfoGrid layout
- **ConfirmDeleteModule.vue**: Delete confirmation modal

### 4. Standard Components Used
- `TableComponent`: Data table with built-in actions (view, edit, delete)
- `Modal`: Consistent modal wrapper with size options
- `InputField`/`SelectField`: Form inputs with validation support
- `PageHeader`: Title, subtitle, search, and action button
- `InfoCard`/`InfoGrid`: Display layouts for view modals
- `NoDataFound`: Empty state component

### 5. Navigation Integration
**Router** (`/src/router/index.js`):
```javascript
{
  path: '/module',
  name: 'Module',
  component: () => import('@/views/module/IndexModule.vue')
}
```

**Sidenav** (`/src/components/Sidenav.vue`):
```javascript
// Add under appropriate section (Business, etc.)
{ name: 'Modules', icon: 'icon-name', route: '/module' }
```

### 6. Field Mapping Rules
- Table column `key` must match API response field names exactly
- Handle snake_case (API) vs camelCase (frontend) differences
- Use validation from `@/composables/useInputValidation.js`

### 7. Existing Modules Reference
- **Underwriters**: Basic CRUD with main service
- **Packages**: Full CRUD with currency validation
- **Group Schemes**: Complete CRUD matching packages pattern
- **People**: Advanced CRUD on unified API, multiple creation types

## Development Checklist
1. [ ] Create API service with auth interceptors
2. [ ] Create Pinia store with CRUD operations
3. [ ] Create 5 component files (Index, New, Edit, View, ConfirmDelete)
4. [ ] Add route to router
5. [ ] Add menu item to Sidenav
6. [ ] Test CRUD operations
7. [ ] Verify field mapping matches API response

## Key Files to Reference
- `/src/services/api.js` - Main service API template
- `/src/stores/underwriters.js` - Basic store template
- `/src/stores/packages.js` - Advanced store with validation
- `/src/views/underwriters/IndexUnderwriter.vue` - Simple index template
- `/src/views/packages/IndexPackage.vue` - Advanced index template
- `/src/views/packages/NewPackage.vue` - Form template with validation
- `/src/components/Sidenav.vue` - Navigation structure

Use this template when creating new CRUD modules to maintain consistency across the application.
