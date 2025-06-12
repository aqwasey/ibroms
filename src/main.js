import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from "@sentry/vue";

import Vueform from '@vueform/vueform/plugin'
import vueformConfig from '../vueform.config'
import '@vueform/vueform/themes/vueform/scss/index.scss';

import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(createPinia())
// app.use(Message);
app.use(router)

Sentry.init({
  app,
  dsn: "https://e2aad700d918c19f32cc624172f1abfa@o4509254309117952.ingest.us.sentry.io/4509258766352384",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

app.use(Vueform, vueformConfig)
app.mount('#app')
