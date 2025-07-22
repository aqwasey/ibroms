<template>
  <div class="auth-layout">
    <div class="section">
      <div class="header-navigation" />
      <div class="container">
        <div class="content">
          <!-- Header with title and supporting text -->
          <header class="header">
            <div class="text-and-supporting">
              <div class="title">
                <slot name="page-title">Login</slot>
              </div>
              <div class="supporting-text">
                <slot name="supporting-text">Please enter your details.</slot>
              </div>
            </div>
          </header>

          <!-- Main form content -->
          <div class="form-container">
            <slot name="form-content"></slot>
          </div>

          <!-- Action buttons section -->
          <div class="actions-section">
            <slot name="actions"></slot>
          </div>

          <!-- Footer links/text -->
          <div class="footer-links">
            <slot name="footer-links"></slot>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="copyright">© Agent App 2023</div>
      </footer>
    </div>
    <AuthSideSection :title="title" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import AuthSideSection from '@/components/auth/AuthSideSection.vue';
import COLORS from '@/constants/colors';

defineProps({
  title: {
    type: String,
    default: 'Explore What We Have To Offer!'
  }
});
</script>

<style scoped>
.auth-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.section {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: v-bind('COLORS.BACKGROUND_SECONDARY');
}

.header-navigation {
  height: 96px;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 32px;
  flex-grow: 1;
}

.content {
  background-color: v-bind('COLORS.WHITE');
  border-radius: 12px;
  box-shadow: -2px -2px 5px rgba(16, 24, 40, 0.06), 2px 2px 5px -1px rgba(16, 24, 40, 0.1);
  padding: 32px 40px;
  width: 440px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
}

/* Common auth page styles moved from individual pages */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
}

.text-and-supporting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.title {
  color: v-bind('COLORS.TEXT_PRIMARY');
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
  text-align: center;
}

.supporting-text {
  color: v-bind('COLORS.GRAY_600');
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  width: 100%;
}

/* Common form elements styling */
:deep(.button) {
  background-color: v-bind('COLORS.PRIMARY') !important;
  border-color: v-bind('COLORS.PRIMARY') !important;
  width: 100%;
  padding: 10px 18px;
  font-size: 16px;
}

.link-button {
  background: none;
  border: none;
  color: v-bind('COLORS.BLACK');
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 0;
  text-decoration: none;
}

.link-button:hover {
  text-decoration: underline;
}

/* Back button styles */
.link-button-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: v-bind('COLORS.BLACK');
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 0;
  text-decoration: none;
}

.link-button-secondary:hover {
  text-decoration: underline;
}

.arrow-left {
  font-size: 16px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.text-small {
  color: v-bind('COLORS.BLACK');
  font-size: 14px;
  line-height: 20px;
}

.footer {
  display: flex;
  align-items: flex-end;
  padding: 32px;
  height: 96px;
  width: 100%;
}

.copyright {
  color: v-bind('COLORS.GRAY_600');
  font-size: 14px;
  line-height: 20px;
}
</style>
