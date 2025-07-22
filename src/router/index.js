import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login', // Redirect to login page as default
    },
    // Auth routes - rendered directly without dashboard layout
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/password-sent',
      name: 'password-sent',
      component: () => import('../views/auth/PasswordSentView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../views/auth/VerifyEmailView.vue'),
    },
    {
      path: '/verification-success',
      name: 'verification-success',
      component: () => import('../views/auth/VerificationSuccessView.vue'),
    },
    // Dashboard routes - all wrapped in DashboardLayout
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      children: [
        // Dashboard home
        {
          path: '',
          name: 'dashboard',
          component: HomeView,
        },
        // Original routes that work - with adjusted paths
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/products/IndexProduct.vue'),
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: () => import('../views/accounts/IndexAccount.vue'),
        },
        {
          path: 'accounts/new',
          name: 'new-account',
          component: () => import('../views/accounts/NewAccount.vue'),
        },
        {
          path: 'accounts/:id/edit',
          name: 'edit-account',
          component: () => import('../views/accounts/EditAccount.vue'),
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../views/CategoryView.vue'),
        },
        {
          path: 'underwriters',
          name: 'underwriters',
          component: () => import('../views/underwriters/IndexUnderwriter.vue'),
        },
        {
          path: 'crm',
          name: 'crm',
          component: () => import('../views/crm/IndexCrm.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile/Profile.vue'),
        },
        {
          path: 'packages',
          name: 'packages',
          component: () => import('../views/packages/IndexPackage.vue'),
        },
        {
          path: 'age-groups',
          name: 'age-groups',
          component: () => import('../views/AgeGroupsView.vue'),
        },
        // Routes that match the existing directories
        {
          path: 'personnel',
          name: 'personnel',
          component: () => import('../views/personnels/IndexPersonnel.vue'),
        },
        {
          path: 'policy',
          name: 'policy',
          component: () => import('../views/policy/IndexPolicy.vue'),
        },
        {
          path: 'premium',
          name: 'premium',
          component: () => import('../views/premium/IndexPremium.vue'),
        },
        {
          path: 'user-accounts',
          name: 'user-accounts',
          component: () => import('../views/user-accounts/IndexUserAccount.vue'),
        },
        {
          path: 'settings/rules',
          name: 'rules',
          component: () => import('../views/rules/IndexRules.vue'),
        },
        {
          path: 'settings/templates',
          name: 'templates',
          component: () => import('../views/templates/IndexTemplates.vue'),
        },
        {
          path: 'settings/notifications',
          name: 'notifications',
          component: () => import('../views/notify/IndexNotify.vue'),
        },
      ]
    }
  ],
})

export default router
