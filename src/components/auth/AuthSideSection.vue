<template>
  <div class="background-section">
    <!-- Top-right pattern overlay -->
    <div class="pattern-overlay top-right">
      <img src="../../assets/icons/Line-pattern.svg" alt="Pattern" class="pattern-image" />
    </div>

    <!-- Bottom-left pattern overlay -->
    <div class="pattern-overlay bottom-left">
      <img src="../../assets/icons/Line-pattern.svg" alt="Pattern" class="pattern-image" />
    </div>

    <div class="content-container">
      <!-- Main title -->
      <div class="text-container">
        <h1 class="title">{{ title }}</h1>
      </div>

      <!-- Chart image -->
      <div class="chart-container">
        <img src="../../assets/chart-placeholder.svg" alt="Chart" class="chart-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import COLORS from '@/constants/colors';

defineProps({
  title: {
    type: String,
    default: 'Explore What We Have To Offer!'
  },
  cardTitle: {
    type: String,
    default: "We're growing!"
  }
});
</script>

<style scoped>
.background-section {
  flex: 1;
  background-color: v-bind('COLORS.PRIMARY_BG');
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Pattern overlays */
.pattern-overlay {
  position: absolute;
  width: 300px;
  height: 300px;
  opacity: 0.3;
  pointer-events: none;
}

.pattern-overlay.top-right {
  top: 0;
  right: 0;
}

.pattern-overlay.bottom-left {
  bottom: 0;
  left: 0;
}

.pattern-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main content container */
.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
  max-width: 600px;
  padding: 0 32px;
}

/* Title section */
.text-container {
  text-align: center;
  max-width: 450px;
}

.title {
  color: v-bind('COLORS.TEXT_PRIMARY');
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.8px;
  line-height: 48px;
  margin: 0;
}

/* Chart container */
.chart-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.chart-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;

}

/* Circle chart styling */
.circle-chart {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-outer {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 8px solid #E0E0E0;
  border-top: 8px solid v-bind('COLORS.PRIMARY');
  border-right: 8px solid v-bind('COLORS.PRIMARY');
}

.circle-middle {
  position: absolute;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 6px solid #E0E0E0;
  border-right: 6px solid #EEAF4B;
}

.circle-inner {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.checkbox-label {
  color: #344053;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>
