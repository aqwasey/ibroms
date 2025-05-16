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
      underwriters.value = res.data;
    } catch (err) {
      error.value = 'Failed to load underwriters';
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
