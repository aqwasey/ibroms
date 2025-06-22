<template>
  <div class="space-y-2">
    <h2 class="text-base underline">Personal Details</h2>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Othername</span>
      <span class="col-span-2">{{ modelValue.othername }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Surname</span>
      <span class="col-span-2">{{ modelValue.surname }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Gender</span>
      <span class="col-span-2">{{ modelValue.gender }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">ID Type</span>
      <span class="col-span-2">{{ modelValue.id_type }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">ID Number</span>
      <span class="col-span-2">{{ modelValue.idno }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Birthdate</span>
      <span class="col-span-2">{{ modelValue.birthdate }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Created At</span>
      <span class="col-span-2">{{ modelValue.created_on }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Updated At</span>
      <span class="col-span-2">{{ modelValue.updated_on || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Active</span>
      <span class="col-span-2">{{ modelValue.alive ? 'Alive' : 'Deceased' }}</span>
    </div>
  </div>
  <div class="divide-solid" />
  <div>
    <h2 class="text-base underline">Contact Information</h2>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Email</span>
      <span class="col-span-2">{{ modelValue.email || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Mobile</span>
      <span class="col-span-2">{{ modelValue.mobile || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">WhatsApp</span>
      <span class="col-span-2">{{ modelValue.whatsapp || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Province</span>
      <span class="col-span-2">{{ modelValue.province || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">Address</span>
      <span class="col-span-2">{{ modelValue.address || 'N/A' }}</span>
    </div>
    <div class="grid grid-cols-3 pb-2">
      <span class="font-semibold">City</span>
      <span class="col-span-2">{{ modelValue.city || 'N/A' }}</span>
    </div>
  </div>

</template>

<script setup>
defineProps({ modelValue: Object })
</script>
