import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api.js';

export const useUnderwritersStore = defineStore('underwriters', () => {
  const underwriters = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchUnderwriters = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.get('/underwriters');
      console.log('API Response:', res.data);
      
      if (Array.isArray(res.data)) {
        underwriters.value = res.data;
      } else {
        console.error('Expected array but got:', typeof res.data);
        error.value = 'Invalid data format received from server';
      }
    } catch (err) {
      error.value = 'Failed to load underwriters: ' + (err.message || 'Unknown error');
      console.error('Error fetching underwriters:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    underwriters,
    loading,
    error,
    fetchUnderwriters,
  };
});
