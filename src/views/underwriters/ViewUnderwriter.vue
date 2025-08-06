<template>
  <Modal
    :show="show"
    :close="() => $emit('update:show', false)"
    title="View Underwriter"
    variant="view"
    :showActions="false"
  >
    <div class="view-container">
      <!-- Header Section -->
      <div class="view-header">
        <div class="underwriter-info">
          <h2 class="underwriter-name">{{ underwriter.name }}</h2>
          <div class="underwriter-meta">
            <span :class="['status-indicator', underwriter.active ? 'active' : 'inactive']">
              {{ underwriter.active ? 'Active' : 'Inactive' }}
            </span>
            <span class="sector-tag">{{ underwriter.sector }}</span>
          </div>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="view-content">
        <!-- Basic Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Basic Information
            </h3>
          </div>
          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Underwriter Name</span>
                <span class="info-value">{{ underwriter.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Sector</span>
                <span class="info-value">{{ underwriter.sector }}</span>
              </div>
              <div class="info-item full-width" v-if="underwriter.description">
                <span class="info-label">Description</span>
                <p class="info-description">{{ underwriter.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Location Information
            </h3>
          </div>
          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Province</span>
                <span class="info-value">{{ underwriter.province }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Town/City</span>
                <span class="info-value">{{ underwriter.town_city }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact Information
            </h3>
          </div>
          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Website</span>
                <div class="website-info" v-if="underwriter.website">
                  <a
                    :href="formatWebsiteUrl(underwriter.website)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="website-link"
                  >
                    {{ underwriter.website }}
                    <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="info-item" v-if="underwriter.logo">
                <span class="info-label">Logo</span>
                <div class="logo-container">
                  <img
                    :src="underwriter.logo"
                    :alt="underwriter.name + ' logo'"
                    class="logo-circular"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              System Information
            </h3>
          </div>
          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Created On</span>
                <span class="info-value">{{ formatDate(underwriter.created_on) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Modal from '@/components/Modal.vue'
import { COLORS } from '@/constants/colors.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  underwriter: {
    type: Object,
    required: true
  }
})

defineEmits(['update:show'])

// Format date string to a more readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return the original string if there's an error
  }
}

// Format website URL to ensure it has a protocol
const formatWebsiteUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

// Handle image loading errors
const handleImageError = (event) => {
  event.target.style.display = 'none';
}
</script>

<style scoped>
.view-container {
  padding: 0.5rem;
}

/* Header Section */
.view-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #CF7F08 0%, #A66500 100%);
  border-radius: 1rem;
  color: white;
}

.underwriter-info {
  text-align: center;
}

.underwriter-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.underwriter-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-indicator {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-indicator.active {
  background-color: rgba(39, 174, 96, 0.2);
  color: #dcfce7;
  border: 1px solid rgba(39, 174, 96, 0.3);
}

.status-indicator.inactive {
  background-color: rgba(234, 84, 85, 0.2);
  color: #fecaca;
  border: 1px solid rgba(234, 84, 85, 0.3);
}

.sector-tag {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Content Section */
.view-content {
  display: grid;
  gap: 1.5rem;
}

/* Info Cards */
.info-card {
  background: #FCFCFD;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #F0F0F0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  padding: 1.25rem 1.5rem;
  background-color: #F7F8FA;
  border-bottom: 1px solid #E0E0E0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #334054;
  margin: 0;
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #CF7F08;
}

.card-content {
  padding: 1.5rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #222222;
  line-height: 1.5;
}

.info-value.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background-color: #f1f5f9;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

.info-description {
  font-size: 1rem;
  color: #757575;
  line-height: 1.6;
  margin: 0;
  padding: 1rem;
  background-color: #FBF3E7;
  border-radius: 0.5rem;
  border-left: 4px solid #CF7F08;
}

/* Website Info */
.website-info {
  display: flex;
  align-items: center;
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #CF7F08;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #CF7F081A;
  background-color: #FBF3E7;
  transition: all 0.2s ease;
}

.website-link:hover {
  color: #A66500;
  background-color: #FBF3E7;
  border-color: #CF7F08;
  transform: translateY(-1px);
}

.external-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Logo Container */
.logo-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo-circular {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.logo-circular:hover {
  border-color: #CF7F08;
  box-shadow: 0 4px 12px rgba(207, 127, 8, 0.2);
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .view-container {
    padding: 0.25rem;
    max-height: 70vh;
  }

  .view-header {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .underwriter-name {
    font-size: 1.5rem;
  }

  .underwriter-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-item.full-width {
    grid-column: 1;
  }

  .card-header {
    padding: 1rem;
  }

  .card-content {
    padding: 1rem;
  }

  .view-content {
    gap: 1rem;
  }
}

/* Custom Scrollbar */
.view-container::-webkit-scrollbar {
  width: 8px;
}

.view-container::-webkit-scrollbar-track {
  background: #F7F8FA;
  border-radius: 4px;
}

.view-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #CF7F08 0%, #A66500 100%);
  border-radius: 4px;
}

.view-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #A66500 0%, #CF7F08 100%);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  animation: fadeInUp 0.5s ease-out;
}

.info-card:nth-child(2) {
  animation-delay: 0.1s;
}

.info-card:nth-child(3) {
  animation-delay: 0.2s;
}

.info-card:nth-child(4) {
  animation-delay: 0.3s;
}
</style>
