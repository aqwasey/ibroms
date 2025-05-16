import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from "@sentry/vue";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
// app.use(Message);
app.use(router)

Sentry.init({
  app,
  dsn: 'https://2bf19811c3497fe39d4a2e05c6d73c77@o4509254309117952.ingest.us.sentry.io/4509254311804928',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [],
})

app.mount('#app')
