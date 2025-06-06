import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component:MainLayout ,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('../views/ProductView.vue'),
        },
        {
          path: '/accounts',
          name: 'accounts',
          component: () => import('../views/BankAccountsView.vue'),
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('../views/CategoryView.vue'),
        },
         
    {
      path: '/underwriters',
      name: 'underwriters',
      component: () => import('../views/UnderWritersView.vue'),
    },
    {
      path: '/crm',
      name: 'crm',
      component: () => import('../views/CrmView.vue'),
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

      ],
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: () => import('../views/auth/SignUp.vue'),
      
    }
  ,
  {
    path: '/forget-password',
    name: 'forgetPassword',
    component: () => import('../views/auth/ForgetPassword.vue'),
    
  }
    
  ],
})

export default router
