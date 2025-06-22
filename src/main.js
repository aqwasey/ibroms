import './assets/main.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from "@sentry/vue";
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use()
app.use(router)

Sentry.init({
  app,
  dsn: "https://e2aad700d918c19f32cc624172f1abfa@o4509254309117952.ingest.us.sentry.io/4509258766352384",
  sendDefaultPii: true
})

app.mount('#app')
