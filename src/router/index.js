import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Original routes that work
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/accounts/IndexAccount.vue'),
    },
    {
      path: '/accounts/new',
      name: 'new-account',
      component: () => import('../views/accounts/NewAccount.vue'),
    },
    {
      path: '/accounts/:id/edit',
      name: 'edit-account',
      component: () => import('../views/accounts/EditAccount.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/underwriters',
      name: 'underwriters',
      component: () => import('../views/underwriters/IndexUnderwriter.vue'),
    },
    {
      path: '/crm',
      name: 'crm',
      component: () => import('../views/people/IndexPeople.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/Profile.vue'),
    },
    {
      path: '/packages',
      name: 'packages',
      component: () => import('../views/PackagesView.vue'),
    },
    {
      path: '/age-groups',
      name: 'age-groups',
      component: () => import('../views/AgeGroupsView.vue'),
    },
    // Routes that match the existing directories
    {
      path: '/personnel',
      name: 'personnel',
      component: () => import('../views/personnels/IndexPersonnel.vue'),
    },
    {
      path: '/policy',
      name: 'policy',
      component: () => import('../views/policy/EditPolicy.vue'),
    },
    {
      path: '/premium',
      name: 'premium',
      component: () => import('../views/premium/IndexPremium.vue'),
    },
    {
      path: '/settings/rules',
      name: 'rules',
      component: () => import('../views/rules/IndexRules.vue'),
    },
    {
      path: '/settings/templates',
      name: 'templates',
      component: () => import('../views/templates/IndexTemplate.vue'),
    },
    {
      path: '/settings/notifications',
      name: 'notifications',
      component: () => import('../views/notify/IndexNotify.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    }
  ],
})

export default router
