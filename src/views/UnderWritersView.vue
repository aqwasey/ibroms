<template>
    <div class="p-4">
      
      <TableComponent
        :columns="columns"
        :data="data"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :current-page="currentPage"
        @page-changed="onPageChanged"
        @action="onAction"
        @add-item="onAddItem"
        @edit-item="onEditItem"
        @delete-item="onDeleteItem"
        title="Underwriters"
        search-placeholder="Search underwriter"
        button-label="New Underwriter"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import TableComponent from '@/components/TableComponent.vue';
  
  // Define columns configuration
  const columns = [
    { key: 'itemCode', label: 'ITEM CODE' },
    { key: 'title', label: 'TITLE' },
    { key: 'createdOn', label: 'CREATED ON' },
    { key: 'updatedOn', label: 'UPDATED ON' },
    { key: 'description', label: 'DESCRIPTION' },
  ];
  
  // Pagination settings
  const itemsPerPage = ref(10);
  const currentPage = ref(1);
  
  // Dummy data - represents products from an API
  const allProducts = ref([
    { 
      id: 'R492', 
      itemCode: 'R492', 
      title: 'Harmony', 
      createdOn: 'Just now', 
      updatedOn: '3 hours ago', 
      description: 'This is a dummy text for the description' 
    },
    { 
      id: 'A948', 
      itemCode: 'A948', 
      title: 'Harmony', 
      createdOn: '3 days ago', 
      updatedOn: '3 days ago', 
      description: 'There is an asset that needs to be updated' 
    },
    { 
      id: 'T459', 
      itemCode: 'T459', 
      title: 'Harmony', 
      createdOn: 'Last week', 
      updatedOn: 'Last week', 
      description: 'This is also a good idea that needs implementation' 
    },
    { 
      id: 'D943', 
      itemCode: 'D943', 
      title: 'Harmony', 
      createdOn: 'Sept. 6, 2023', 
      updatedOn: 'Sept. 7, 2023', 
      description: 'For the benefits of people who are also viewing' 
    },
    { 
      id: 'S946', 
      itemCode: 'S946', 
      title: 'Harmony', 
      createdOn: 'Sept. 9, 2023', 
      updatedOn: 'Sept. 19, 2023', 
      description: 'This is a title for the description that needs to be updated' 
    },
    { 
      id: 'P493', 
      itemCode: 'P493', 
      title: 'Harmony', 
      createdOn: 'Aug. 12, 2023', 
      updatedOn: 'Aug. 21, 2023', 
      description: 'Could there be a reason for the implementation to be delayed' 
    },
    { 
      id: 'B944', 
      itemCode: 'B944', 
      title: 'Harmony', 
      createdOn: 'Aug. 02, 2023', 
      updatedOn: 'Aug. 12, 2023', 
      description: 'A very descriptive part of the whole process' 
    },
    { 
      id: 'C425', 
      itemCode: 'C425', 
      title: 'Harmony', 
      createdOn: 'Aug. 04, 2023', 
      updatedOn: 'Aug. 14, 2023', 
      description: 'Description that talks about the way things work' 
    },
    { 
      id: 'X123', 
      itemCode: 'X123', 
      title: 'Serenity', 
      createdOn: 'Jul. 15, 2023', 
      updatedOn: 'Jul. 25, 2023', 
      description: 'A new product with enhanced features and improved design' 
    },
    { 
      id: 'Y456', 
      itemCode: 'Y456', 
      title: 'Tranquility', 
      createdOn: 'Jul. 10, 2023', 
      updatedOn: 'Jul. 20, 2023', 
      description: 'Premium version with additional customization options' 
    },
    { 
      id: 'Z789', 
      itemCode: 'Z789', 
      title: 'Bliss', 
      createdOn: 'Jun. 28, 2023', 
      updatedOn: 'Jul. 05, 2023', 
      description: 'Entry-level model with essential features only' 
    },
    { 
      id: 'G111', 
      itemCode: 'G111', 
      title: 'Harmony Plus', 
      createdOn: 'Jun. 15, 2023', 
      updatedOn: 'Jun. 25, 2023', 
      description: 'Enhanced version with premium materials and extended warranty' 
    },
    { 
      id: 'H222', 
      itemCode: 'H222', 
      title: 'Harmony Pro', 
      createdOn: 'Jun. 05, 2023', 
      updatedOn: 'Jun. 15, 2023', 
      description: 'Professional grade model with advanced capabilities' 
    },
    { 
      id: 'J333', 
      itemCode: 'J333', 
      title: 'Harmony Lite', 
      createdOn: 'May. 25, 2023', 
      updatedOn: 'Jun. 05, 2023', 
      description: 'Compact version designed for portability and convenience' 
    },
    { 
      id: 'K444', 
      itemCode: 'K444', 
      title: 'Harmony Ultra', 
      createdOn: 'May. 15, 2023', 
      updatedOn: 'May. 25, 2023', 
      description: 'Ultimate version with all available features and premium support' 
    },
  ]);
  
  // Calculate total items for pagination
  const totalItems = computed(() => allProducts.value.length);
  
  // Get current page data - in a real app, this would likely come from an API
  const data = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return allProducts.value.slice(start, end);
  });
  
  // Event handlers
  const onPageChanged = (page) => {
    currentPage.value = page;
    console.log(`Page changed to: ${page}`);
    // In a real app, you might fetch data for the new page here
  };
  
  const onAction = ({ action, item }) => {
    console.log(`Action ${action} performed on:`, item);
  };
  
  const onAddItem = () => {
    console.log('Adding new product');
    // In a real app, you might show a form or modal here
  };
  
  const onEditItem = (item) => {
    console.log('Editing product:', item);
    // In a real app, you might show a form or modal with item data here
  };
  
  const onDeleteItem = (item) => {
    console.log('Delete request for product:', item);
    
    // Simple confirmation
    if (confirm(`Are you sure you want to delete product ${item.itemCode}?`)) {
      // Remove from our local data
      allProducts.value = allProducts.value.filter(p => p.id !== item.id);
      console.log(`Product ${item.itemCode} deleted`);
      
      // In a real app, you would make an API call here
    }
  };
  </script>
  
  