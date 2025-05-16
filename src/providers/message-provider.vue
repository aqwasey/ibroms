<template>
  <context-holder />
  <slot />
</template>

<script setup>
import { message } from 'ant-design-vue';
import { provide } from 'vue';

const [messageApi, contextHolder] = message.useMessage();
provide('messageApi', messageApi);
</script>
