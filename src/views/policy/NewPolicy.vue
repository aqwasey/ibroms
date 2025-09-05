<template>
  <Modal
    :show="show"
    @close="handleClose"
    :title="getStepTitle()"
    variant="create"
    size="xl"
    :showActions="false"
  >
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div v-for="step in 5" :key="step" class="flex items-center">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="{
              'text-white': currentStep >= step,
              'text-gray-500': currentStep < step
            }"
            :style="{
              backgroundColor: currentStep >= step ? COLORS.PRIMARY : COLORS.GRAY_200
            }"
          >
            {{ step }}
          </div>
          <div 
            v-if="step < 5"
            class="flex-1 h-1 mx-2"
            :style="{
              backgroundColor: currentStep > step ? COLORS.PRIMARY : COLORS.GRAY_200
            }"
          ></div>
        </div>
      </div>
      <div class="flex justify-between mt-2 text-xs" :style="{ color: COLORS.TEXT_SECONDARY }">
        <span>Product</span>
        <span>Main Member</span>
        <span>Beneficiary</span>
        <span>Members</span>
        <span>Review</span>
      </div>
    </div>

    <!-- Step 1: Product Selection -->
    <div v-if="currentStep === 1" class="space-y-6">
      <div class="border-b pb-4 mb-6" :style="{ borderColor: COLORS.BORDER }">
        <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
          Step 1: Product Selection
        </h3>
        <p class="text-sm mt-1" :style="{ color: COLORS.TEXT_SECONDARY }">
          Select the group scheme and product for this policy
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          v-model="formData.group_scheme"
          label="Group Scheme *"
          :options="groupSchemeOptions"
          placeholder="Select a group scheme"
          required
        />
        
        <SelectField
          v-model="formData.product"
          label="Product/Package *"
          :options="packageOptions"
          placeholder="Select a product"
          required
          @update:modelValue="onProductChange"
        />
      </div>
      
      <!-- Product Details Display -->
      <div v-if="selectedProduct" class="mt-6 p-4 rounded-lg border" :style="{ backgroundColor: COLORS.GRAY_50, borderColor: COLORS.BORDER }">
        <h4 class="font-medium mb-3" :style="{ color: COLORS.TEXT_PRIMARY }">Product Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Cover Amount</label>
            <p class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">{{ formatCurrency(selectedProduct.cover_amount) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Premium</label>
            <p class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">{{ formatCurrency(selectedProduct.base_price) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium" :style="{ color: COLORS.TEXT_SECONDARY }">Waiting Period</label>
            <p class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">{{ selectedProduct.waiting_period }} months</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Main Member Selection -->
    <div v-if="currentStep === 2" class="space-y-6">
      <div class="border-b pb-4 mb-6" :style="{ borderColor: COLORS.BORDER }">
        <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
          Step 2: Main Member Selection
        </h3>
        <p class="text-sm mt-1" :style="{ color: COLORS.TEXT_SECONDARY }">
          Search and select the main member for this policy
        </p>
      </div>
      
      <MemberSelector
        v-model="formData.main_member"
        title="Main Member *"
        :allow-multiple="false"
        @member-selected="onMainMemberSelected"
        @member-removed="onMainMemberRemoved"
      />
      
      <!-- Main Member Details Display -->
      <PersonDetails v-if="selectedMainMember" :person="selectedMainMember" title="Main Member Details" />
    </div>

    <!-- Step 3: Beneficiary Selection -->
    <div v-if="currentStep === 3" class="space-y-6">
      <div class="border-b pb-4 mb-6" :style="{ borderColor: COLORS.BORDER }">
        <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
          Step 3: Beneficiary Selection
        </h3>
        <p class="text-sm mt-1" :style="{ color: COLORS.TEXT_SECONDARY }">
          Search and select the beneficiary for this policy
        </p>
      </div>
      
      <MemberSelector
        v-model="formData.beneficiary"
        title="Beneficiary *"
        :allow-multiple="false"
        @member-selected="onBeneficiarySelected"
        @member-removed="onBeneficiaryRemoved"
      />
      
      <!-- Beneficiary Details Display -->
      <PersonDetails v-if="selectedBeneficiary" :person="selectedBeneficiary" title="Beneficiary Details" />
    </div>

    <!-- Step 4: Additional Members -->
    <div v-if="currentStep === 4" class="space-y-6">
      <div class="border-b pb-4 mb-6" :style="{ borderColor: COLORS.BORDER }">
        <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
          Step 4: Additional Members
        </h3>
        <p class="text-sm mt-1" :style="{ color: COLORS.TEXT_SECONDARY }">
          Optional: Add additional members to this policy
        </p>
      </div>
      
      <MemberSelector
        v-model="formData.additional_members"
        title="Additional Members"
        :allow-multiple="true"
        @member-selected="onAdditionalMemberSelected"
        @member-removed="onAdditionalMemberRemoved"
      />
      
      <!-- Additional Members Details Display -->
      <div v-if="selectedAdditionalMembers.length > 0" class="space-y-4">
        <PersonDetails 
          v-for="(member, index) in selectedAdditionalMembers" 
          :key="member.id" 
          :person="member" 
          :title="`Additional Member ${index + 1} Details`" 
        />
      </div>
    </div>

    <!-- Step 5: Review and Confirmation -->
    <div v-if="currentStep === 5" class="space-y-6">
      <div class="border-b pb-4 mb-6" :style="{ borderColor: COLORS.BORDER }">
        <h3 class="text-lg font-semibold" :style="{ color: COLORS.TEXT_PRIMARY }">
          Step 5: Review and Confirmation
        </h3>
        <p class="text-sm mt-1" :style="{ color: COLORS.TEXT_SECONDARY }">
          Please review all policy details before creating
        </p>
      </div>
      
      <!-- Policy Summary -->
      <PolicySummary 
        :formData="formData"
        :selectedProduct="selectedProduct"
        :selectedGroupScheme="selectedGroupScheme"
        :selectedMainMember="selectedMainMember"
        :selectedBeneficiary="selectedBeneficiary"
        :selectedAdditionalMembers="selectedAdditionalMembers"
      />
      
      <!-- Confirmation Input -->
      <div class="mt-8 p-4 rounded-lg border" :style="{ backgroundColor: COLORS.WARNING_LIGHT, borderColor: COLORS.WARNING }">
        <h4 class="font-medium mb-3" :style="{ color: COLORS.TEXT_PRIMARY }">Confirmation Required</h4>
        <p class="text-sm mb-4" :style="{ color: COLORS.TEXT_PRIMARY }">
          To confirm policy creation, please type the main member's surname: <strong>{{ selectedMainMember?.surname || 'N/A' }}</strong>
        </p>
        <InputField
          v-model="confirmationInput"
          label="Type main member surname to confirm"
          placeholder="Enter surname exactly as shown above"
          required
        />
      </div>
    </div>

    <!-- Custom Action Buttons -->
    <div class="flex justify-between items-center pt-6 border-t mt-8" :style="{ borderColor: COLORS.BORDER }">
      <button
        v-if="currentStep > 1"
        type="button"
        @click="previousStep"
        class="px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        :style="{
          color: COLORS.TEXT_SECONDARY,
          borderColor: COLORS.BORDER,
          backgroundColor: 'white',
          'focus:ring-color': COLORS.PRIMARY_LIGHT
        }"
      >
        Previous
      </button>
      <div v-else></div>
      
      <div class="flex space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          :style="{
            color: COLORS.TEXT_SECONDARY,
            borderColor: COLORS.BORDER,
            backgroundColor: 'white',
            'focus:ring-color': COLORS.PRIMARY_LIGHT
          }"
        >
          Cancel
        </button>
        <button
          v-if="currentStep < 5"
          type="button"
          @click="nextStep"
          :disabled="!isCurrentStepValid"
          class="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :style="{
            backgroundColor: isCurrentStepValid ? COLORS.PRIMARY : COLORS.GRAY_400,
            'focus:ring-color': COLORS.PRIMARY_LIGHT
          }"
        >
          Next
        </button>
        <button
          v-if="currentStep === 5"
          type="button"
          @click="createPolicy"
          :disabled="!isConfirmationValid || creatingPolicy"
          class="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :style="{
            backgroundColor: isConfirmationValid && !creatingPolicy ? COLORS.SUCCESS : COLORS.GRAY_400,
            'focus:ring-color': COLORS.SUCCESS_LIGHT
          }"
        >
          {{ creatingPolicy ? 'Creating Policy...' : 'Create Policy' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { COLORS } from '@/constants/colors.js'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import MemberSelector from '@/components/MemberSelector.vue'
import PersonDetails from '@/components/PersonDetails.vue'
import PolicySummary from '@/components/PolicySummary.vue'
import { useGroupSchemesStore } from '@/stores/group-schemes.js'
import { usePackagesStore } from '@/stores/packages.js'
import { peopleApiService } from '@/services/peopleApi.js'
import { inject } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'policy-created'])
const messageApi = inject('messageApi')

// Stores
const groupSchemesStore = useGroupSchemesStore()
const packagesStore = usePackagesStore()

// Form data
const currentStep = ref(1)
const confirmationInput = ref('')
const creatingPolicy = ref(false)

const formData = ref({
  main_member: '',
  beneficiary: '',
  group_scheme: '',
  product: '',
  cover_amount: '',
  premium: '',
  waiting_period: '',
  additional_members: []
})

// Selected items
const selectedProduct = ref(null)
const selectedGroupScheme = ref(null)
const selectedMainMember = ref(null)
const selectedBeneficiary = ref(null)
const selectedAdditionalMembers = ref([])

// Computed properties
const groupSchemeOptions = computed(() => {
  return groupSchemesStore.groupSchemes.map(scheme => ({
    label: `${scheme.name} (${scheme.code})`,
    value: scheme.id
  }))
})

const packageOptions = computed(() => {
  return packagesStore.packages.map(pkg => ({
    label: `${pkg.title} - ${formatCurrency(pkg.cover_amount || 0)}`,
    value: pkg.id
  }))
})

// Event handlers
const onProductChange = (productId) => {
  const product = packagesStore.packages.find(p => p.id === productId)
  if (product) {
    selectedProduct.value = product
    formData.value.cover_amount = product.cover_amount
    formData.value.premium = product.base_price || 0
    formData.value.waiting_period = product.waiting_period
  } else {
    selectedProduct.value = null
    formData.value.cover_amount = ''
    formData.value.premium = ''
    formData.value.waiting_period = ''
  }
}

// Watch for group scheme changes
watch(() => formData.value.group_scheme, (schemeId) => {
  const scheme = groupSchemesStore.groupSchemes.find(s => s.id === schemeId)
  selectedGroupScheme.value = scheme || null
  
  // Set default scheme if none selected
  if (!schemeId && groupSchemesStore.groupSchemes.length > 0) {
    const defaultScheme = groupSchemesStore.groupSchemes.find(s => s.name?.toLowerCase().includes('default')) || groupSchemesStore.groupSchemes[0]
    formData.value.group_scheme = defaultScheme.id
    selectedGroupScheme.value = defaultScheme
  }
})

// Member selection handlers
const onMainMemberSelected = (member) => {
  selectedMainMember.value = member
  confirmationInput.value = '' // Reset confirmation when main member changes
}

const onMainMemberRemoved = () => {
  selectedMainMember.value = null
  confirmationInput.value = ''
}

const onBeneficiarySelected = (member) => {
  selectedBeneficiary.value = member
}

const onBeneficiaryRemoved = () => {
  selectedBeneficiary.value = null
}

const onAdditionalMemberSelected = (member) => {
  if (!selectedAdditionalMembers.value.find(m => m.id === member.id)) {
    selectedAdditionalMembers.value.push(member)
  }
}

const onAdditionalMemberRemoved = (member) => {
  selectedAdditionalMembers.value = selectedAdditionalMembers.value.filter(m => m.id !== member.id)
}

// Step validation
const isCurrentStepValid = computed(() => {
  const step = currentStep.value
  const data = formData.value
  
  console.log('Step validation:', {
    step,
    group_scheme: data.group_scheme,
    product: data.product,
    groupSchemeOptions: groupSchemeOptions.value.length,
    packageOptions: packageOptions.value.length,
    stores: {
      groupSchemes: groupSchemesStore.groupSchemes.length,
      packages: packagesStore.packages.length
    }
  })
  
  switch (step) {
    case 1: {
      const hasScheme = data.group_scheme && data.group_scheme !== ''
      const hasProduct = data.product && data.product !== ''
      console.log('Step 1 validation:', { hasScheme, hasProduct })
      return hasScheme && hasProduct
    }
    case 2:
      return !!(data.main_member && data.main_member !== '')
    case 3:
      return !!(data.beneficiary && data.beneficiary !== '')
    case 4:
      return true // Additional members are optional
    case 5:
      return isConfirmationValid.value
    default:
      return false
  }
})

const isConfirmationValid = computed(() => {
  return confirmationInput.value.toLowerCase() === (selectedMainMember.value?.surname || '').toLowerCase()
})

// API functions
const createPolicy = async () => {
  if (!isConfirmationValid.value) {
    messageApi.error('Please confirm by typing the main member\'s surname')
    return
  }

  try {
    creatingPolicy.value = true
    messageApi.info('Creating policy...')

    // Map form data to API format
    const policyData = {
      main_member: selectedMainMember.value?.id,
      beneficiary: selectedBeneficiary.value?.id,
      members: selectedAdditionalMembers.value?.map(member => member.id) || [],
      product: selectedProduct.value?.id,
      inception_date: new Date().toISOString().split('T')[0], // Today's date
      cover_amount: parseFloat(formData.value.cover_amount) || 0,
      premium: parseFloat(formData.value.premium) || 0,
      group_scheme: selectedGroupScheme.value?.id,
      waiting_period: parseInt(formData.value.waiting_period) || 0
    }

    console.log('=== POLICY CREATION DEBUG ===')
    console.log('Form Data:', formData.value)
    console.log('Selected Product:', selectedProduct.value)
    console.log('Selected Group Scheme:', selectedGroupScheme.value)
    console.log('Selected Main Member:', selectedMainMember.value)
    console.log('Selected Beneficiary:', selectedBeneficiary.value)
    console.log('Selected Additional Members:', selectedAdditionalMembers.value)
    console.log('Policy Data being sent to API:', JSON.stringify(policyData, null, 2))
    console.log('API Endpoint: POST /policy/')
    console.log('===============================')

    const response = await peopleApiService.createPolicy(policyData)
    console.log('API Response:', response)
    
    if (response && response.status === 1) {
      messageApi.success('Policy created successfully!')
      emit('policy-created', response)
      handleClose()
    } else if (response && response.message) {
      messageApi.success(response.message)
      emit('policy-created', response)
      handleClose()
    } else {
      messageApi.error('Failed to create policy: ' + (response?.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error creating policy:', error)
    console.log('Full error object:', JSON.stringify(error, null, 2))
    
    // Check if it's an API error with response data
    if (error.response && error.response.data) {
      console.log('API Error Response:', error.response.data)
      if (error.response.data.message) {
        messageApi.success(error.response.data.message)
        emit('policy-created', error.response.data)
        handleClose()
        return
      }
    }
    
    messageApi.error('Failed to create policy. Please try again.')
  } finally {
    creatingPolicy.value = false
    selectedProduct.value = null
    selectedGroupScheme.value = null
    selectedMainMember.value = null
    selectedBeneficiary.value = null
  }
}

// Step navigation
const getStepTitle = () => {
  const titles = {
    1: 'Create New Policy - Product Selection',
    2: 'Create New Policy - Main Member',
    3: 'Create New Policy - Beneficiary',
    4: 'Create New Policy - Additional Members',
    5: 'Create New Policy - Review & Confirm'
  }
  return titles[currentStep.value] || 'Create New Policy'
}

const nextStep = () => {
  if (currentStep.value < 5 && isCurrentStepValid.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0)
}

const handleClose = () => {
  // Reset form
  currentStep.value = 1
  confirmationInput.value = ''
  creatingPolicy.value = false
  formData.value = {
    main_member: '',
    beneficiary: '',
    group_scheme: '',
    product: '',
    cover_amount: '',
    premium: '',
    waiting_period: '',
    additional_members: []
  }
  selectedProduct.value = null
  selectedGroupScheme.value = null
  selectedMainMember.value = null
  selectedBeneficiary.value = null
  selectedAdditionalMembers.value = []
  emit('update:show', false)
}

// Lifecycle hooks
onMounted(() => {
  groupSchemesStore.fetchAllGroupSchemes()
  packagesStore.fetchAllPackages()
})

// Watch for modal show/hide to reset form
watch(() => props.show, async (newValue) => {
  if (newValue) {
    await groupSchemesStore.fetchAllGroupSchemes()
    await packagesStore.fetchAllPackages()
    
    // Set default group scheme if available
    setTimeout(() => {
      if (!formData.value.group_scheme && groupSchemesStore.groupSchemes.length > 0) {
        const defaultScheme = groupSchemesStore.groupSchemes.find(s => s.name?.toLowerCase().includes('default')) || groupSchemesStore.groupSchemes[0]
        formData.value.group_scheme = defaultScheme.id
        selectedGroupScheme.value = defaultScheme
      }
    }, 200)
  }
})
</script>
