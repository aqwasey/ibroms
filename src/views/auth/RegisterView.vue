<template>
  <AuthLayout title="Register Your Business Today and Explore!">
    <!-- Page title and supporting text -->
    <template #page-title>Create Account</template>
    <template #supporting-text>Please enter your business details.</template>

    <!-- Form content -->
    <template #form-content>
      <InputField
        v-model="business_name"
        label="Business Name"
        placeholder="Enter your business name"
      />
      <InputField
        v-model="regis_no"
        label="Registration Number"
        placeholder="Enter business registration number"
      />
      <PhoneInput
        v-model="phone"
        label="Phone Number"
        placeholder="Enter phone number"
      />
      <InputField
        v-model="email"
        label="Email"
        placeholder="Enter your email"
      />
      <div class="select-container">
        <label>Province</label>
        <select v-model="province" @change="handleProvinceChange" class="select-field">
          <option value="" disabled>Select province</option>
          <option v-for="prov in provinces" :key="prov.code" :value="prov.name">{{ prov.name }}</option>
        </select>
      </div>
      <div class="select-container">
        <label>Town/City</label>
        <select v-model="town_city" class="select-field" :disabled="!province">
          <option value="" disabled>Select town/city</option>
          <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <InputField
        v-model="password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />
      <InputField
        v-model="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
      />
    </template>

    <!-- Action buttons -->
    <template #actions>
      <ButtonBase
        label="Create Account"
        variant="primary"
        @click="register"
        class="w-full"
      />
    </template>

    <!-- Footer links -->
    <template #footer-links>
      <div class="text-small checkbox-label">Already have an account?</div>
      <button class="link-button checkbox-label" @click="goToLogin">Log in</button>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import InputField from '@/components/InputField.vue';
import ButtonBase from '@/components/ButtonBase.vue';
import PhoneInput from '@/components/PhoneInput.vue';

const router = useRouter();

// Form fields
const business_name = ref('');
const regis_no = ref('');
const phone = ref('');
const email = ref('');
const province = ref('');
const town_city = ref('');
const password = ref('');
const confirmPassword = ref('');

// South African provinces and their major cities
const provinces = [
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

// Computed property for filtering cities based on selected province
const filteredCities = computed(() => {
  if (!province.value) return [];
  const selectedProvince = provinces.find(p => p.name === province.value);
  return selectedProvince ? selectedProvince.cities : [];
});

// Handle province change
const handleProvinceChange = () => {
  // Reset city selection when province changes
  town_city.value = '';
};

const register = () => {
  // Validate required fields
  const requiredFields = [
    { field: business_name.value, name: 'Business Name' },
    { field: regis_no.value, name: 'Registration Number' },
    { field: phone.value, name: 'Phone Number' },
    { field: email.value, name: 'Email' },
    { field: province.value, name: 'Province' },
    { field: town_city.value, name: 'Town/City' },
    { field: password.value, name: 'Password' },
    { field: confirmPassword.value, name: 'Confirm Password' }
  ];

  for (const item of requiredFields) {
    if (!item.field) {
      alert(`${item.name} is required`);
      return;
    }
  }
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert('Please enter a valid email address');
    return;
  }

  // Validate phone number (South African format)
  const phoneRegex = /^\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    alert('Please enter a valid 9-digit South African phone number (without the +27)');
    return;
  }

  console.log('Registering business with:', {
    business_name: business_name.value,
    regis_no: regis_no.value,
    phone: `+27${phone.value}`,
    email: email.value,
    province: province.value,
    town_city: town_city.value,
    password: password.value,
  });

  // For demo purposes, navigate to verification page
  router.push('/verify-email');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

/* Phone input styling has been moved to PhoneInput.vue component */

/* Select field styling */
.select-container {
  margin-bottom: 16px;
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
</style>
