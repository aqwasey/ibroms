<template>
  <div class="province-select" :class="layoutClass">
    <!-- Province Selection -->
    <div class="select-container">
      <label>{{ provinceLabel }}</label>
      <select 
        v-model="selectedProvince" 
        @change="handleProvinceChange" 
        class="select-field"
        :id="provinceId"
        :disabled="disabled"
      >
        <option value="" disabled>{{ provincePlaceholder }}</option>
        <option 
          v-for="prov in provinces" 
          :key="prov.code" 
          :value="prov.name"
        >
          {{ prov.name }}
        </option>
      </select>
      <p v-if="provinceError" class="error-text">{{ provinceError }}</p>
    </div>

    <!-- City Selection -->
    <div class="select-container" v-if="showCitySelect">
      <label>{{ cityLabel }}</label>
      <select 
        v-model="selectedCity" 
        class="select-field"
        :id="cityId"
        :disabled="disabled || !selectedProvince"
      >
        <option value="" disabled>{{ cityPlaceholder }}</option>
        <option 
          v-for="city in filteredCities" 
          :key="city" 
          :value="city"
        >
          {{ city }}
        </option>
      </select>
      <p v-if="cityError" class="error-text">{{ cityError }}</p>
    </div>
  </div>
</template>

<script>
// Define South African provinces in a normal script block so it's available to defineProps
export const southAfricanProvinces = [
  {
    code: 'EC',
    name: 'Eastern Cape',
    cities: ['East London', 'Gqeberha (Port Elizabeth)', 'Makhanda (Grahamstown)', 'Mthatha', 'Bhisho']
  },
  {
    code: 'FS',
    name: 'Free State',
    cities: ['Bloemfontein', 'Welkom', 'Bethlehem', 'Sasolburg', 'Kroonstad']
  },
  {
    code: 'GP',
    name: 'Gauteng',
    cities: ['Johannesburg', 'Pretoria', 'Soweto', 'Centurion', 'Sandton', 'Midrand', 'Benoni', 'Kempton Park']
  },
  {
    code: 'KZN',
    name: 'KwaZulu-Natal',
    cities: ['Durban', 'Pietermaritzburg', 'Newcastle', 'Richards Bay', 'Ladysmith']
  },
  {
    code: 'LP',
    name: 'Limpopo',
    cities: ['Polokwane', 'Tzaneen', 'Mokopane', 'Musina', 'Thohoyandou']
  },
  {
    code: 'MP',
    name: 'Mpumalanga',
    cities: ['Nelspruit', 'Witbank', 'Secunda', 'Middelburg', 'Ermelo']
  },
  {
    code: 'NC',
    name: 'Northern Cape',
    cities: ['Kimberley', 'Upington', 'Kuruman', 'Springbok', 'De Aar']
  },
  {
    code: 'NW',
    name: 'North West',
    cities: ['Rustenburg', 'Mahikeng', 'Potchefstroom', 'Klerksdorp', 'Brits']
  },
  {
    code: 'WC',
    name: 'Western Cape',
    cities: ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester', 'Mossel Bay']
  }
];
</script>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ province: '', city: '' })
  },
  provinceLabel: {
    type: String,
    default: 'Province'
  },
  provincePlaceholder: {
    type: String,
    default: 'Select province'
  },
  cityLabel: {
    type: String,
    default: 'Town/City'
  },
  cityPlaceholder: {
    type: String,
    default: 'Select town/city'
  },
  provinceId: {
    type: String,
    default: 'province'
  },
  cityId: {
    type: String,
    default: 'town_city'
  },
  provinceError: {
    type: String,
    default: ''
  },
  cityError: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showCitySelect: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    default: 'column', // 'column' or 'row'
    validator: (value) => ['column', 'row'].includes(value)
  },
  provinces: {
    type: Array,
    default: () => southAfricanProvinces
  }
});

const emit = defineEmits(['update:modelValue', 'province-change', 'city-change']);

// Reactive references for province and city
const selectedProvince = ref(props.modelValue.province || '');
const selectedCity = ref(props.modelValue.city || '');

// Computed property for layout class
const layoutClass = computed(() => {
  return props.layout === 'row' ? 'layout-row' : 'layout-column';
});

// Computed property for filtering cities based on selected province
const filteredCities = computed(() => {
  if (!selectedProvince.value) return [];
  const selected = props.provinces.find(p => p.name === selectedProvince.value);
  return selected ? selected.cities : [];
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedProvince.value = newValue.province || '';
    selectedCity.value = newValue.city || '';
  }
}, { deep: true });

// Watch for internal changes and emit updates
watch(selectedProvince, (newValue) => {
  // Reset city when province changes
  if (selectedCity.value && !filteredCities.value.includes(selectedCity.value)) {
    selectedCity.value = '';
  }
  
  emitUpdate();
  emit('province-change', newValue);
});

watch(selectedCity, (newValue) => {
  emitUpdate();
  emit('city-change', newValue);
});

// Handle province change
const handleProvinceChange = () => {
  // Additional logic if needed when province changes
  // Reset city is already handled in the watch
};

// Emit update with both province and city
const emitUpdate = () => {
  emit('update:modelValue', {
    province: selectedProvince.value,
    city: selectedCity.value
  });
};

// Export provinces for reuse in other components
defineExpose({
  southAfricanProvinces
});
</script>

<style scoped>
.province-select {
  width: 100%;
}

/* Column layout (default) */
.layout-column .select-container {
  margin-bottom: 16px;
  width: 100%;
}

/* Row layout */
.layout-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.layout-row .select-container {
  margin-bottom: 0;
  width: 100%;
}

.select-container {
  width: 100%;
}

.select-container label {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #344054;
  margin-bottom: 6px;
}

.select-field {
  width: 100%;
  height: 44px;
  padding: 10px 14px;
  background-color: white;
  border: 1px solid #D0D5DD;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  font-size: 16px;
  color: #344054;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

.select-field:focus {
  outline: none;
  border-color: #CF7F07;
  box-shadow: 0px 0px 0px 4px rgba(207, 127, 7, 0.1);
}

.select-field:disabled {
  background-color: #F9FAFB;
  color: #98A2B3;
  cursor: not-allowed;
}

.error-text {
  color: #F04438;
  font-size: 14px;
  margin-top: 4px;
}
</style>
