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
      <ProvinceSelect 
        v-model="locationData" 
        provinceLabel="Province" 
        cityLabel="Town/City" 
      />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import InputField from '@/components/InputField.vue';
import ButtonBase from '@/components/ButtonBase.vue';
import PhoneInput from '@/components/PhoneInput.vue';
import ProvinceSelect from '@/components/ProvinceSelect.vue';
import notificationService from '@/services/notificationService';
import { isValidEmail, sanitizeInput, validatePassword, isValidSAPhoneNumber, validateRequiredFields } from '@/utils/validation';

const router = useRouter();

// Form fields
const business_name = ref('');
const regis_no = ref('');
const phone = ref('');
const email = ref('');
const locationData = ref({ province: '', city: '' });
const password = ref('');
const confirmPassword = ref('');

// Province/city data is now handled by the ProvinceSelect component

const register = async () => {
  // Create a data object with all form fields
  const formData = {
    business_name: business_name.value?.trim(),
    regis_no: regis_no.value?.trim(),
    phone: phone.value?.trim(),
    email: email.value?.trim(),
    province: locationData.value.province,
    town_city: locationData.value.city,
    password: password.value,
    confirmPassword: confirmPassword.value
  };

  // Validate all required fields are filled
  const requiredFieldsResult = validateRequiredFields(
    formData,
    ['business_name', 'regis_no', 'phone', 'email', 'province', 'town_city', 'password', 'confirmPassword']
  );
  
  if (!requiredFieldsResult.isValid) {
    const missingField = requiredFieldsResult.missingFields[0];
    const fieldNames = {
      'business_name': 'Business Name',
      'regis_no': 'Registration Number',
      'phone': 'Phone Number',
      'email': 'Email',
      'province': 'Province',
      'town_city': 'Town/City',
      'password': 'Password',
      'confirmPassword': 'Confirm Password'
    };
    notificationService.error(`${fieldNames[missingField]} is required`);
    return;
  }
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    notificationService.error('Passwords do not match');
    return;
  }

  // Validate email format
  if (!isValidEmail(formData.email)) {
    notificationService.error('Please enter a valid email address');
    return;
  }

  // Validate password strength
  const passwordValidation = validatePassword(formData.password, { 
    minLength: 6,
    requireNumbers: true 
  });
  
  if (!passwordValidation.isValid) {
    notificationService.error(passwordValidation.errors[0]);
    return;
  }

  // Validate phone number (South African format)
  if (!isValidSAPhoneNumber(formData.phone)) {
    notificationService.error('Please enter a valid South African phone number');
    return;
  }

  // Sanitize inputs
  const sanitizedData = {
    business_name: sanitizeInput(formData.business_name),
    regis_no: sanitizeInput(formData.regis_no),
    phone: `+27${formData.phone.replace(/\D/g, '')}`,
    email: sanitizeInput(formData.email),
    province: sanitizeInput(formData.province),
    town_city: sanitizeInput(formData.town_city),
    password: formData.password
  };

  try {
    // Show success for demo
    notificationService.success('Registration successful! Please verify your email.');
    console.log('Registering business with:', sanitizedData);

    // For demo purposes, navigate to verification page
    router.push('/verify-email');
  } catch (error) {
    console.error('Registration error:', error);
    notificationService.error('An error occurred during registration. Please try again.');
  }
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
